// Get schema
export type TPrice = {
  min: number | string
  max: number | string
}

export type Opportunity = {
  customerId?: string
  typeOfOperationId?: string
  typeOfPropertyId?: string
  currencyId?: string
  propertyPrice?: TPrice
  bedrooms?: string
  bathrooms?: string
  locatedInCondominium?: boolean
  hasSecurity?: boolean
  hasParking?: boolean
  hasSwimmingPool?: boolean
  address: {
    country: string
    region: string
    commune: string
    city: string
    address: string
  }
  createdAt: Date
  updatedAt: Date
  deleteAt: Date
}

// Form body schema
export type CreateOpportunityBody = {
  customerId: string
  typeOfOperationId: string
  typeOfPropertyId: string
  currencyId: string
  propertyPrice: TPrice
  bedrooms: string
  bathrooms: string
  locatedInCondominium?: boolean
  hasSecurity: boolean
  hasParking: boolean
  hasSwimmingPool?: boolean
  address: {
    country: string
    region: string
    commune: string
    city: string
    address: string
  }
}

// Form model schema
export type CreateOpportunityFormModel = {
  customerId?: string
  typeOfOperationId?: string
  typeOfPropertyId?: string
  currencyId?: string
  propertyPrice?: TPrice
  bedrooms?: string
  bathrooms?: string
  locatedInCondominium?: boolean
  hasSecurity?: boolean
  hasParking?: boolean
  hasSwimmingPool?: boolean
  address: {
    country: string
    region: string
    commune: string
    city: string
    address: string
  }
}
