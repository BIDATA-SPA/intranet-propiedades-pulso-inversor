interface PlanInfo {
  id: number
  name: string
}

interface PlanDetails {
  plan: PlanInfo
  startDate: string
  endDate: string
  isActive: boolean
}

interface Role {
  id: number
  name: string
  description: string | null
}

interface Type {
  id: number
  name: string
}

interface Status {
  id: number
  name: string
}

interface Session {
  id: string
  timesLoggedIn: number
  lastAccess: string
  email: string
  rol: Role
  type: Type
  status: Status
}

interface Address {
  street: string
  countryId: number
  stateId: number
  cityId: number
}

export interface Realtor {
  id: string
  name: string
  lastName: string
  image: string
  about: string
  companies: string[]
  phone: string
  dialCodeId?: string
  rut: string
  webPage?: string
  resumeFile: string | null
  createdAt: string
  updatedAt: string
  plan: PlanDetails[]
  session: Session
  address: Address
}

export type CreateRealtorBody = {
  name: string
  lastName: string
  rut: string
  phone: string
  dialCodeId?: string
  email: string
  webPage?: string
  //   resume?: File | string | null ⚠️
  about?: string
  companies?: string[]
  planId: number | string
  password: string
  address: Address
  rolId?: string
}

export type CreateRealtorFormModel = {
  name: string
  lastName: string
  rut: string
  phone: string
  dialCodeId?: string
  email: string
  webPage?: string
  about?: string
  companies?: string[]
  planId: number | string
  password: string
  confirmPassword: string
  address: Address
  rolId?: string
}
