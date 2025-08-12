type CurrencyFormatOptions = {
  locale?: string
  currency: 'CLP' | 'USD'
}

export const formatCurrency = (
  value: number,
  options: CurrencyFormatOptions
): string => {
  const { locale = 'es-CL', currency } = options
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    ...(currency === 'CLP' && {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
  })

  return formatter.format(value)
}

export const formatThousands = (
  value: number | string,
  locale = 'es-CL'
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return formatter.format(Number(value))
}
