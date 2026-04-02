import jsPDF from 'jspdf'

type PropertySheetFeature = {
  label: string
  value: string
}

type GeneratePropertySheetOptions = {
  logoUrl?: string
  fileName?: string
  descriptionOverride?: string
}

const SHEET_COLORS = {
  pageBg: [255, 255, 255] as const,
  border: [160, 160, 160] as const,
  text: [18, 18, 18] as const,
  muted: [110, 110, 110] as const,
  soft: [210, 210, 210] as const,
  white: [255, 255, 255] as const,
}

const PAGE_PADDING = 40
const PAGE_BORDER_INSET = 12
const PAGE_FOOTER_Y_OFFSET = 56
const FIRST_PAGE_MAIN_FEATURE_COUNT = 8

const OMIT_CHARACTERISTIC_KEYS = new Set(['rol'])

const FEATURE_EXCLUDED_FROM_GRID = new Set([
  'bedrooms',
  'bathrooms',
  'surface',
  'constructedSurface',
  'commonExpenses',
  'propertyDescription',
  'propertyTitle',
])

const CHARACTERISTIC_LABELS: Record<string, string> = {
  terraces: 'Terraza',
  terraceM2: 'Terraza m²',
  numberOfFloors: 'Número de pisos',
  numberOfVacantFloors: 'Número de pisos libres',
  numberOfMeetingRooms: 'Número de salas de reunión',
  numberOfParkingSpaces: 'Cantidad de estacionamientos',
  numberOfPrivate: 'Número de privados',
  numberOfDepartment: 'Número de departamento',
  typeOfKitchen: 'Tipo de cocina',
  typeOfHeating: 'T. de calefa.',
  typeOfSecurity: 'Tipo de seguridad',
  typeOfBuilding: 'Tipo de construcción',
  typeOfWinery: 'Tipo de bodega',
  typeOfFarm: 'Tipo de predio agrícola',
  typeOfParking: 'Tipo de estacionamiento',
  typeOfParkingCoverage: 'Cobertura del esta.',
  typeOfCemeteryPlot: 'Tipo de sepultura',
  typeOfProperty: 'Tipo de propiedad',
  typeOfOperation: 'Tipo de operación',

  officeNumber: 'Número de oficina',
  floorLevelLocation: 'Ubicación en el nivel',
  surfaceUnit: 'Unidad de superficie',
  commonExpenses: 'Gastos comunes',
  surface: 'Superficie',
  constructedSurface: 'Superficie construida',
  geography: 'Geografía',
  storageCount: 'Bodegas',
  ceilingType: 'Tipo de cielo',
  flooringType: 'Tipo de piso',
  contactHours: 'Horario de contacto',
  yearOfConstruction: 'Año de construcción',
  landShape: 'Forma del terreno',
  distanceToAsphalt: 'Distancia al asfalto',
  houseType: 'Tipo de casa',
  floorNumber: 'Piso',
  unitNumber: 'Número de unidad',
  apartmentType: 'Tipo de departamento',
  departmentType: 'Tipo de departamento',
  unitsPerFloor: 'Unidades por piso',
  apartmentsPerFloor: 'Deps. por piso',
  buildingName: 'Nombre del edificio',
  buildingType: 'Tipo de edificio',
  frontageMeters: 'Metros de frente',
  deepMeters: 'Metros de fondo',
  cellarHeight: 'Altura de bodega',
  cellarHeightUnit: 'Unidad de altura de bodega',
  pricePerUnitOfArea: 'Precio por unidad de superficie',
  pricePerUnitOfAreaUnit: 'Unidad del precio por superficie',
  floorStand: 'Resistencia de piso',
  floorStandUnit: 'Unidad de resistencia de piso',
  flatbedTrailers: 'Cantidad de rampas planas',
  bathroomsPerFloor: 'Baños por piso',
  officesPerFloor: 'Oficinas por piso',
  hectares: 'Hectáreas',
  coveredHullAread: 'Superficie de casco cubierto',
  coveredHullAreadUnit: 'Unidad de casco cubierto',
  sectionWithinTheCemetery: 'Sección dentro del cementerio',
  depth: 'Profundidad',
  depthUnit: 'Unidad de profundidad',
  cementeryName: 'Nombre del cementerio',
  width: 'Ancho',
  widthUnit: 'Unidad de ancho',
  long: 'Largo',
  longUnit: 'Unidad de largo',
  ggcc: 'Gastos comunes',
  orientation: 'Orientación',

  hasHeating: 'Calefacción',
  hasAirConditioning: 'Aire acondicionado',
  hasParking: 'Estacionamiento',
  hasGarage: 'Garage',
  hasElevator: 'Ascensor',
  hasGym: 'Gimnasio',
  hasKitchen: 'Cocina',
  hasKitchenet: 'Kitchenette',
  hasSwimmingPool: 'Piscina',
  hasSecurity: 'Seguridad',
  locatedInCondominium: 'Ubicada en condominio',
  isFurnished: 'Amoblado',
  hasBarbecueArea: 'Quincho',
  hasHomeOffice: 'Espacio para home office',
  hasYard: 'Patio',
  hasDiningRoom: 'Comedor',
  hasJacuzzi: 'Jacuzzi',
  hasSuite: 'Suite',
  hasLivingRoom: 'Living',
  hasWalkInCloset: 'Walking closet',
  hasFireplace: 'Chimenea',
  hasPlayground: 'Juegos infantiles',
  hasServiceRoom: 'Pieza de servicio',
  hasGuestBathroom: 'Baño de visita',
  has24hConcierge: 'Conserjería 24h',
  hasInternetAccess: 'Internet',
  hasNaturalGas: 'Gas natural',
  hasRunningWater: 'Agua potable',
  hasTelephoneLine: 'Línea telefónica',
  hasSewerConnection: 'Alcantarillado',
  hasElectricity: 'Electricidad',
  hasLaundryRoom: 'Lavandería',
  petsAllowed: 'Mascotas permitidas',
  hasElectricGenerator: 'Generador eléctrico',
  hasBoiler: 'Boiler',
  hasBolier: 'Boiler',
  hasRooftop: 'Azotea transitable',
  hasLoggia: 'Loggia',
  hasClosets: 'Closets',
  hasVisitorParking: 'Estacionamientos de visita',
  hasGreenAreas: 'Áreas verdes',
  hasRefrigerator: 'Refrigerador',
  hasSauna: 'Sauna',
  hasControlledAccess: 'Acceso controlado',
  hasSurveillanceCamera: 'Cámara de vigilancia',
  hasAlarm: 'Alarma',
  hasClosedCondominium: 'Condominio cerrado',
  hasWheelchairRamp: 'Acceso universal',
  hasConcierge: 'Conserjería',
  hasPartyRoom: 'Salón de eventos',
  hasMultipurposeRoom: 'Sala multiuso',
  condominiumClosed: 'Condominio cerrado',
  hasWasherConnection: 'Conexión para lavadora',
  hasWashingMachineConnection: 'Conexión para lavadora',
  hasBalcony: 'Balcón',
  hasCinemaArea: 'Sala de cine',
  hasCowork: 'Espacio de cowork',
  hasMeetingRooms: 'Salas de reunión',
  hasLobby: 'Lobby',
  hasReceptionArea: 'Recepción',
  hasHouse: 'Casa',
  hasMansard: 'Mansarda',
  hasMultiSportsCourt: 'Cancha multideportiva',
  hasSolarEnergy: 'Energía solar',
  hasCistern: 'Cisterna',
  hasSecondLevel: 'Segundo nivel',
  hasFlatSurface: 'Superficie plana',
  hasThreephaseCurrent: 'Corriente trifásica',
  hasVentilationSystem: 'Sistema de ventilación',
  hasFireProtectionSystem: 'Sistema contra incendios',
  hasFreeFloor: 'Planta libre',
  hasValetParking: 'Valet parking',
  hasSimpleParking: 'Estacionamiento simple',
  hasDoubleParking: 'Estacionamiento doble',
  hasSubway: 'Cercano al metro',
  hasReforestation: 'Reforestación',
  hasWarehouses: 'Bodegas',
  hasLocationCentral: 'Ubicación central',
  hasFittingRoom: 'Probador',
  hasDrinkingFountains: 'Bebederos',
  hasWaterTank: 'Estanque de agua',
  hasBarn: 'Granero',
  hasMills: 'Molinos',
  hasCorral: 'Corral',
  hasSilos: 'Silos',
  hasEntryHall: 'Hall de acceso',
  hasOffice: 'Oficina',
  hasDisplayCase: 'Vitrina',
  hasHotWater: 'Agua caliente',
  hasThermalPanel: 'Panel térmico',
  hasSecurityMesh: 'Malla de seguridad',
  hasEventHall: 'Salón de eventos',
  hasAutomaticGate: 'Portón automático',
  isUrbanized: 'Urbanizado',
}

