export type VisitOrderTemplateType = 'sale' | 'rent' | 'commercial-rent'

export type VisitPdfPayload = {
  template: VisitOrderTemplateType
  title?: string

  customerName: string
  customerRut: string
  customerEmail: string
  customerPhone: string
  customerAddress: string

  brokerName: string
  brokerRut?: string
  brokerEmail?: string
  brokerPhone?: string

  customerSignatureUrl?: string
  brokerSignatureUrl?: string

  propertyId: number
  propertyAddress: string
  operationType: string
  propertyType: string
  price: string
  currency: string
  externalLink?: string

  startDateText: string
  endDateText: string
  startTime: string
  endTime: string

  observations?: string
  propertyImages?: string[]

  topLeftLogoUrl?: string
}
