export interface IRealtor {
  id: string
  name: string
  lastName: string
  about: string | null
  companies: string[]
  phone: string
  rut: string | null
  webPage: string | null
  resumeFile: string | null
  createdAt: string
  updatedAt: string
  plan: UserPlan[]
  userClick: UserClick
  address: string | null
  session: UserSession
  image: string | null
  averageRating?: number
}

export interface UserPlan {
  plan: PlanDetails
  startDate: string
  endDate: string
  isActive: boolean
}

export interface PlanDetails {
  id: number
  name: string
}

export interface UserClick {
  clickOfMoreOfRealtor: number
  clickOfNameRealtor: number
  clickOfOpenContact: number
  clickOfSendContact: number
  clickOfWebPage: number
}

export interface UserSession {
  id: string
  timesLoggedIn: number
  lastAccess: string // Puede ser reemplazado con `Date`
  email: string
  accountConfirmed: boolean
  rol: UserRole
  type: UserType
  status: UserStatus
}

export interface UserRole {
  id: number
  name: string
  description: string | null
}

export interface UserType {
  id: number
  name: string
}

export interface UserStatus {
  id: number
  name: string
}
