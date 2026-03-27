import type { VisitOrderTemplateType } from '../types/types'

type ResolveVisitOrderTemplateParams = {
  operationTypeName?: string
  propertyTypeName?: string
}

const COMMERCIAL_PROPERTY_KEYWORDS = [
  'LOCAL',
  'OFICINA',
  'BODEGA',
  'GALPON',
  'COMERCIAL',
  'CONSULTA',
  'CONSULTORIO',
  'INDUSTRIAL',
]

const normalizeValue = (value?: string) => {
  return value?.trim().toUpperCase() ?? ''
}

export const resolveVisitOrderTemplate = ({
  operationTypeName,
  propertyTypeName,
}: ResolveVisitOrderTemplateParams): VisitOrderTemplateType => {
  const normalizedOperation = normalizeValue(operationTypeName)
  const normalizedPropertyType = normalizeValue(propertyTypeName)

  const isSale =
    normalizedOperation === 'VENTA' || normalizedOperation === 'COMPRAVENTA'

  const isRent = normalizedOperation === 'ARRIENDO'

  const isCommercialProperty = COMMERCIAL_PROPERTY_KEYWORDS.some((keyword) =>
    normalizedPropertyType.includes(keyword)
  )

  if (isSale) {
    return 'sale'
  }

  if (isRent && isCommercialProperty) {
    return 'commercial-rent'
  }

  return 'rent'
}
