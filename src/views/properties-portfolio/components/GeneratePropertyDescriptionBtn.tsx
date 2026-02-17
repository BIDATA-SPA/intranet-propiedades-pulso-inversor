/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import { FaWandMagicSparkles } from 'react-icons/fa6'

type Props = {
  formData: any
  /** HTML actual del campo (opcional, por si quieres concatenar) */
  currentValue?: string
  /** Setter que te pasa el <Field> de Formik: form.setFieldValue(field.name, html) */
  setValue: (nextHtml: string) => void
  /** Si true, concatena al final del HTML actual; por defecto reemplaza */
  append?: boolean
}

function escapeHtml(s: unknown) {
  const str = String(s ?? '')
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function fmtCurrency(value: unknown, currencyId: string | null | undefined) {
  const n = Number(value)
  if (!isFinite(n) || n <= 0) return null
  const c = (currencyId || '').toUpperCase()
  if (c === 'UF') return `UF ${new Intl.NumberFormat('es-CL').format(n)}`
  // default CLP
  return `$ ${new Intl.NumberFormat('es-CL').format(n)}`
}

function numOrNull(v: unknown) {
  const n = Number(v)
  return isFinite(n) && n > 0 ? n : null
}

function truthy(v: unknown) {
  return v === true || v === 'true' || v === 1 || v === '1'
}

function liIf(text: string | null | undefined) {
  const t = (text ?? '').trim()
  return t ? `<li>${escapeHtml(t)}</li>` : ''
}

export default function GeneratePropertyDescriptionBtn({
  formData,
  currentValue,
  setValue,
  append = false,
}: Props) {
  const onGenerate = () => {
    // ---- 1) Desestructurar con defaults seguros
    const pi = formData?.informacionPrincipal ?? {}
    const id = formData?.caracteristicas ?? {}
    const ch = id?.characteristics ?? {}
    const fi = formData?.financialInformation ?? {}
    const pp = formData?.portalOfPortals ?? {}
    const addr = formData?.addressInformation ?? {}

    const op = (pi?.typeOfOperationId || '').trim() // "Compra" | "Arriendo"...
    const propType = (pi?.typeOfPropertyId || '').trim() // "Casa", "Depto", ...
    const currency = (pi?.currencyId || '').trim() // "CLP" | "UF"
    const price = fmtCurrency(pi?.propertyPrice, currency)

    const title =
      (ch?.propertyTitle || '').trim() ||
      `${propType ? `${propType} ` : ''}${op ? `en ${op}` : ''}`.trim() ||
      'Propiedad destacada'

    // Medidas / composición
    const m2Total = ch?.surface
    const m2Built = ch?.constructedSurface
    const bedrooms = numOrNull(ch?.bedrooms)
    const bathrooms = numOrNull(ch?.bathrooms)
    const floors = numOrNull(ch?.numberOfFloors)

    // Booleans & typed fields
    const hasKitchen = truthy(ch?.hasKitchen)
    const typeOfKitchen = (ch?.typeOfKitchen || '').trim()
    const locatedInCondominium = truthy(ch?.locatedInCondominium)

    const hasHeating = truthy(ch?.hasHeating)
    const typeOfHeating = (ch?.typeOfHeating || '').trim()
    const hasAC = truthy(ch?.hasAirConditioning)
    const hasParking = truthy(ch?.hasParking)
    const parkingQty = numOrNull(ch?.numberOfParkingSpaces)
    const hasGarage = truthy(ch?.hasGarage)
    const hasElevator = truthy(ch?.hasElevator)
    const hasGym = truthy(ch?.hasGym)
    const hasPool = truthy(ch?.hasSwimmingPool)
    const hasBbq = truthy(ch?.hasBarbecueArea)
    const hasSecurity = truthy(ch?.hasSecurity)
    const typeOfSecurity: Array<{ value?: string; label?: string }> =
      Array.isArray(ch?.typeOfSecurity) ? ch.typeOfSecurity : []

    const terraces = (ch?.terraces || '').trim()
    const terraceM2 = ch?.terraceM2

    const commonExpenses = (ch?.commonExpenses || '').toString().trim()
    const externalLink = (id?.externalLink || pp?.external_url || '').trim()

    const isExchanged = truthy(fi?.isExchanged)

    // Ubicación (si existieran, arma una línea breve)
    const addressLine = [addr?.addressPublic, addr?.address, addr?.number]
      .map((x) => (x || '').toString().trim())
      .filter(Boolean)
      .join(' ')
      .trim()
    const cityState =
      [addr?.cityId, addr?.stateId, addr?.countryId]
        .map((v) => (v == null ? '' : String(v)))
        .filter(Boolean).length > 0
        ? ' (ubicación disponible al contacto)'
        : ''

    // ---- 2) Bloques de contenido con condicionales
    const header = `
<p><strong>${escapeHtml(title)}</strong></p>
${price ? `<p><em>Precio: ${escapeHtml(price)}</em></p>` : ''}`

    const resumenBullets: string[] = []
    if (op) resumenBullets.push(`Operación: ${op}`)
    if (propType) resumenBullets.push(`Tipo: ${propType}`)
    if (m2Total) resumenBullets.push(`Superficie total: ${m2Total} m²`)
    if (m2Built) resumenBullets.push(`Superficie construida: ${m2Built} m²`)
    if (bedrooms) resumenBullets.push(`Dormitorios: ${bedrooms}`)
    if (bathrooms) resumenBullets.push(`Baños: ${bathrooms}`)
    if (floors) resumenBullets.push(`Pisos: ${floors}`)
    if (terraces) resumenBullets.push(`Terraza: ${terraces}`)
    if (terraceM2) resumenBullets.push(`Terraza ${terraceM2} m²`)
    if (commonExpenses) resumenBullets.push(`Gastos comunes: ${commonExpenses}`)

    const resumen =
      resumenBullets.length > 0
        ? `<p>Características principales:</p>
<ul>
  ${resumenBullets.map((t) => `<li>${escapeHtml(t)}</li>`).join('\n  ')}
</ul>`
        : `<p>Propiedad con excelente potencial y distribución funcional, ideal para ${
            op ? op.toLowerCase() : 'múltiples fines'
          }.</p>`

    const cocina =
      hasKitchen || typeOfKitchen
        ? `<li>Cocina ${
            typeOfKitchen ? escapeHtml(typeOfKitchen) : 'equipada'
          }</li>`
        : ''

    const clima =
      hasHeating || hasAC || typeOfHeating
        ? `<li>Confort térmico: ${[
            hasHeating ? 'calefacción' : '',
            hasAC ? 'aire acondicionado' : '',
            typeOfHeating ? `(${typeOfHeating})` : '',
          ]
            .filter(Boolean)
            .join(' ')}</li>`
        : ''

    const parking =
      hasParking || hasGarage || parkingQty
        ? `<li>Estacionamiento${(parkingQty || 0) > 1 ? 's' : ''}: ${
            parkingQty ?? 1
          }${hasGarage ? ' (con garaje)' : ''}</li>`
        : ''

    const amenities = [
      cocina,
      clima,
      parking,
      hasElevator ? '<li>Ascensor</li>' : '',
      hasGym ? '<li>Gimnasio</li>' : '',
      hasPool ? '<li>Piscina</li>' : '',
      hasBbq ? '<li>Quincho / zona BBQ</li>' : '',
      locatedInCondominium ? '<li>Condominio</li>' : '',
    ]
      .filter(Boolean)
      .join('\n  ')

    const amenitiesBlock = amenities
      ? `<p>Comodidades y equipamiento:</p>
<ul>
  ${amenities}
</ul>`
      : ''

    const sicurezza =
      hasSecurity || (typeOfSecurity && typeOfSecurity.length > 0)
        ? `<p>Seguridad:</p>
<ul>
  ${hasSecurity ? '<li>Sistema de seguridad en la propiedad</li>' : ''}
  ${
    (typeOfSecurity ?? [])
      .map((s) => {
        const t = s?.label || s?.value
        return t ? `<li>${escapeHtml(t)}</li>` : ''
      })
      .filter(Boolean)
      .join('\n  ') || ''
  }
</ul>`
        : ''

    const ubicacion =
      addressLine || cityState
        ? `<p>Ubicación:${
            addressLine ? ` ${escapeHtml(addressLine)}` : ''
          }${cityState}</p>`
        : ''

    const canje = isExchanged
      ? `<p><em>Disponible para canje (colaboración entre corredores).</em></p>`
      : ''

    const link = externalLink
      ? `<p>Más información: <a href="${escapeHtml(
          externalLink
        )}" target="_blank" rel="noreferrer">${escapeHtml(
          externalLink
        )}</a></p>`
      : ''

    // ---- 3) Ensamblar HTML final (limpio y semántico)
    const html = [
      header,
      resumen,
      amenitiesBlock,
      sicurezza,
      ubicacion,
      canje,
      link,
    ]
      .filter((b) => (b || '').trim() !== '')
      .join('\n')

    const result = append && currentValue ? `${currentValue}\n${html}` : html
    setValue(result)
  }

  return (
    <Button
      size="sm"
      icon={<FaWandMagicSparkles />}
      type="button"
      onClick={onGenerate}
    >
      Generar autodescripción
    </Button>
  )
}
