export type TMetadata = {
  totalProperties: number
  totalPropertiesInExchange: number
  totalPropertiesSold: number
}

export type TCellAddressProps = {
  id: number
  name: string
}

export type TCellProps = {
  row: {
    original: {
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
      createdAt: Date
      updatedAt: Date
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
      disabledReason: {
        id: string
        name: string
      }
      characteristics: {
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
        typeOfSecurity: string[]
        locatedInCondominium: boolean
        isFurnished: boolean
        hasBarbecueArea: boolean
      }
      address: {
        address: string
        state: TCellAddressProps
        country: TCellAddressProps
        city: TCellAddressProps
        letter: string
        number: string
        references: string
      }
      images: string[]
    }
  }
}
