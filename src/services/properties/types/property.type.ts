// Get data
export type Property = {
  id?: string
  propertyTitle?: string
  propertyDescription?: string
  typeOfOperationId?: string
  typeOfPropertyId?: string
  timeAvailableStart?: Date | null
  timeAvailableEnd?: Date | null
  currencyId?: string
  propertyPrice?: number
  highlighted?: boolean
  isActive?: boolean
  observations?: string
  isExchanged?: boolean
  timeInExchangeStart?: Date | null
  timeInExchangeEnd?: Date | null
  disabledReason: {
    id: string
    name: string
  }
  user?: {
    id?: string
    name?: string
    lastName?: string
  }
  customer?: {
    id?: string
    name?: string
    lastName?: string
  }
  characteristics?: {
    surface?: string
    constructedSurface?: string
    surfaceUnit?: string
    floors?: string
    terraces?: string
    bedrooms?: string
    bathrooms?: string
    typeOfKitchen?: string
    hasHeating?: boolean
    hasKitchen?: boolean
    typeOfHeating?: string
    hasAirConditioning?: boolean
    hasParking?: boolean
    hasGarage?: boolean
    hasElevator?: boolean
    hasGym?: boolean
    hasSwimmingPool?: boolean
    hasSecurity?: boolean
    typeOfSecurity?: string[] // O puedes especificar un tipo más específico aquí
    locatedInCondominium?: boolean
    isFurnished?: boolean
    hasBarbecueArea?: boolean
    numberOfPrivate?: string
    numberOfVacantFloors?: string
    numberOfMeetingRooms?: string
    hasKitchenet?: boolean
    hasHouse?: boolean
    locatedInGallery?: boolean
    locatedFacingTheStreet?: boolean
    floorLevelLocation?: string
    officeNumber?: string
    commonExpenses?: string
  }
  address?: {
    address?: string
    countryId: number
    stateId: number
    cityId: number
    letter?: string
    number?: string
    references?: string
    addressPublic?: string
  }
  images?: any
  createdAt?: Date | string
  updatedAt?: Date | string
  deletedAt?: Date | string
}

// selected item
export type TSelectedItem = {
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
  timeInExchangeStart: string
  timeInExchangeEnd: string
  propertyDescriptionInExchange: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    lastName: string
  }
  customer: {
    id: string
    name: string
    lastName: string
  }
  disabledReason: string | null
  characteristics: {
    surface: string
    constructedSurface: string
    surfaceUnit?: string
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
    numberOfPrivate?: string
    numberOfVacantFloors?: string
    numberOfMeetingRooms?: string
    hasKitchenet?: boolean
    hasHouse?: boolean
    locatedInGallery?: boolean
    locatedFacingTheStreet?: boolean
    floorLevelLocation?: string
    officeNumber?: string
    commonExpenses?: string
  }
  address: {
    address: string
    countryId: number
    stateId: number
    cityId: number
    // commune: string
    // country: string
    // region: string
    city: string
    letter: string
    number: string
    references: string
    addressPublic: string
  }
  images: string[]
}

//end selected item

// Post body
export type CreatePropertyBody = {
  step1: {
    userId?: string
    customerId?: string
    typeOfOperationId?: string
    timeAvailable?: {
      start?: Date | null
      end?: Date | null
    }
    typeOfPropertyId: string
    currencyId: string
    propertyPrice: string | number
  }
  step2: {
    highlighted?: boolean
    isActive?: boolean
    observations?: string
    characteristics: {
      surface?: string
      constructedSurface?: string
      surfaceUnit?: string
      floors?: string
      terraces?: string
      bathrooms?: string
      bedrooms?: string
      hasKitchen?: boolean
      typeOfKitchen?: string
      hasHeating?: boolean
      typeOfHeating?: string
      hasAirConditioning?: boolean
      hasGarage?: boolean
      hasParking?: boolean
      hasElevator?: boolean
      hasGym?: boolean
      hasSwimmingPool?: boolean
      hasSecurity?: boolean
      typeOfSecurity?: ISelectOption[] | string[]
      locatedInCondominium?: boolean
      isFurnished?: boolean
      hasBarbecueArea?: boolean
      propertyTitle?: string
      propertyDescription?: string
      numberOfPrivate?: string
      numberOfVacantFloors?: string
      numberOfMeetingRooms?: string
      hasKitchenet?: boolean
      hasHouse?: boolean
      locatedInGallery?: boolean
      locatedFacingTheStreet?: boolean
      floorLevelLocation?: string
      officeNumber?: string
      commonExpenses?: string
    }
  }
  step3: {
    // country?: string
    // region?: string
    // commune?: string
    // city?: string
    countryId: number
    stateId: number
    cityId: number
    address?: string
    number?: string
    letter?: string
    references?: string
    addressPublic?: string
  }
  step4: {
    isExchanged?: boolean
    timeInExchange?: {
      start?: Date | null
      end?: Date | null
    }
    propertyDescriptionInExchange?: string
  }
}

export interface ISelectOption {
  value?: string
}

// Unidemensional schema
export type CreatePropertyFormModel = {
  userId?: string
  customerId?: string
  typeOfOperationId?: string
  timeAvailable?: {
    start?: Date | null
    end?: Date | null
  }
  typeOfPropertyId?: string
  currencyId?: string
  propertyPrice?: string | number
  highlighted?: boolean
  isActive?: boolean
  observations?: string
  characteristics: {
    surface?: string
    surfaceUnit?: string
    constructedSurface?: string
    floors?: string
    terraces?: string
    bathrooms?: string
    bedrooms?: string
    hasKitchen?: boolean
    typeOfKitchen?: string
    hasHeating?: boolean
    typeOfHeating?: string
    hasAirConditioning?: boolean
    hasGarage?: boolean
    hasParking?: boolean
    hasElevator?: boolean
    hasGym?: boolean
    hasSwimmingPool?: boolean
    hasSecurity?: boolean
    typeOfSecurity?: ISelectOption[] | string[]
    locatedInCondominium?: boolean
    isFurnished?: boolean
    hasBarbecueArea?: boolean
    propertyTitle?: string
    propertyDescription?: string
    numberOfPrivate?: string
    numberOfVacantFloors?: string
    numberOfMeetingRooms?: string
    hasKitchenet?: boolean
    hasHouse?: boolean
    locatedInGallery?: boolean
    locatedFacingTheStreet?: boolean
    floorLevelLocation?: string
    officeNumber?: string
    commonExpenses?: string
  }
  countryId: number
  stateId: number
  cityId: number
  number?: string
  letter?: string
  references?: string
  address?: string
  addressPublic?: string
  // country?: string
  // region?: string
  // commune?: string
  // city?: string
  isExchanged: boolean
  timeInExchange?: {
    start?: Date | null
    end?: Date | null
  }
  propertyDescriptionInExchange?: string
}
