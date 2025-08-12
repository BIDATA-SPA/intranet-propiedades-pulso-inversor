// Tipos para la información del realtor
interface Realtor {
  id: string
  name: string
  lastName: string
  image: string
  about: string
  companies: string[]
  phone: string
  rut: string
  webPage: string
  resumeFile: null | string
  createdAt: string
  deletedAt: null | string
  updatedAt: string
  session: {
    id: string
    timesLoggedIn: number
    lastAccess: string
    email: string
    password: string
    type: {
      id: number
      name: string
    }
    rol: {
      id: number
      name: string
      description: null | string
    }
    status: {
      id: number
      name: string
    }
    plan: Array<{
      plan: {
        id: number
        name: string
      }
      startDate: string
      endDate: string
      isActive: boolean
    }>
  }
}

// Tipo para el correo electrónico enviado
interface EmailSent {
  id: string
  datetime: string
  from: string
  to: string
  cc: string[]
  requestingRealtorEmail: string
}

// Tipo para una solicitud de canjeo
interface ExchangeEmailRequest {
  id: string
  datetime: string
  property: {
    id: string
  }
  realtorOwner: Realtor
  requestingRealtor: Realtor
  emailsSent: EmailSent[]
}

// Tipo para la respuesta de paginación
interface PaginateMeta {
  totalItems: number
  page: number
  limit: number
  previousPageUrl: null | string
  nextPageUrl: null | string
  firstPageUrl: string
  lastPageUrl: string
  totalPages: number
}

// Tipo para la respuesta completa de la API
export interface PaginatedExchangeEmailRequests {
  data: ExchangeEmailRequest[]
  meta: PaginateMeta
}

// POST
export type EmailRequestPayload = {
  name: string
  lastName: string
  to: string
  propertyId: string
  phone: string
  realtorFrom: string
  subject: string
  message: string
}

export type EmailExternalServicesRequestPayload = {
  to: string
  customerId: number
  externalServiceId: number
  realtorFrom: string
  subject: string
  message: string
}

export type InboxRequestStatuses = {
  id: number
  name: string
}

export type UpdateKanjeoRequestStatusBody = {
  requestId: number
  statusId: number
}

export type requestApplicantSignatureBody = {
  kanjeoRequestId: number
}
