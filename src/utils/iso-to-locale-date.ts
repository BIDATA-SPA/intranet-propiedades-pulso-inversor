// ✅ Convierte ISO (UTC) a Date local conservando la FECHA de calendario
export function isoUtcToLocalDate(iso?: string | null): Date | null {
  if (!iso) return null
  const d = new Date(iso) // UTC
  // Construye una Date local a las 00:00 de la fecha UTC (mismo yyyy-mm-dd visual)
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}
