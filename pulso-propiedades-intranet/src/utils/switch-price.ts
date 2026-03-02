import { formatCurrency, formatThousands } from './formatCurrency'

// Switch between property prices (clp-uf)
export const switchPrice = (currencyId: string, data): string => {
  switch (currencyId) {
    case 'UF':
      return `UF ${formatThousands(data?.propertyPrice)}`
    case 'CLP':
      return formatCurrency(data?.propertyPrice, { currency: 'CLP' })
    default:
      break
  }
}
