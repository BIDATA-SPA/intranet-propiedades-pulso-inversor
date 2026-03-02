// src/hooks/useUFRate.ts
import ExchangeRateServices from '@/services/convert-currency/ConvertCurrency.service'
import { useEffect, useState } from 'react'

const UF_CACHE_KEY = 'uf_rate_cache'
const UF_TTL_MS = 12 * 60 * 60 * 1000 // 12h

type UFCache = { value: number; ts: number }

export function useUFRate() {
  const [uf, setUf] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setErr] = useState<string | null>(null)

  useEffect(() => {
    const cachedRaw = localStorage.getItem(UF_CACHE_KEY)
    if (cachedRaw) {
      try {
        const cached: UFCache = JSON.parse(cachedRaw)
        if (Date.now() - cached.ts < UF_TTL_MS && cached.value > 0) {
          setUf(cached.value)
          setLoading(false)
          return
        }
      } catch {}
    }

    ;(async () => {
      try {
        const data = await ExchangeRateServices.getExchangeRateUF()
        // La API de la CMF suele venir con coma decimal
        const value = parseFloat(
          String(data?.UFs?.[0]?.Valor).replace('.', '').replace(',', '.')
        )
        if (!Number.isFinite(value) || value <= 0)
          throw new Error('Respuesta UF inválida')
        const payload: UFCache = { value, ts: Date.now() }
        localStorage.setItem(UF_CACHE_KEY, JSON.stringify(payload))
        setUf(value)
      } catch (e: any) {
        setErr(e?.message ?? 'Error al obtener UF')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return { uf, loading, error }
}
