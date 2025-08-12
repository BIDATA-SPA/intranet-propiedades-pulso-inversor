import { Address } from '@/services/core-entities/address,types'

export type Customer = {
  id: string
  name: string
  lastName: string
  phone: string
  email: string
  rut: string
  alias: string
  address: Address
  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export type CreateCustomerBody = {
  name: string
  lastName: string
  rut?: string
  email: string
  phone: string
  dialCodeId?: string
  alias: string
  address: {
    countryId: null | number
    stateId: null | number
    cityId: null | number
    street: string
  }
}

export type CreateCustomerFormModel = {
  name: string
  lastName: string
  alias: string
  rut: string
  email: string
  phone: string
  dialCodeId?: string
  address: {
    countryId: null | number
    stateId: null | number
    cityId: null | number
    street: string
  }
}
