type FormatCurrencyOptions = {
  currency?: 'CLP'
}

const toSafeNumber = (value: unknown): number => {
  if (value === null || value === undefined || value === '') return 0

  if (typeof value === 'number') return value

  if (typeof value === 'string') {
    const normalizedValue = value.trim().replace(',', '.')
    const parsedValue = Number(normalizedValue)

    return Number.isNaN(parsedValue) ? 0 : parsedValue
  }

  return 0
}

export const formatCurrency = (
  value: unknown,
  options: FormatCurrencyOptions = { currency: 'CLP' }
): string => {
  const numericValue = toSafeNumber(value)

  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: options.currency ?? 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue)
}

export const formatThousands = (
  value: unknown,
  maximumFractionDigits = 3
): string => {
  const numericValue = toSafeNumber(value)

  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(numericValue)
}
