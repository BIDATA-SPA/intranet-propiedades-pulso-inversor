export const formatNumber = (
  value: number | string,
  currencyId: string
): string => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: currencyId === 'UF' ? 0 : 0,
    maximumFractionDigits: currencyId === 'UF' ? 0 : 0,
    useGrouping: true,
  }).format(Number(value))
}
