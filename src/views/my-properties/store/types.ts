export type User = {
  id: string
  name: string
  lastName: string
  session: {
    email: string
  }
}

export type Customer = {
  id: string
  name: string
  lastName: string
}

export type Characteristics = {
  surface: string
  constructedSurface: string
  floors: string
  terraces: string
  bedrooms: string
  bathrooms: string
  typeOfKitchen: string
  hasHeating: boolean
  typeOfHeating: string
  hasAirConditioning: boolean
  hasParking: boolean
  hasGarage: boolean
  hasElevator: boolean
  hasGym: boolean
  hasKitchen: boolean
  hasSwimmingPool: boolean
  hasSecurity: boolean
  locatedInCondominium: boolean
  isFurnished: boolean
  hasBarbecueArea: boolean
  typeOfSecurity: string[]
}

export type Address = {
  address: string | null
  letter: string
  number: string
  references: string
  country: {
    id: number
    name: string
  }
  city: {
    id: number
    name: string
  }
  state: {
    id: number
    name: string
  }
}

export type Property = {
  id: string
  propertyStatus?: {
    id: string
    name: string
  }
  isActive?: boolean
  propertyTitle: string
  propertyDescription: string
  typeOfOperationId: string
  typeOfPropertyId: string
  timeAvailableStart: string | null
  timeAvailableEnd: string | null
  currencyId: string
  propertyPrice: string
  highlighted: boolean
  observations: string
  isExchanged: boolean
  timeInExchangeStart: string
  timeInExchangeEnd: string
  propertyDescriptionInExchange: string
  createdAt: string
  updatedAt: string
  user: User
  customer: Customer
  disabledReason: {
    name?: string | null
  }
  characteristics: Characteristics
  address: Address
  images: string[]
}

export type Properties = Property[]

export type PropertyResponse = {
  data: Property[]
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
