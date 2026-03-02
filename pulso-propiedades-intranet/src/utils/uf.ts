// utils/uf.ts
type UfResponse = {
  codigo: 'uf'
  nombre: string
  unidad_medida: 'Pesos'
  serie: { fecha: string; valor: number }[] // valor en CLP por 1 UF
}

const UF_API = 'https://mindicador.cl/api/uf'

export async function fetchUfCLP(): Promise<number | null> {
  try {
    const res = await fetch(UF_API, { cache: 'no-store' })
    if (!res.ok) throw new Error(`UF API status ${res.status}`)
    const data = (await res.json()) as UfResponse
    const latest = data.serie?.[0]?.valor
    return typeof latest === 'number' ? latest : null
  } catch {
    return null // Fallback controlado
  }
}

/** CLP → UF (usa UF del día) */
export function clpToUf(clp: number, ufClp: number): number {
  return clp / ufClp
}

/** UF → CLP (usa UF del día) */
export function ufToClp(uf: number, ufClp: number): number {
  return uf * ufClp
}
