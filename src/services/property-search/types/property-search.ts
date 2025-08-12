export type Address = {
  country: string
  region: string
  commune: string
  city: string
  address: string
}

export type BasePropertySearch = {
  propertyId: string
  typeOfOperationId: string
  typeOfPropertyId: string
  currencyId: string
  propertyPrice: {
    min: number
    max: number
  }
  bedrooms: string
  bathrooms: string
  locatedInCondominium: boolean
  hasSecurity: boolean
  hasParking: boolean
  hasSwimmingPool: boolean
  address: Address
}

export type PropertySearch = BasePropertySearch & {
  id: string
  name: string
  lastName: string

  createdAt: Date
  updatedAt: Date
  deletedAt: Date
}

export type CreateCustomerSearchBody = Omit<
  PropertySearch,
  'createdAt' | 'updatedAt' | 'deletedAt'
>

export type CreateCustomerSearchFormModel = Partial<BasePropertySearch>
