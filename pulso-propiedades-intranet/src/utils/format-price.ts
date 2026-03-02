import { formatThousands } from './formatCurrency'

/** Truncate string length */
export const truncateString = (str: string, limit = 60): string =>
  str.length > limit ? `${str.substring(0, limit)}...` : str

/** Parse number to CLP currency */
export const parseToCLPCurrency = (number: number): string => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 3,
  }).format(number)
}

/** Parse CLP to UF */
const clpToUf = (clpValue: number, ufValue: number): number =>
  clpValue / ufValue

/** Parse UF to CLP */
const ufToClp = (priceUF: number, ufValue: number): number => priceUF * ufValue

/** Format number with thousands separator */
export const parseToDecimal = (number: number): string =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

/** Truncate small string */
export const truncateStringSmall = (str: string, limit = 30): string =>
  str?.length > limit ? `${str?.substring(0, limit)}...` : str

export const getCurrentYear = (): number => {
  const currentDate = new Date()
  return currentDate.getFullYear()
}

/** Format price based on currency */
export const formatPrice = (
  currencyId: string,
  price: number,
  ufValue: number
): { priceInUF: string; priceInCLP: string } => {
  if (!price || !ufValue) return { priceInUF: '-', priceInCLP: '-' }

  if (currencyId === 'UF') {
    return {
      priceInUF: `${formatThousands(price)} UF`, // Mostramos el precio exacto
      priceInCLP: parseToCLPCurrency(ufToClp(price, ufValue)),
    }
  }

  if (currencyId === 'CLP') {
    return {
      priceInUF: `${clpToUf(price, ufValue).toFixed(2)} UF`, // Mostramos con dos decimales
      priceInCLP: parseToCLPCurrency(price),
    }
  }

  return { priceInUF: '-', priceInCLP: '-' }
}
