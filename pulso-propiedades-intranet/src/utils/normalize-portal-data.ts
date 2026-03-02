export const normalizeListingType = (type?: string): string => {
  if (!type) return 'Tipo no soportado'

  const allowed = ['venta', 'arriendo']
  const normalized = type.trim().toLowerCase()

  return allowed.includes(normalized)
    ? normalized
    : 'Tipos soportados (venta y arriendo) ✅'
}

// Normaliza acentos y espacios
function normalizeText(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita diacríticos
    .toLowerCase()
    .trim()
}

const UNSUPPORTED = 'Tipo no soportado'

const ALLOWED: Record<string, true> = {
  departamento: true,
  casa: true,
  parcela: true,
  edificio: true,
  local: true,
  oficina: true,
  bodega: true,
}

const ALIASES: Record<string, string> = {
  'local comercial': 'local',
  'departamento amoblado': 'departamento',
  'casa amoblada': 'casa',
  bodega: 'bodega',
}

export function normalizeTypeOfProperty(type?: string): string {
  if (!type) return UNSUPPORTED

  const n = normalizeText(type)
  const mapped = ALIASES[n] ?? n

  return ALLOWED[mapped] ? mapped : UNSUPPORTED
}
