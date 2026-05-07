export const parsePriceInput = (value: string): number | '' => {
  if (!value) return ''

  const cleanValue = value.replace(/[^\d.,]/g, '').trim()

  if (!cleanValue) return ''

  const hasComma = cleanValue.includes(',')

  if (hasComma) {
    const [integerPart, decimalPart = ''] = cleanValue.split(',')

    const normalizedInteger = integerPart.replace(/\./g, '')
    const limitedDecimals = decimalPart.slice(0, 3)

    const normalizedValue = `${normalizedInteger}.${limitedDecimals}`
    const parsedValue = Number(normalizedValue)

    return Number.isNaN(parsedValue) ? '' : parsedValue
  }

  const normalizedValue = cleanValue.replace(/\./g, '')
  const parsedValue = Number(normalizedValue)

  return Number.isNaN(parsedValue) ? '' : parsedValue
}

export const formatPriceInput = (
  value: number | string | null | undefined,
  currencyId?: string
): string => {
  if (value === null || value === undefined || value === '') return ''

  const numericValue = Number(value)

  if (Number.isNaN(numericValue)) return ''

  const shouldAllowDecimals = currencyId === 'UF' || currencyId === 'M2'

  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: shouldAllowDecimals ? 3 : 0,
  }).format(numericValue)
}
// export const formatNumber = (
//   value: number | string,
//   currencyId: string
// ): string => {
//   return new Intl.NumberFormat('es-CL', {
//     minimumFractionDigits: currencyId === 'UF' ? 0 : 0,
//     maximumFractionDigits: currencyId === 'UF' ? 0 : 0,
//     useGrouping: true,
//   }).format(Number(value))
// }