const FEATURE_PRIORITY = [
  'orientation',
  'constructedSurface',
  'terraces',
  'terraceM2',
  'floorNumber',
  'numberOfFloors',
  'apartmentsPerFloor',
  'typeOfKitchen',
  'typeOfHeating',
  'hasHeating',
  'hasAirConditioning',
  'hasParking',
  'numberOfParkingSpaces',
  'storageCount',
  'hasElevator',
  'hasGym',
  'hasSwimmingPool',
  'hasSecurity',
  'typeOfSecurity',
  'locatedInCondominium',
  'hasControlledAccess',
  'has24hConcierge',
  'hasConcierge',
  'hasVisitorParking',
  'hasGreenAreas',
  'hasBarbecueArea',
  'hasHomeOffice',
  'hasDiningRoom',
  'hasLivingRoom',
  'hasSuite',
  'hasWalkInCloset',
  'hasServiceRoom',
  'hasGuestBathroom',
  'hasLaundryRoom',
  'hasRooftop',
  'hasJacuzzi',
  'hasSauna',
  'hasClosets',
  'hasInternetAccess',
  'hasNaturalGas',
  'hasTelephoneLine',
  'hasRefrigerator',
  'hasSurveillanceCamera',
  'hasAlarm',
  'hasElectricGenerator',
  'hasBoiler',
  'hasClosedCondominium',
  'hasWheelchairRamp',
]

