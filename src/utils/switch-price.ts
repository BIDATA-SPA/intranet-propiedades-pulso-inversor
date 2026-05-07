import { formatCurrency, formatThousands } from './formatCurrency'

type PropertyPriceData = {
  propertyPrice?: string | number | null
}

export const switchPrice = (
  currencyId: string,
  data: PropertyPriceData
): string => {
  const price = data?.propertyPrice

  switch (currencyId) {
    case 'UF':
      return `UF ${formatThousands(price, 3)}`

    case 'M2':
      return `M² ${formatThousands(price, 3)}`

    case 'CLP':
      return formatCurrency(price, { currency: 'CLP' })

    default:
      return formatThousands(price, 3)
  }
}
