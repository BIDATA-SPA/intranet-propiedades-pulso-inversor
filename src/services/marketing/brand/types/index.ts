// SELECT
export interface IItem {
  id: number
  name: string
}

export interface IMeta {
  totalItems: number
  page: number
  limit: number
  previousPageUrl: string | null
  nextPageUrl: string | null
  firstPageUrl: string
  lastPageUrl: string
  totalPages: number
}

export interface IBody {
  startCampaign: boolean
  priceRangeId: number
  startDateRangeId: number
  toBeContacted: boolean
  serviceTypeId: number
  statusId: number
  meeting?: string
  meetingUrl?: string
  meetingName?: string
}

export interface IPaginated {
  data: IItem[]
  meta: IMeta
}

// TABLE
export interface ServiceRequest {
  data: {
    id: string
    user: {
      phone: string
      session: {
        email: string
      }
    }
    priceRange: {
      id: number
      name: string
    }
    startDateRange: {
      id: number
      name: string
    }
    toBeContacted: boolean
    startCampaign: boolean
    meeting: string | null
    meetingUrl: string | null
    meetingOption: string | null
    serviceTypeId: string
    serviceType: {
      id: string
      name: string
    }
    status: {
      id: number
      name: string
    }
    createdAt: string // ISO date string
    updatedAt: string // ISO date string
    deletedAt: string | null // Nullable for soft delete
  }[]
  meta: {
    totalItems: number
    page: number
    limit: number
    previousPageUrl: string | null
    nextPageUrl: string | null
    firstPageUrl: string
    lastPageUrl: string
    totalPages: number
  }
}

export interface ServiceRequestRow {
  id: string
  user: {
    phone: string
    session: {
      email: string
    }
  }
  priceRange: {
    id: number
    name: string
  }
  startDateRange: {
    id: number
    name: string
  }
  toBeContacted: boolean
  startCampaign: boolean
  meeting: string | null
  meetingUrl: string | null
  meetingOption: string | null
  serviceTypeId: string
  serviceType: {
    id: string
    name: string
  }
  status: {
    id: number
    name: string
  }
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  deletedAt: string | null // Nullable for soft delete
}