const FEATURE_UNIT_SUFFIX: Record<string, string> = {
  surface: 'm²',
  constructedSurface: 'm²',
  terraceM2: 'm²',
}

const FALLBACK_TOKEN_TRANSLATIONS: Record<string, string> = {
  type: 'tipo',
  parking: 'estacionamiento',
  coverage: 'cobertura',
  access: 'acceso',
  office: 'oficina',
  offices: 'oficinas',
  room: 'sala',
  rooms: 'salas',
  meeting: 'reunión',
  washing: 'lavadora',
  machine: '',
  connection: 'conexión',
  security: 'seguridad',
  thermal: 'térmico',
  panel: 'panel',
  event: 'evento',
  hall: 'hall',
  entry: 'acceso',
  display: 'vitrina',
  case: '',
  automatic: 'automático',
  gate: 'portón',
  free: 'libre',
  floor: 'piso',
  floors: 'pisos',
  valet: 'valet',
  hot: 'caliente',
  water: 'agua',
  lobby: 'lobby',
  reception: 'recepción',
  party: 'eventos',
  multipurpose: 'multiuso',
  wheelchairs: 'universal',
  wheelchair: 'universal',
  ramp: 'acceso',
  controlled: 'controlado',
  surveillance: 'vigilancia',
  camera: 'cámara',
  visitor: 'visita',
  green: 'verdes',
  areas: 'áreas',
  natural: 'natural',
  gas: 'gas',
  electric: 'eléctrico',
  generator: 'generador',
  boiler: 'boiler',
  balcony: 'balcón',
  cinema: 'cine',
  cowork: 'cowork',
  rooftop: 'azotea',
  closets: 'closets',
  refrigerator: 'refrigerador',
  sauna: 'sauna',
  home: 'home',
}

const getByPath = (obj: any, path: string) => {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

const pickFirst = <T = unknown>(obj: any, paths: string[]): T | undefined => {
  for (const path of paths) {
    const value = getByPath(obj, path)

    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      !(typeof value === 'number' && Number.isNaN(value))
    ) {
      return value as T
    }
  }

  return undefined
}

const pickFirstString = (obj: any, paths: string[]) => {
  const value = pickFirst<any>(obj, paths)

  if (typeof value === 'string') {
    return value.trim()
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

const pickFirstNumber = (obj: any, paths: string[]) => {
  const value = pickFirst<any>(obj, paths)

  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value
  }

  if (typeof value === 'string') {
    const cleaned = value
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
    const parsed = Number(cleaned)

    return Number.isNaN(parsed) ? undefined : parsed
  }

  return undefined
}

const loadImageAsDataUrl = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('No fue posible crear el contexto del canvas'))
        return
      }

      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }

    img.onerror = (error) => reject(error)
    img.src = url
  })

const normalizeImageFormat = (dataUrl: string): 'JPEG' | 'PNG' => {
  return dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
}

