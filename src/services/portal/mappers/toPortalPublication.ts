import type {
  PortalBroker,
  PortalLocation,
  PortalPublicationCreate,
  PortalPublicationUpdate,
} from '../portalPublication'
import type { SpcCharacteristics, SpcProperty } from '../types'

// ========================= Helpers =========================
const toNumber = (v: any, fallback = 0): number => {
  if (v === undefined || v === null || v === '') return fallback
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

/** Strip de HTML portable (SSR/CSR) */
const stripHtml = (html?: string): string => {
  if (!html) return ''
  try {
    if (typeof window !== 'undefined' && 'document' in window) {
      const el = window.document.createElement('div')
      el.innerHTML = html
      return (el.textContent || el.innerText || '').replace(/\s+/g, ' ').trim()
    }
  } catch {}
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const norm = (s?: string | null) => (s ?? '').trim()

const parseFirstInt = (s?: string | null): number | null => {
  const m = (s || '').match(/-?\d+/)
  return m ? Number(m[0]) : null
}

const mapListingType = (v?: string): string => {
  const s = (v || '').toLowerCase()
  if (s.includes('arriendo')) return 'arriendo'
  return 'venta'
}

const mapPropertyType = (v?: string): string => {
  const s = (v || '').toLowerCase()
  const dict: Record<string, string> = {
    departamento: 'departamento',
    depa: 'departamento',
    depto: 'departamento',
    casa: 'casa',
    oficina: 'oficina',
    local: 'local',
    bodega: 'bodega',
    parcela: 'parcela',
    terreno: 'terreno',
  }
  return dict[s] || s || 'departamento'
}

const mapStatus = (v?: string): string => {
  const s = (v || '').toLowerCase()
  if (s.includes('reserv')) return 'reserved'
  if (s.includes('vend')) return 'sold'
  if (s.includes('inact') || s.includes('paus')) return 'inactive'
  return 'available'
}

const mapCondition = (age?: number): string =>
  age !== undefined && age <= 0 ? 'new' : 'used'

const mapLocation = (spc: SpcProperty): PortalLocation => {
  const a = spc.address
  const main = [norm(a?.address), norm(a?.number), norm(a?.letter)]
    .filter(Boolean)
    .join(' ')
  const address = main || norm(a?.addressPublic)

  return {
    address: address || '',
    neighborhood: '',
    commune: norm(a?.city?.name),
    city: norm(a?.city?.name),
    region: norm(a?.state?.name),
    coordinates: { lat: Number(a?.lat), lng: Number(a?.lng) }, // TODO: completar con geocoding si aplica
  }
}

const featuresFromCharacteristics = (c?: SpcCharacteristics): string[] => {
  if (!c) return []
  const out: string[] = []
  const add = (cond: any, label: string) => {
    if (cond) out.push(label)
  }

  add(c.hasHeating, 'calefacción')
  if (c.typeOfHeating) out.push(`calefacción: ${c.typeOfHeating}`)
  add(c.hasAirConditioning, 'aire acondicionado')
  add(c.hasParking, 'estacionamiento')
  add(c.hasGarage, 'garage')
  add(c.hasElevator, 'ascensor')
  add(c.hasGym, 'gimnasio')
  add(c.hasKitchen, 'cocina')
  add(c.hasSwimmingPool, 'piscina')
  add(c.hasSecurity, 'seguridad')
  if (Array.isArray(c.typeOfSecurity)) out.push(...c.typeOfSecurity)
  add(c.locatedInCondominium, 'condominio')
  add(c.isFurnished, 'amoblado')
  add(c.hasBarbecueArea, 'quincho')
  if (c.terraces) out.push(`terraza: ${c.terraces}`)
  if (c.terraceM2) out.push(`terraza m²: ${c.terraceM2}`)
  if (c.numberOfFloors) out.push(`pisos: ${c.numberOfFloors}`)

  return Array.from(new Set(out))
}

const tagsFromSpc = (spc: SpcProperty): string[] => {
  const t: string[] = []
  if (spc.highlighted) t.push('destacado')
  if (spc.typeOfOperationId) t.push(spc.typeOfOperationId.toLowerCase())
  if (spc.typeOfPropertyId) t.push(spc.typeOfPropertyId.toLowerCase())
  if (spc.address?.city?.name) t.push(spc.address.city.name.toLowerCase())
  if (spc.address?.state?.name) t.push(spc.address.state.name.toLowerCase())
  return Array.from(new Set(t))
}

const imagesFromSpc = (
  images?: Array<{ path: string; number?: number }>
): string[] => {
  if (!images?.length) return []
  return [...images]
    .sort((a, b) => toNumber(a.number, 0) - toNumber(b.number, 0))
    .map((i) => i.path)
}

const brokerFromSpc = (spc: SpcProperty): PortalBroker => {
  const name =
    [norm(spc.user?.name), norm(spc.user?.lastName)]
      .filter(Boolean)
      .join(' ') || 'Agente'
  const email = norm(spc.user?.session?.email) || 'contacto@inmobiliaria.cl'
  return { name, phone: '+56 9 0000 0000', email }
}

export function mapSpcToPortalCreate(
  spc: SpcProperty
): PortalPublicationCreate {
  const c = spc.characteristics || {}
  const currency = (spc.currencyId || 'CLP').toUpperCase()
  const price = toNumber(spc.propertyPrice, 0)
  const owner_id = spc?.owner_id

  const price_clp = currency === 'CLP' ? price : 0
  const price_uf = currency === 'UF' ? price : 0

  const age = toNumber(c.age, 0)
  const orientation = norm(c.orientation) || 'N'

  const area_total = toNumber(c.surface, 0)
  const area_useful = toNumber(c.constructedSurface, 0)

  const bedrooms = toNumber(c.bedrooms, 0)
  const bathrooms = toNumber(c.bathrooms, 0)
  const parking =
    c.numberOfParkingSpaces != null
      ? toNumber(c.numberOfParkingSpaces, 0)
      : c.hasParking
      ? 1
      : 0

  const floor = (() => {
    const raw = norm(c.floorLevelLocation)
    const parsed = parseFirstInt(raw)
    return parsed ?? 0
  })()

  const description =
    stripHtml(spc.propertyDescription) || stripHtml(spc.observations) || ''

  return {
    portal: spc?.property_portales?.[0]?.portalName || 'pulsoPropiedades',
    listing_type: mapListingType(spc.typeOfOperationId),
    property_type: mapPropertyType(spc.typeOfPropertyId),
    external_url: spc.externalLink || null,
    code: spc.id,
    title: norm(spc.propertyTitle) || 'Publicación',
    published_at: spc.createdAt || new Date().toISOString(),
    price_clp,
    price_uf,
    currency,
    area_total,
    area_useful,
    unit: 'mt2',
    bedrooms,
    bathrooms,
    parking,
    floor,
    age,
    orientation,
    common_expenses: toNumber(c.commonExpenses, 0),
    condition: mapCondition(age),
    location: mapLocation(spc),
    description,
    features: featuresFromCharacteristics(c),
    tags: tagsFromSpc(spc),
    images: imagesFromSpc(spc.images),
    broker: brokerFromSpc(spc),
    owner_id: owner_id,
    pending_approval: spc?.pending_approval,
  }
}

export function mapSpcToPortalUpdate(
  spc: SpcProperty
): PortalPublicationUpdate {
  const base = mapSpcToPortalCreate(spc)
  return {
    title: base.title,
    status: mapStatus(spc.propertyStatus?.name),
    published_at: base.published_at,
    // scraped_at: base.scraped_at,
    price_clp: base.price_clp,
    price_uf: base.price_uf,
    currency: base.currency,
    area_total: base.area_total,
    area_useful: base.area_useful,
    unit: base.unit,
    bedrooms: base.bedrooms,
    bathrooms: base.bathrooms,
    parking: base.parking,
    floor: base.floor,
    age: base.age,
    orientation: base.orientation,
    common_expenses: base.common_expenses,
    condition: base.condition,
    location: base.location,
    description: base.description,
    features: base.features,
    tags: base.tags,
    images: base.images,
    broker: base.broker,
    consolidated_id: undefined,
    consolidated_status: undefined,
    owner_id: base.owner_id,
  }
}

// ========================= Validación ligera opcional =========================
export type MapperIssue = { field: string; message: string }

/** Valida campos mínimos antes de enviar al portal */
export function validatePortalCreatePayload(
  p: PortalPublicationCreate
): MapperIssue[] {
  const issues: MapperIssue[] = []
  if (!p.title) issues.push({ field: 'title', message: 'Título es requerido' })
  if (!p.code) issues.push({ field: 'code', message: 'Código es requerido' })
  if (!p.property_type)
    issues.push({
      field: 'property_type',
      message: 'Tipo de propiedad es requerido',
    })
  if (!p.listing_type)
    issues.push({
      field: 'listing_type',
      message: 'Tipo de operación es requerido',
    })
  if (!p.currency)
    issues.push({ field: 'currency', message: 'Moneda es requerida' })
  if (!p.location?.city)
    issues.push({ field: 'location.city', message: 'Ciudad es requerida' })
  return issues
}

/** Helper para componer y validar desde tu `data` */
export function composeCreateFromSpc(spc: SpcProperty) {
  const payload = mapSpcToPortalCreate(spc)
  const issues = validatePortalCreatePayload(payload)
  return { payload, issues }
}
