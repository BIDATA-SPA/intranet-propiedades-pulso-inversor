interface SupportRequest {
  id: string
  createdAt: Date | string | null
  closedAt: Date | string | null
  comment: string
  response: string
  status: {
    id: number
    name: string
  }
  category: {
    id: number
    name: string
  }
  user: {
    id: string
    name: string
    lastName: string
    image: string
    about: string
    companies: string[]
    phone: string
    rut: string
    webPage: string
    resumeFile: File | null
    createdAt: Date | string | null
    deletedAt: Date | string | null
    updatedAt: Date | string | null
    session: {
      email: string
    }
  }
}

export type SupportRequestPayload = {
  categoryId: number
  comment: string
}

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
export interface PaginatedSupportRequest {
  data: SupportRequest[]
  meta: PaginateMeta
}
