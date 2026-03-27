export type VisitOrderTemplateType = 'sale' | 'rent' | 'commercial-rent'

export type VisitOrderProperty = {
  operationTypeName?: string
  propertyTypeName?: string
  address?: string
  price?: string | number
  images?: string[]
}

export type VisitOrderDocumentProps = {
  date: string
  customerName: string
  customerEmail: string
  customerRut: string
  customerPhone: string
  customerAddress: string
  propertyAddress: string
  priceText: string
  brokerName: string
  customerIdLabel?: string
  brokerIdLabel?: string
  propertyImages?: string[]
  leftLogoSrc?: string
  rightLogoSrc?: string
}
