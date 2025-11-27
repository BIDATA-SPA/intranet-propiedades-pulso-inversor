// src/types/property.type.ts
export interface Property {
  property_portales: any
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
  externalLink: string
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
    commonExpenses: any
    locatedFacingTheStreet: any
    locatedInGallery: any
    floorLevelLocation: any
    officeNumber: any
    surface: string
    constructedSurface: string
    floors: string
    numberOfFloors: string
    terraces: string
    terraceM2: string
    bedrooms: string
    bathrooms: string
    typeOfKitchen: string
    hasHeating: boolean
    typeOfHeating: string
    hasAirConditioning: boolean
    hasParking: boolean
    hasGarage: boolean
    numberOfParkingSpaces: string
    hasElevator: boolean
    hasGym: boolean
    hasKitchen: boolean
    hasSwimmingPool: boolean
    hasSecurity: boolean
    typeOfSecurity: string[]
    locatedInCondominium: boolean
    isFurnished: boolean
    hasBarbecueArea: boolean
    numberOfPrivate: number | null
    numberOfVacantFloors: number | null
    numberOfMeetingRooms: number | null
    hasKitchenet: boolean
    hasHouse: boolean
  }
  address: {
    lng: any
    lat: any
    addressPublic: any
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
