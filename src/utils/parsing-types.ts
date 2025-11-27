/* eslint-disable @typescript-eslint/no-explicit-any */

// ─────────────────────────────────────────────────────────────
// Utils de casteo/normalización
// ─────────────────────────────────────────────────────────────
export const toNum = (v: unknown): number | null => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}
export const toStr = (v: unknown): string => (v ?? '').toString()
export const toStrOrNull = (v: unknown): string | null => {
  const s = (v ?? '').toString().trim()
  return s.length ? s : null
}
export const toBool = (v: unknown): boolean => Boolean(v)
export const toISOOrNull = (v: unknown): string | null => {
  if (!v) return null
  const d = v instanceof Date ? v : new Date(v as string)
  if (Number.isNaN(d.getTime())) return null
  // ISO sin milisegundos
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z')
}

// Si no quieres enviar claves con null, puedes borrar nulls:
export const stripNulls = <T extends Record<string, any>>(obj: T): T => {
  const out: Record<string, any> = {}
  Object.keys(obj).forEach((k) => {
    const v = obj[k]
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      const nested = stripNulls(v)
      if (Object.keys(nested).length) out[k] = nested
    } else if (v !== null && v !== undefined) {
      out[k] = v
    }
  })
  return out as T
}
