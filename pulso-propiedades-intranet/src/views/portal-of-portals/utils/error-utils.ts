/* eslint-disable @typescript-eslint/no-explicit-any */
export type NotificationType = 'success' | 'warning' | 'danger' | 'info'

const FIELD_LABELS: Record<string, string> = {
  // mapea campos del portal -> etiquetas legibles para el usuario
  external_url: 'URL externa',
  title: 'Título',
  currency: 'Moneda',
  price_clp: 'Precio (CLP)',
  price_uf: 'Precio (UF)',
  area_useful: 'Superficie útil',
  area_total: 'Superficie total',
  unit: 'Unidad de medida',
  bedrooms: 'Dormitorios',
  bathrooms: 'Baños',
  parking: 'Estacionamientos',
  floor: 'Piso',
  age: 'Antigüedad',
  orientation: 'Orientación',
  common_expenses: 'Gastos comunes',
  condition: 'Condición',
  description: 'Descripción',
  'location.address': 'Dirección',
  'location.neighborhood': 'Barrio',
  'location.commune': 'Comuna',
  'location.city': 'Ciudad',
  'location.region': 'Región',
  'location.coordinates.lat': 'Latitud',
  'location.coordinates.lng': 'Longitud',
  'broker.name': 'Corredor (Nombre)',
  'broker.phone': 'Corredor (Teléfono)',
  'broker.email': 'Corredor (Email)',
  // agrega más si los necesitas
}

const prettifyPath = (loc: any[]): string => {
  // El portal suele mandar: ["body", "external_url"]  ó  ["body","location","city"]
  const path = (Array.isArray(loc) ? loc : [])
    .filter((p) => p !== 'body')
    .join('.')
  return (
    FIELD_LABELS[path] ??
    FIELD_LABELS[path.replace(/\[\d+\]/g, '')] ??
    (path || 'Campo')
  )
}

export function parsePortalError(err: any): {
  status?: number
  issues: { field: string; msg: string; raw?: any }[]
  raw: any
} {
  const status = err?.status ?? err?.originalStatus
  const data = err?.data ?? err

  let detail: any[] = []
  if (Array.isArray(data)) {
    detail = data
  } else if (Array.isArray(data?.detail)) {
    detail = data.detail
  }

  const issues = detail.map((d) => {
    const field = prettifyPath(d?.loc)
    const msg = typeof d?.msg === 'string' ? d.msg : JSON.stringify(d?.msg ?? d)
    return { field, msg, raw: d }
  })

  return { status, issues, raw: data }
}

export function portalErrorToToast(err: any): {
  type: NotificationType
  title: string
  text: string
} {
  const { status, issues, raw } = parsePortalError(err)

  if (issues.length > 0) {
    // Mensaje multilinea con bullets (si tu Notification no respeta \n, cambia el join por ' • ')
    const lines = issues.map((i) => `• ${i.field}: ${i.msg}`)
    const title =
      status === 422
        ? 'Corrige los campos requeridos'
        : `Error${status ? ` ${status}` : ''} al procesar la solicitud`
    return {
      type: 'danger',
      title,
      text: lines.join('\n'),
    }
  }

  // Fallbacks cuando no viene detail
  if (typeof raw === 'string') {
    return { type: 'danger', title: 'Error', text: raw }
  }
  try {
    return {
      type: 'danger',
      title: `Error${status ? ` ${status}` : ''}`,
      text: JSON.stringify(raw),
    }
  } catch {
    return {
      type: 'danger',
      title: 'Error',
      text: String(raw || 'Desconocido'),
    }
  }
}
