import { Customer } from '@/services/customers/types/customer.type'

export interface IRatingUser {
  id: string
  comment: string
  createdAt: Date
  rating?: number
}

export interface IRatingUserByCustomer extends IRatingUser {
  customer: Customer
}
