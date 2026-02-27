export interface Property {
  property_portales: string
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
  propertyStatus: {
    id: string
    name: string
  }
  disableReason: string
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
    orientation: string // ✅
    rol: string //✅
    locatedInCondominium: boolean //✅
    numberOfVacantFloors: string //✅
    numberOfMeetingRooms: string //✅
    hasKitchenet: boolean //✅
    hasHouse: boolean //✅
    officeNumber: string //✅
    floorLevelLocation: string //✅
    commonExpenses: string //✅
    numberOfFloors: string //✅
    terraces: string //✅
    terraceM2: string //✅
    bathrooms: string //✅
    bedrooms: string //✅
    surfaceUnit: string //✅
    typeOfKitchen: string //✅
    hasHeating: boolean //✅
    hasSecurity: boolean //✅
    typeOfSecurity: string[] //✅
    typeOfHeating: string //✅
    isFurnished: boolean //✅
    hasAirConditioning: boolean //✅
    hasGarage: boolean // ✅
    hasParking: boolean //✅
    hasElevator: boolean //✅
    hasGym: boolean //✅
    hasSwimmingPool: boolean //✅
    hasBarbecueArea: boolean //✅
    propertyTitle: string //✅
    propertyDescription: string //✅
    hasKitchen: boolean //✅.
    surface: string //✅
    numberOfParkingSpaces: string //✅
    constructedSurface: string //✅
    hasServiceRoom: boolean //✅
    hasLivingRoom: boolean //✅
    geography: string //✅
    storageCount: number //✅
    ceilingType: string //✅
    flooringType: string //✅
    hasHomeOffice: boolean //✅
    hasDiningRoom: boolean //✅
    hasYard: boolean //✅
    hasGuestBathroom: boolean //✅
    hasSuite: boolean //✅
    hasWalkInCloset: boolean //✅
    hasPlayRoom: boolean //✅
    hasFireplace: boolean //✅
    hasPlayground: boolean //✅
    hasPaddleCourt: boolean //✅
    hasPartyRoom: boolean //✅
    hasSoccerField: boolean //✅
    hasTennisCourt: boolean //✅
    hasBasketballCourt: boolean //✅
    contactHours: string //✅
    yearOfConstruction: number //✅
    hasJacuzzi: boolean //✅
    hasHorseStable: boolean //✅
    landShape: string //✅
    distanceToAsphalt: number //✅
    has24hConcierge: boolean //✅
    hasInternetAccess: boolean //✅
    hasNaturalGas: boolean //✅
    hasRunningWater: boolean //✅
    hasTelephoneLine: boolean //✅
    hasSewerConnection: boolean //✅
    hasElectricity: boolean //✅
    hasMansard: boolean //✅
    hasBalcony: boolean //✅
    hasClosets: boolean //✅
    hasVisitorParking: boolean //✅
    hasGreenAreas: boolean //✅
    hasMultiSportsCourt: boolean //✅
    hasRefrigerator: boolean //✅
    hasCinemaArea: boolean //✅
    hasSauna: boolean //✅
    houseType: string //✅
    floorNumber: number //✅
    unitNumber: string //✅
    apartmentType: string //✅
    unitsPerFloor: number // ✅
    hasLaundryRoom: boolean //✅
    hasMultipurposeRoom: boolean //✅
    petsAllowed: boolean //✅
    isCommercialUseAllowed: boolean //✅
    condominiumClosed: boolean //✅
    hasConcierge: boolean //✅
    hasWasherConnection: boolean //✅
    hasElectricGenerator: boolean //✅
    hasSolarEnergy: boolean //✅
    hasCistern: boolean //✅
    hasBolier: boolean //✅
    buildingName: string //✅
    buildingType: string //✅
    hasSecondLevel: boolean //✅
    locatedInGallery: boolean // ✅
    locatedFacingTheStreet: boolean //✅
    numberOfPrivate: number // ✅
    numberOfDepartment: string // ✅
    apartmentsPerFloor: number // ✅
    departmentType: string // ✅
    hasRooftop: boolean // ✅
    hasBoiler: boolean //✅
    hasLoggia: boolean //✅
    frontageMeters: number //✅
    deepMeters: number //✅
    isUrbanized: boolean //✅
    hasFlatSurface: boolean //✅

    // POR INTEGRAR
    typeOfBuilding: string //✅
    hasControlledAccess: boolean //✅
    hasThreephaseCurrent: boolean //✅
    hasSurveillanceCamera: boolean //✅
    hasScale: boolean //✅
    hasVentilationSystem: boolean //✅
    typeOfWinery: string //✅
    cellarHeight: number //✅
    cellarHeightUnit: string //✅
    pricePerUnitOfArea: number //✅
    pricePerUnitOfAreaUnit: string //✅
    floorStand: number //✅
    floorStandUnit: string //✅
    flatbedTrailers: number //✅
    hasAlarm: boolean //✅
    hasFireProtectionSystem: boolean //✅

    // OFICINA
    hasMeetingRooms: boolean // ✅
    hasFreeFloor: boolean //✅
    hasValetParking: boolean //✅
    hasLobby: boolean //✅
    hasReceptionArea: boolean //✅
    bathroomsPerFloor: number //✅
    officesPerFloor: number //✅

    // ESTACIONAMIENTO
    hasSimpleParking: boolean
    hasDoubleParking: boolean
    hasSubway: boolean
    typeOfParking: string
    accessToParking: string
    typeOfParkingCoverage: string

    // TERRENO
    hasReforestation: boolean

    // INDUSTRIAL
    hasWarehouses: boolean
    hasLocationCentral: boolean

    // LOCAL COMERCIAL
    hasWheelchairRamp: boolean
    hasFittingRoom: boolean

    // AGRICOLA
    hectares: number
    hasDrinkingFountains: boolean
    hasWaterTank: boolean
    hasBarn: boolean
    hasMills: boolean
    hasCorral: boolean
    hasSilos: boolean

    typeOfFarm: string
    coveredHullAread: number
    coveredHullAreadUnit: string

    // DEPARTAMENTO AMOBLADO
    hasCowork: boolean
    hasClosedCondominium: boolean
    hasWashingMachineConnection: boolean

    // SEPULTURA
    sectionWithinTheCemetery: string
    depth: number
    depthUnit: string
    cementeryName: string
    width: number
    typeOfCemeteryPlot: string
    long: number
    widthUnit: string
    longUnit: string
  }
  address: {
    lng: number
    lat: number
    addressPublic: string
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
