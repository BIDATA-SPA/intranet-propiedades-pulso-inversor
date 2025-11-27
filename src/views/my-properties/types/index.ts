export interface PropertyProps {
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
  externalLink: string | null
  isExchanged: boolean
  timeInExchangeStart: string | null
  timeInExchangeEnd: string | null
  disableReason: string | null
  propertyDescriptionInExchange: string
  createdAt: string
  updatedAt: string
  user: User
  customer: Customer
  propertyStatus: PropertyStatus
  characteristics: Characteristics
  address: Address
  propertyClick: number | null
  images: Image[]
}

interface User {
  id: string
  name: string
  lastName: string
  session: Session
}

interface Session {
  email: string
}

interface Customer {
  id: string
  name: string
  lastName: string
}

interface PropertyStatus {
  id: string
  name: string
}

interface Characteristics {
  surface: string
  constructedSurface: string
  floors: string
  numberOfFloors: string
  terraces: string
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
  typeOfSecurity: SecurityType[]
  locatedInCondominium: boolean
  isFurnished: boolean
  hasBarbecueArea: boolean
  surfaceUnit: string | null
  numberOfPrivate: string | null
  numberOfVacantFloors: string | null
  numberOfMeetingRooms: string | null
  hasKitchenet: boolean | null
  locatedInGallery: boolean | null
  locatedFacingTheStreet: boolean | null
  floorLevelLocation: string | null
  commonExpenses: string | null
  officeNumber: string | null
  hasHouse: boolean | null
}

interface SecurityType {
  id: string
  name: string
}

interface Address {
  address: string
  letter: string
  number: string
  references: string
  addressPublic: string | null
  country: Location
  city: Location
  state: Location
}

interface Location {
  id: number
  name: string
}

interface Image {
  id: string
  path: string
  number?: number
}
