// src/utils/currency.ts
export type CurrencyId = 'CLP' | 'UF'

export function parseAmount(
  value: string | number | null | undefined
): number | null {
  if (value === null || value === undefined) return null
  const n =
    typeof value === 'number'
      ? value
      : Number(String(value).replace(/\./g, '').replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export function formatCLP(value: number): string {
  // CLP sin decimales
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatUF(value: number): string {
  // UF con 2 decimales
  return `${new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)} UF`
}

export function convertPrice(
  amount: number,
  currencyId: CurrencyId,
  ufValue: number
): { amountInUF: number; amountInCLP: number } {
  if (ufValue <= 0) throw new Error('UF inválida')

  if (currencyId === 'CLP') {
    const amountInUF = amount / ufValue
    return { amountInUF, amountInCLP: amount }
  }
  // currencyId === 'UF'
  const amountInCLP = amount * ufValue
  return { amountInUF: amount, amountInCLP }
}

export function getFormattedPrices(
  rawAmount: string | number | null | undefined,
  currencyId: CurrencyId,
  ufValue: number | null
): { priceInUF: string; priceInCLP: string } {
  const amount = parseAmount(rawAmount)
  if (!amount || !ufValue || ufValue <= 0) {
    return { priceInUF: '-', priceInCLP: '-' }
  }

  const { amountInUF, amountInCLP } = convertPrice(amount, currencyId, ufValue)
  return {
    priceInUF: formatUF(amountInUF),
    priceInCLP: formatCLP(amountInCLP),
  }
}
