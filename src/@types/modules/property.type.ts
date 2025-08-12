// src/types/property.type.ts
export interface Property {
  id: string
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
  timeInExchangeStart: string | null
  timeInExchangeEnd: string | null
  propertyDescriptionInExchange: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    lastName: string
    session: {
      email: string
    }
  }
  customer: {
    id: string
    name: string
    lastName: string
  }
  disabledReason?: string | null
  characteristics: {
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
    typeOfSecurity: string[]
    locatedInCondominium: boolean
    isFurnished: boolean
    hasBarbecueArea: boolean
  }
  address: {
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
  images: string[]
}
