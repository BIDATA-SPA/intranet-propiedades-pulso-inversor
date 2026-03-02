export interface Realtor {
  id: string
  name: string
  lastName: string
  image: string
  rut: string | null
  dialCodeId: string
  phone: string
  webPage: string | null
  about: string | null
  companies: string[]
  resumeFile: string | null
  referralCode: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  sessionId: string
  addressId: string | null
}

export interface IReferredRealtor {
  sender: Realtor
  received: Realtor
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
