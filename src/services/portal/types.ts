export type NumericLike = number | `${number}` | null | undefined

export interface SpcSession {
  email?: string
}

export interface SpcUser {
  id: string
  name?: string
  lastName?: string
  session?: SpcSession
}

export interface SpcCountry {
  id: number | string
  name: string
}

export interface SpcCity {
  id: number | string
  name: string
}

export interface SpcState {
  id: number | string
  name: string
}

export interface SpcAddress {
  address?: string
  letter?: string
  number?: string
  references?: string
  addressPublic?: string
  country?: SpcCountry
  city?: SpcCity
  state?: SpcState
  coordinates: {
    lat: number | string
    lng: number | string
  }
}

export interface SpcPropertyStatus {
  id: string | number
  name: string
}

export interface SpcImage {
  id: string | number
  path: string
  number: number
}

export interface SpcCharacteristics {
  surface?: NumericLike
  constructedSurface?: NumericLike
  floors?: NumericLike | string
  terraces?: string
  terraceM2?: NumericLike
  numberOfFloors?: NumericLike
  bedrooms?: NumericLike
  bathrooms?: NumericLike
  typeOfKitchen?: string
  hasHeating?: boolean
  typeOfHeating?: string
  hasAirConditioning?: boolean
  hasParking?: boolean
  numberOfParkingSpaces?: NumericLike
  hasGarage?: boolean
  hasElevator?: boolean
  hasGym?: boolean
  hasKitchen?: boolean
  hasSwimmingPool?: boolean
  hasSecurity?: boolean
  typeOfSecurity?: string[]
  surfaceUnit?: string | null
  locatedInCondominium?: boolean
  isFurnished?: boolean
  hasBarbecueArea?: boolean
  numberOfPrivate?: NumericLike | string
  numberOfVacantFloors?: NumericLike | string
  numberOfMeetingRooms?: NumericLike | string
  hasKitchenet?: boolean
  locatedInGallery?: boolean
  locatedFacingTheStreet?: boolean
  floorLevelLocation?: string
  commonExpenses?: NumericLike
  officeNumber?: string
  hasHouse?: boolean
  age?: NumericLike
  orientation?: string // "N", "NE", etc.
}
export interface SpcCustomer {
  id: string | number
  name?: string
  lastName?: string
}
export interface SpcProperty {
  id: string
  propertyTitle: string
  propertyDescription: string
  typeOfOperationId: 'Venta' | 'Arriendo' | string
  typeOfPropertyId:
    | 'Casa'
    | 'Departamento'
    | 'Oficina'
    | 'Local'
    | 'Bodega'
    | 'Parcela'
    | 'Terreno'
    | string
  timeAvailableStart?: string | null
  timeAvailableEnd?: string | null
  currencyId: 'CLP' | 'UF' | 'USD' | string
  propertyPrice: NumericLike
  highlighted?: boolean
  observations?: string
  externalLink?: string | null
  isExchanged?: boolean
  timeInExchangeStart?: string | null
  timeInExchangeEnd?: string | null
  disableReason?: string | null
  propertyDescriptionInExchange?: string
  createdAt?: string
  updatedAt?: string
  user?: SpcUser
  customer?: SpcCustomer
  propertyStatus?: SpcPropertyStatus
  characteristics?: SpcCharacteristics
  address: SpcAddress
  propertyClick?: unknown
  images?: SpcImage[]
  owner_id: number
  property_portales?: { portalName: string }[]
}