const toTitleCase = (value: string) => {
  if (!value) return ''

  return value
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const stripHtml = (html: string) => {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

const formatCurrency = (value?: number, currency = 'CLP') => {
  if (value === undefined || value === null || Number.isNaN(value)) return ''

  if (currency === 'CLP') {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (currency === 'UF') {
    return `${new Intl.NumberFormat('es-CL', {
      maximumFractionDigits: 0,
    }).format(value)} UF`
  }

  if (currency === 'USD') {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return `${new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 0,
  }).format(value)} ${currency}`
}

const formatArea = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) return ''

  return `${new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 0,
  }).format(value)} m²`
}

const getOperationName = (property: any) => {
  return (
    pickFirstString(property, [
      'typeOfOperation.name',
      'operationType.name',
      'operationTypeName',
      'typeOfOperationId',
    ]) || 'Operación'
  )
}

const getPropertyTypeName = (property: any) => {
  return (
    pickFirstString(property, [
      'typeOfProperty.name',
      'propertyType.name',
      'propertyTypeName',
      'typeOfPropertyId',
    ]) || 'Propiedad'
  )
}

const getPropertyPublicAddress = (property: any) => {
  return pickFirstString(property, [
    'address.address',
    'address.addressPublic',
    'publicAddress',
    'addressPublic',
  ])
}

const getPropertyCity = (property: any) => {
  return pickFirstString(property, ['address.city.name', 'city.name', 'city'])
}

const getPropertyState = (property: any) => {
  return pickFirstString(property, [
    'address.state.name',
    'state.name',
    'state',
  ])
}

const getPrimaryPrice = (property: any) => {
  const numericPrice = pickFirstNumber(property, [
    'propertyPrice',
    'price',
    'priceAmount',
    'salePrice',
    'rentPrice',
    'amount',
  ])

  const currency =
    pickFirstString(property, ['currencyId', 'currency.code', 'currency']) ||
    'CLP'

  return formatCurrency(numericPrice, currency)
}

const getSecondaryPrice = (property: any) => {
  const currency =
    pickFirstString(property, ['currencyId', 'currency.code', 'currency']) ||
    'CLP'

  if (currency === 'UF') {
    const clpValue = pickFirstNumber(property, [
      'priceClp',
      'priceCLP',
      'clpPrice',
      'salePriceClp',
      'rentPriceClp',
    ])

    return clpValue ? formatCurrency(clpValue, 'CLP') : ''
  }

  if (currency === 'CLP') {
    const ufValue = pickFirstNumber(property, [
      'priceUf',
      'priceUF',
      'ufPrice',
      'salePriceUf',
      'rentPriceUf',
    ])

    return ufValue ? formatCurrency(ufValue, 'UF') : ''
  }

  return ''
}

const getCommonExpenses = (property: any) => {
  const value = pickFirstNumber(property, [
    'characteristics.commonExpenses',
    'commonExpenses',
    'expenses.common',
    'gastosComunes',
    'commonExpense',
  ])

  if (value === undefined) return ''

  return `Gastos comunes desde ${formatCurrency(value, 'CLP')}`
}

const getPropertyImages = (property: any) => {
  if (!Array.isArray(property?.images)) return []

  return [...property.images]
    .sort((a: any, b: any) => {
      const aNumber =
        typeof a?.number === 'number' ? a.number : Number.MAX_SAFE_INTEGER
      const bNumber =
        typeof b?.number === 'number' ? b.number : Number.MAX_SAFE_INTEGER

      return aNumber - bNumber
    })
    .map((image: any) => {
      if (typeof image === 'string') return image
      if (typeof image?.path === 'string') return image.path
      if (typeof image?.url === 'string') return image.url
      if (typeof image?.imageUrl === 'string') return image.imageUrl
      if (typeof image?.src === 'string') return image.src
      return ''
    })
    .filter(Boolean)
}

const getPropertyDescription = (property: any) => {
  const rawDescription =
    pickFirstString(property, [
      'propertyDescription',
      'description',
      'publicationDescription',
      'characteristics.propertyDescription',
      'summary',
    ]) || 'Sin descripción disponible.'

  return stripHtml(rawDescription)
}

const buildPdfProperty = (
  property: any,
  options?: GeneratePropertySheetOptions
) => {
  const override = options?.descriptionOverride?.trim()

  if (!override) return property

  return {
    ...property,
    propertyDescription: override,
    description: override,
    publicationDescription: override,
    summary: override,
    characteristics: {
      ...(property?.characteristics ?? {}),
      propertyDescription: override,
    },
  }
}

const getMainFacts = (property: any) => {
  const bedrooms = pickFirstNumber(property, [
    'characteristics.bedrooms',
    'bedrooms',
    'dormitories',
    'bedroomCount',
  ])

  const bathrooms = pickFirstNumber(property, [
    'characteristics.bathrooms',
    'bathrooms',
    'bathroomCount',
  ])

  const totalSurface = pickFirstNumber(property, [
    'characteristics.constructedSurface',
    'characteristics.surface',
    'constructedSurface',
    'surface',
    'totalSurface',
    'totalArea',
  ])

  const facts: string[] = []

  if (bedrooms !== undefined) {
    facts.push(`${bedrooms} dorm.`)
  }

  if (bathrooms !== undefined) {
    facts.push(`${bathrooms} baños`)
  }

  if (totalSurface !== undefined) {
    facts.push(`${formatArea(totalSurface)} totales`)
  }

  return facts
}

const prettifyCharacteristicKey = (key: string) => {
  const normalized = key
    .replace(/^has/, '')
    .replace(/^is/, '')
    .replace(/^numberOf/, 'number ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()

  return normalized
    .split(' ')
    .filter(Boolean)
    .map((word, index) => {
      const translated =
        FALLBACK_TOKEN_TRANSLATIONS[word.toLowerCase()] ?? word.toLowerCase()

      if (!translated) return ''

      if (index === 0) {
        return translated.charAt(0).toUpperCase() + translated.slice(1)
      }

      return translated
    })
    .filter(Boolean)
    .join(' ')
}

const isMeaningfulCharacteristic = (key: string, value: unknown) => {
  if (OMIT_CHARACTERISTIC_KEYS.has(key)) return false
  if (FEATURE_EXCLUDED_FROM_GRID.has(key)) return false
  if (value === null || value === undefined) return false

  if (typeof value === 'boolean') {
    return value === true
  }

  if (Array.isArray(value)) {
    return value.some((item) => String(item ?? '').trim() !== '')
  }

  if (typeof value === 'string') {
    const normalized = value.trim()
    return normalized !== '' && normalized !== '0'
  }

  if (typeof value === 'number') {
    return !Number.isNaN(value) && value > 0
  }

  return true
}

const formatCharacteristicValue = (key: string, value: unknown) => {
  if (typeof value === 'boolean') {
    return 'Sí'
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? '').trim())
      .filter(Boolean)
      .join(', ')
  }

  if (typeof value === 'number') {
    const suffix = FEATURE_UNIT_SUFFIX[key]
    return suffix ? `${value} ${suffix}` : String(value)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (!trimmed) return ''

    if (FEATURE_UNIT_SUFFIX[key]) {
      return `${trimmed} ${FEATURE_UNIT_SUFFIX[key]}`
    }

    return trimmed
  }

  return String(value)
}

const dedupeFeatures = (
  features: Array<PropertySheetFeature & { key: string }>
) => {
  const seen = new Set<string>()

  return features.filter((feature) => {
    const uniqueKey = `${feature.label}:${feature.value}`

    if (seen.has(uniqueKey)) {
      return false
    }

    seen.add(uniqueKey)
    return true
  })
}

const getHighlightedFeatures = (property: any): PropertySheetFeature[] => {
  const characteristics = property?.characteristics ?? {}

  const dynamicFeatures = Object.entries(characteristics)
    .filter(([key, value]) => isMeaningfulCharacteristic(key, value))
    .map(([key, value]) => ({
      key,
      label: CHARACTERISTIC_LABELS[key] || prettifyCharacteristicKey(key),
      value: formatCharacteristicValue(key, value),
    }))
    .filter((feature) => feature.value !== '')

  const orderedFeatures = dedupeFeatures(dynamicFeatures).sort((a, b) => {
    const indexA = FEATURE_PRIORITY.indexOf(a.key)
    const indexB = FEATURE_PRIORITY.indexOf(b.key)

    const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA
    const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB

    if (safeIndexA !== safeIndexB) {
      return safeIndexA - safeIndexB
    }

    return a.label.localeCompare(b.label, 'es')
  })

  return orderedFeatures.map(({ label, value }) => ({ label, value }))
}

const drawImagePlaceholder = (
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  doc.setFillColor(217, 238, 249)
  doc.rect(x, y, width, height, 'F')

  doc.setFillColor(255, 255, 255)
  doc.circle(x + width * 0.72, y + height * 0.22, 10, 'F')
  doc.rect(x, y + height * 0.72, width, height * 0.28, 'F')

  doc.setFillColor(190, 220, 120)
  doc.triangle(
    x,
    y + height * 0.82,
    x + width * 0.42,
    y + height * 0.58,
    x + width * 0.7,
    y + height * 0.82,
    'F'
  )

  doc.setFillColor(134, 172, 0)
  doc.triangle(
    x + width * 0.25,
    y + height * 0.88,
    x + width * 0.72,
    y + height * 0.62,
    x + width,
    y + height * 0.88,
    'F'
  )
}

const drawPageFrame = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setFillColor(...SHEET_COLORS.pageBg)
  doc.rect(0, 0, pageWidth, pageHeight, 'F')

  doc.setDrawColor(...SHEET_COLORS.border)
  doc.setLineWidth(2)
  doc.rect(
    PAGE_BORDER_INSET,
    PAGE_BORDER_INSET,
    pageWidth - PAGE_BORDER_INSET * 2,
    pageHeight - PAGE_BORDER_INSET * 2
  )
}

const drawFooter = (doc: jsPDF) => {
  const pageHeight = doc.internal.pageSize.getHeight()

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(...SHEET_COLORS.muted)
  doc.text('2026 Pulso Propiedades', 52, pageHeight - PAGE_FOOTER_Y_OFFSET)
}

const createContinuationPage = (doc: jsPDF, title: string) => {
  doc.addPage()
  drawPageFrame(doc)
  drawFooter(doc)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...SHEET_COLORS.text)
  doc.setFontSize(18)
  doc.text(title, 40, 50)

  return 86
}

const getFooterLimitY = (doc: jsPDF) => {
  return doc.internal.pageSize.getHeight() - PAGE_FOOTER_Y_OFFSET - 20
}

const drawWrappedParagraphBlock = (
  doc: jsPDF,
  title: string,
  text: string,
  startY: number,
  options?: {
    pageTitleOnNewPage?: string
  }
) => {
  const maxWidth = doc.internal.pageSize.getWidth() - PAGE_PADDING * 2
  const lineHeight = 13
  let y = startY

  const drawSectionTitle = (titleText: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...SHEET_COLORS.text)
    doc.setFontSize(14)
    doc.text(titleText, PAGE_PADDING, y)
    y += 24
  }

  const lines = doc.splitTextToSize(text, maxWidth)

  const ensureRoomFor = (neededHeight: number, repeatedTitle?: string) => {
    if (y + neededHeight <= getFooterLimitY(doc)) return

    y = createContinuationPage(
      doc,
      options?.pageTitleOnNewPage || 'Información adicional'
    )

    if (repeatedTitle) {
      drawSectionTitle(repeatedTitle)
    }
  }

  drawSectionTitle(title)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...SHEET_COLORS.text)

  const chunk: string[] = []

  for (const line of lines) {
    if (y + (chunk.length + 1) * lineHeight > getFooterLimitY(doc)) {
      if (chunk.length > 0) {
        doc.text(chunk, PAGE_PADDING, y)
        y += chunk.length * lineHeight + 18
        chunk.length = 0
      }

      y = createContinuationPage(
        doc,
        options?.pageTitleOnNewPage || 'Información adicional'
      )

      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...SHEET_COLORS.text)
      doc.setFontSize(14)
      doc.text(`${title} (continuación)`, PAGE_PADDING, y)
      y += 24

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...SHEET_COLORS.text)
    }

    chunk.push(line)
  }

  if (chunk.length > 0) {
    ensureRoomFor(chunk.length * lineHeight)
    doc.text(chunk, PAGE_PADDING, y)
    y += chunk.length * lineHeight + 18
  }

  return y
}

const drawAdditionalFeaturesBlock = (
  doc: jsPDF,
  features: PropertySheetFeature[],
  startY: number
) => {
  let y = startY
  const labelX = PAGE_PADDING
  const valueX = 200

  const drawSectionTitle = (title: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...SHEET_COLORS.text)
    doc.setFontSize(14)
    doc.text(title, PAGE_PADDING, y)
    y += 24
  }

  drawSectionTitle('Más características')

  for (const feature of features) {
    if (y + 18 > getFooterLimitY(doc)) {
      y = createContinuationPage(doc, 'Información adicional')
      drawSectionTitle('Más características')
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(...SHEET_COLORS.text)
    doc.text(`${feature.label}:`, labelX, y)

    doc.setFont('helvetica', 'normal')
    const maxValueWidth =
      doc.internal.pageSize.getWidth() - valueX - PAGE_PADDING
    const valueLines = doc.splitTextToSize(feature.value, maxValueWidth)

    doc.text(valueLines, valueX, y)

    y += Math.max(18, valueLines.length * 12)
  }

  return y + 12
}

export const generatePropertySheetPdf = async (
  property: any,
  options?: GeneratePropertySheetOptions
) => {
  const doc = new jsPDF('p', 'pt', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - PAGE_PADDING * 2
  const logoUrl = options?.logoUrl || '/img/logo/logo.pdf.jpeg'
  const pdfProperty = buildPdfProperty(property, options)

  drawPageFrame(doc)

  const propertyType = toTitleCase(getPropertyTypeName(pdfProperty))
  const operationName = toTitleCase(getOperationName(pdfProperty))

  const normalizeLocationPart = (value: string) =>
    value.replace(/\s+/g, ' ').trim()

  const joinUniqueLocationParts = (parts: string[]) => {
    const result: string[] = []

    for (const rawPart of parts) {
      const part = normalizeLocationPart(rawPart)

      if (!part) continue

      const lowerPart = part.toLowerCase()

      const alreadyIncluded = result.some((existing) => {
        const lowerExisting = existing.toLowerCase()

        return (
          lowerExisting === lowerPart ||
          lowerExisting.includes(lowerPart) ||
          lowerPart.includes(lowerExisting)
        )
      })

      if (!alreadyIncluded) {
        result.push(part)
      }
    }

    return result.join(', ')
  }

  const propertyStreetAddress =
    pickFirstString(pdfProperty, [
      'address.address',
      'address.street',
      'streetAddress',
      'publicAddress',
      'addressPublic',
    ]) || ''

  const propertyTitleText =
    pickFirstString(pdfProperty, [
      'propertyTitle',
      'characteristics.propertyTitle',
      'publicationTitle',
      'title',
      'name',
    ]) ||
    (propertyStreetAddress
      ? toTitleCase(propertyStreetAddress)
      : `Propiedad #${pdfProperty?.id ?? ''}`)

  const propertyLocationText = joinUniqueLocationParts([
    toTitleCase(propertyStreetAddress),
    getPropertyCity(pdfProperty),
    getPropertyState(pdfProperty),
  ])

  doc.setTextColor(...SHEET_COLORS.text)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(28)
  doc.text(propertyType || 'Propiedad', 52, 68)
  doc.text(`En ${operationName || 'Operación'}`, 52, 100)

  try {
    const logoDataUrl = await loadImageAsDataUrl(logoUrl)

    doc.addImage(
      logoDataUrl,
      normalizeImageFormat(logoDataUrl),
      pageWidth - 150,
      28,
      95,
      32
    )
  } catch {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.setTextColor(...SHEET_COLORS.text)
    doc.text('Pulso Propiedades', pageWidth - 50, 48, { align: 'right' })
  }

  const images = getPropertyImages(pdfProperty)
  const heroImage = images[0]
  const thumbOne = images[1]
  const thumbTwo = images[2]

  const heroX = 52
  const heroY = 120
  const heroWidth = contentWidth
  const heroHeight = 228

  if (heroImage) {
    try {
      const heroDataUrl = await loadImageAsDataUrl(heroImage)

      doc.addImage(
        heroDataUrl,
        normalizeImageFormat(heroDataUrl),
        heroX,
        heroY,
        heroWidth,
        heroHeight
      )
    } catch {
      drawImagePlaceholder(doc, heroX, heroY, heroWidth, heroHeight)
    }
  } else {
    drawImagePlaceholder(doc, heroX, heroY, heroWidth, heroHeight)
  }

  const leftColumnX = 52
  const leftColumnY = 388
  const leftColumnWidth = 350

  const rightColumnX = 430
  const thumbWidth = 130
  const thumbHeight = 116
  const thumbGap = 12
  const rightColumnBottomY = leftColumnY + thumbHeight * 2 + thumbGap

  const drawThumb = async (
    imageUrl: string | undefined,
    x: number,
    y: number
  ) => {
    if (!imageUrl) {
      drawImagePlaceholder(doc, x, y, thumbWidth, thumbHeight)
      return
    }

    try {
      const imageDataUrl = await loadImageAsDataUrl(imageUrl)

      doc.addImage(
        imageDataUrl,
        normalizeImageFormat(imageDataUrl),
        x,
        y,
        thumbWidth,
        thumbHeight
      )
    } catch {
      drawImagePlaceholder(doc, x, y, thumbWidth, thumbHeight)
    }
  }

  await drawThumb(thumbOne, rightColumnX, leftColumnY)
  await drawThumb(thumbTwo, rightColumnX, leftColumnY + thumbHeight + thumbGap)

  const drawWrappedText = ({
    text,
    x,
    y,
    maxWidth,
    font = 'helvetica',
    fontStyle = 'normal',
    fontSize = 10,
    color = SHEET_COLORS.text,
    lineHeight = 12,
  }: {
    text: string
    x: number
    y: number
    maxWidth: number
    font?: 'helvetica' | 'times' | 'courier'
    fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic'
    fontSize?: number
    color?: readonly [number, number, number]
    lineHeight?: number
  }) => {
    const safeText = text?.trim() || '-'

    doc.setFont(font, fontStyle)
    doc.setFontSize(fontSize)
    doc.setTextColor(...color)

    const lines = doc.splitTextToSize(safeText, maxWidth)
    doc.text(lines, x, y)

    return {
      lines,
      nextY: y + lines.length * lineHeight,
    }
  }

  let cursorY = leftColumnY

  const headline = `${propertyType} en ${operationName} | Precio de oportunidad`

  const headlineBlock = drawWrappedText({
    text: headline,
    x: leftColumnX,
    y: cursorY,
    maxWidth: leftColumnWidth,
    font: 'helvetica',
    fontStyle: 'normal',
    fontSize: 10,
    color: SHEET_COLORS.muted,
    lineHeight: 12,
  })

  cursorY = headlineBlock.nextY + 14

  const titleBlock = drawWrappedText({
    text: propertyTitleText,
    x: leftColumnX,
    y: cursorY,
    maxWidth: leftColumnWidth,
    font: 'helvetica',
    fontStyle: 'bold',
    fontSize: 22,
    color: SHEET_COLORS.text,
    lineHeight: 24,
  })

  cursorY = titleBlock.nextY + 12

  const locationBlock = drawWrappedText({
    text: propertyLocationText,
    x: leftColumnX,
    y: cursorY,
    maxWidth: leftColumnWidth,
    font: 'helvetica',
    fontStyle: 'normal',
    fontSize: 9,
    color: SHEET_COLORS.muted,
    lineHeight: 12,
  })

  cursorY = locationBlock.nextY + 16

  const primaryPrice = getPrimaryPrice(pdfProperty)

  const priceBlock = drawWrappedText({
    text: primaryPrice || '-',
    x: leftColumnX,
    y: cursorY,
    maxWidth: leftColumnWidth,
    font: 'helvetica',
    fontStyle: 'normal',
    fontSize: 20,
    color: SHEET_COLORS.text,
    lineHeight: 22,
  })

  cursorY = priceBlock.nextY + 10

  const secondaryPrice = getSecondaryPrice(pdfProperty)

  if (secondaryPrice) {
    const secondaryPriceBlock = drawWrappedText({
      text: secondaryPrice,
      x: leftColumnX,
      y: cursorY,
      maxWidth: leftColumnWidth,
      font: 'helvetica',
      fontStyle: 'normal',
      fontSize: 9,
      color: SHEET_COLORS.muted,
      lineHeight: 12,
    })

    cursorY = secondaryPriceBlock.nextY + 8
  }

  const commonExpenses = getCommonExpenses(pdfProperty)

  if (commonExpenses) {
    const commonExpensesBlock = drawWrappedText({
      text: commonExpenses,
      x: leftColumnX,
      y: cursorY,
      maxWidth: leftColumnWidth,
      font: 'helvetica',
      fontStyle: 'normal',
      fontSize: 8.5,
      color: SHEET_COLORS.text,
      lineHeight: 11,
    })

    cursorY = commonExpensesBlock.nextY + 10
  }

  const facts = getMainFacts(pdfProperty)

  if (facts.length > 0) {
    const factsBlock = drawWrappedText({
      text: facts.join('     ·     '),
      x: leftColumnX,
      y: cursorY,
      maxWidth: leftColumnWidth,
      font: 'helvetica',
      fontStyle: 'normal',
      fontSize: 10,
      color: SHEET_COLORS.text,
      lineHeight: 12,
    })

    cursorY = factsBlock.nextY + 18
  }

  const featuresSectionY = Math.max(cursorY + 8, rightColumnBottomY + 26)

  doc.setDrawColor(...SHEET_COLORS.soft)
  doc.setLineWidth(0.8)
  doc.line(
    leftColumnX,
    featuresSectionY - 18,
    leftColumnX + leftColumnWidth,
    featuresSectionY - 18
  )

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...SHEET_COLORS.text)
  doc.setFontSize(14)
  doc.text('Características destacadas', leftColumnX, featuresSectionY)

  const features = getHighlightedFeatures(pdfProperty)
  const descriptionText = getPropertyDescription(pdfProperty)
  const mainFeatures = features.slice(0, FIRST_PAGE_MAIN_FEATURE_COUNT)
  const additionalFeatures = features.slice(FIRST_PAGE_MAIN_FEATURE_COUNT)

  const featureStartY = featuresSectionY + 32
  const featureColumnGap = 18
  const featureColumnWidth = (leftColumnWidth - featureColumnGap) / 2
  const featureValueOffset = 78
  const featureValueWidth = featureColumnWidth - featureValueOffset - 8

  let featureCursorY = featureStartY

  for (let row = 0; row < Math.ceil(mainFeatures.length / 2); row++) {
    const rowFeatures = [
      mainFeatures[row * 2],
      mainFeatures[row * 2 + 1],
    ].filter(Boolean) as PropertySheetFeature[]

    let rowHeight = 18

    rowFeatures.forEach((feature, colIndex) => {
      const colX =
        leftColumnX + colIndex * (featureColumnWidth + featureColumnGap)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...SHEET_COLORS.muted)
      doc.setFontSize(9)
      doc.text(`${feature.label}:`, colX, featureCursorY)

      doc.setTextColor(...SHEET_COLORS.text)

      const valueLines = doc.splitTextToSize(feature.value, featureValueWidth)
      doc.text(valueLines, colX + featureValueOffset, featureCursorY)

      rowHeight = Math.max(rowHeight, valueLines.length * 12)
    })

    featureCursorY += rowHeight + 8
  }

  const mainFeaturesBottomY = featureCursorY + 2

  const canRenderDescriptionOnFirstPage = (() => {
    if (additionalFeatures.length > 0) return false

    const descriptionTitleY = mainFeaturesBottomY + 32
    const maxWidth = leftColumnWidth
    const lineHeight = 13
    const descriptionLines = doc.splitTextToSize(descriptionText, maxWidth)
    const estimatedBottom =
      descriptionTitleY + 24 + descriptionLines.length * lineHeight

    return estimatedBottom <= getFooterLimitY(doc)
  })()

  if (canRenderDescriptionOnFirstPage) {
    const descriptionTitleY = mainFeaturesBottomY + 32

    doc.setDrawColor(...SHEET_COLORS.soft)
    doc.line(
      leftColumnX,
      descriptionTitleY - 18,
      leftColumnX + leftColumnWidth,
      descriptionTitleY - 18
    )

    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...SHEET_COLORS.text)
    doc.setFontSize(14)
    doc.text('Descripción', leftColumnX, descriptionTitleY)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)

    const descriptionLines = doc.splitTextToSize(
      descriptionText,
      leftColumnWidth
    )

    doc.text(descriptionLines, leftColumnX, descriptionTitleY + 24)
  } else {
    let y = createContinuationPage(doc, 'Información adicional')

    if (additionalFeatures.length > 0) {
      y = drawAdditionalFeaturesBlock(doc, additionalFeatures, y)
    }

    y = drawWrappedParagraphBlock(doc, 'Descripción', descriptionText, y, {
      pageTitleOnNewPage: 'Información adicional',
    })

    void y
  }

  drawFooter(doc)

  const safeName =
    options?.fileName || `ficha-propiedad-${pdfProperty?.id ?? 'sin-id'}.pdf`

  doc.save(safeName)
}
