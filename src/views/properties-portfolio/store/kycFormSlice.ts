import { createSlice } from '@reduxjs/toolkit'

export type InformacionPrincipal = {
  customerId: number | null
  typeOfOperationId: string | null
  typeOfPropertyId: string | null
  timeAvailable: {
    start?: string | Date | null
    end?: string | Date | null
  }
  currencyId: 'CLP' | 'UF' | 'USD' | 'M2'
  propertyPrice: number
}

export type Caracteristicas = {
  externalLink: string // ✅
  highlighted: boolean // ✅
  propertyStatusId: number // ⚠️ revisar formato del patch
  observations: string // ✅
  disableReason: string // ⚠️ revisar formato del patch
  characteristics: {
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

    // DEPTOS
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

    // LOCAL COMERCIAL
    buildingName: string //✅
    buildingType: string //✅
    hasSecondLevel: boolean //✅

    orientation: string //✅
    typeOfHeating: string // ✅
    locatedInGallery: boolean // ✅
    locatedFacingTheStreet: boolean //✅
    numberOfPrivate: number // ✅

    // DEPARTAMENTO
    numberOfDepartment: string // ✅
    apartmentsPerFloor: number // ✅
    departmentType: string // ✅
    hasRooftop: boolean // ✅
    hasBoiler: boolean //✅
    hasLoggia: boolean //✅

    // PARCELA
    frontageMeters: number //✅
    deepMeters: number //✅
    isUrbanized: boolean //✅
    hasFlatSurface: boolean //✅

    // BODEGA
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

    // POR INTEGRAR
    // OFICINA
    hasMeetingRooms: boolean // ✅
    hasFreeFloor: boolean //✅
    hasValetParking: boolean //✅
    hasLobby: boolean //✅
    hasReceptionArea: boolean //✅
    bathroomsPerFloor: number //✅
    officesPerFloor: number //✅

    // POR INTEGRAR
    // ESTACIONAMIENTO
    hasSimpleParking: boolean
    hasDoubleParking: boolean
    hasSubway: boolean
    typeOfParking: string
    accessToParking: string
    typeOfParkingCoverage: string
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
}

export type Address = {
  countryId: number | null
  stateId: number | null
  cityId: number | null
  letter: string
  number: string
  references: string
  address: string
  addressPublic: string
}

export type FinancialInformation = {
  isExchanged: boolean
  timeInExchange: {
    start?: null
    end?: null
  }
  propertyDescriptionInExchange: string
}

export type Portal =
  | 'portal-inmobiliario'
  | 'emol'
  | 'toc-toc'
  | 'mercado-libre'
  | ''

export type ListingType = 'venta' | 'arriendo' | ''

export type PropertyType =
  | 'departamento'
  | 'casa'
  | 'parcela'
  | 'edificio'
  | 'local'
  | 'oficina'
  | 'bodega'
  | ''

export type Currency = 'CLP' | 'UF' | 'USD' | ''

export type Unit = 'mt2' | 'hectarea'

export type TCondition = 'new' | 'good' | 'needs_repair' | 'other'

export type Location = {
  address: 'string'
  neighborhood: 'string'
  commune: 'string'
  city: 'string'
  region: 'string'
  coordinates: {
    lat: 0
    lng: 0
  }
}

export type PortalOfPortals = {
  portal: Portal
  listing_type: ListingType
  property_type: PropertyType
  external_url: string
  code: string
  title: string
  published_at: string
  //   scraped_at: string
  price_clp: number | null
  price_uf: number | null
  currency: Currency
  area_total?: number | null
  area_useful?: number | null
  unit: Unit
}

type FormData = {
  informacionPrincipal: InformacionPrincipal
  caracteristicas: Caracteristicas
  addressInformation: Address
  financialInformation: FinancialInformation
  portalOfPortals: PortalOfPortals
}

export type StepStatus = Record<number, { status: string }>

export type KycFormState = {
  formData: FormData
  stepStatus: StepStatus
  currentStep: number
}

export const SLICE_NAME = 'accountDetailForm'

export const initialState: KycFormState = {
  formData: {
    informacionPrincipal: {
      customerId: null,
      typeOfOperationId: null,
      typeOfPropertyId: null,
      timeAvailable: {
        start: null,
        end: null,
      },
      currencyId: 'CLP',
      propertyPrice: 0,
    },
    caracteristicas: {
      externalLink: '', // ✅
      highlighted: false, // ✅
      propertyStatusId: 4, // ⚠️ revisar formato del patch
      observations: '', // ✅
      disableReason: '', // ⚠️
      characteristics: {
        rol: '', // ✅
        locatedInCondominium: false, //✅
        numberOfVacantFloors: '', //✅
        numberOfMeetingRooms: '', //✅
        hasKitchenet: false, // ✅
        hasHouse: false, //✅
        officeNumber: '', //✅
        floorLevelLocation: '', //✅

        commonExpenses: '', //✅
        numberOfFloors: '1', //✅
        terraces: '', //✅
        terraceM2: '', //✅
        bathrooms: '', //✅
        bedrooms: '', //✅
        surfaceUnit: 'm2', //✅
        typeOfKitchen: '', //✅
        hasHeating: false, //✅
        numberOfParkingSpaces: '', //✅

        hasSecurity: false, //✅
        typeOfSecurity: [], //✅
        isFurnished: false, //✅
        hasAirConditioning: false, //✅
        hasGarage: false, // ✅
        hasParking: false, //✅
        hasElevator: false, //✅
        hasGym: false, //✅
        hasSwimmingPool: false, //✅
        hasBarbecueArea: false, //✅
        propertyTitle: '', //✅
        propertyDescription: '', //✅
        hasKitchen: false, //✅
        surface: '', //✅
        constructedSurface: '', //✅
        hasServiceRoom: false, //✅
        hasLivingRoom: false, //✅
        floorNumber: 0, //✅
        geography: '', //✅
        storageCount: 0, //✅
        ceilingType: '', //✅
        flooringType: '', //✅
        unitNumber: '', //✅
        hasHomeOffice: false, //✅
        hasDiningRoom: false, //✅
        hasYard: false, //✅
        hasGuestBathroom: false, //✅
        hasSuite: false, //✅
        hasWalkInCloset: false, //✅
        hasPlayRoom: false, //✅
        hasPlayground: false, //✅
        hasFireplace: false, //✅
        hasPaddleCourt: false, //✅
        hasPartyRoom: false, //✅
        hasSoccerField: false, //✅
        hasTennisCourt: false, //✅
        hasBasketballCourt: false, //✅
        contactHours: '', //✅
        yearOfConstruction: 0, //✅
        hasJacuzzi: false, //✅
        hasHorseStable: false, //✅
        landShape: '', //✅
        distanceToAsphalt: 0, //✅
        has24hConcierge: false, //✅
        hasInternetAccess: false, //✅
        hasNaturalGas: false, //✅
        hasRunningWater: false, //✅
        hasTelephoneLine: false, //✅
        hasSewerConnection: false, //✅
        hasElectricity: false, //✅
        hasMansard: false, //✅
        hasBalcony: false, //✅
        hasClosets: false, //✅
        hasVisitorParking: false, //✅
        hasGreenAreas: false, //✅
        hasMultiSportsCourt: false, //✅
        hasRefrigerator: false, //✅
        hasCinemaArea: false, //✅
        hasSauna: false, //✅
        houseType: '', //✅
        apartmentType: '', //✅
        unitsPerFloor: 0, //✅
        hasLaundryRoom: false, //✅
        hasMultipurposeRoom: false, //✅
        petsAllowed: false, //✅
        isCommercialUseAllowed: false, //✅
        condominiumClosed: false, //✅
        hasConcierge: false, //✅
        hasWasherConnection: false, //✅
        hasElectricGenerator: false, //✅
        hasSolarEnergy: false, //✅
        hasCistern: false, //✅
        hasBolier: false, //✅
        buildingName: '', //✅
        buildingType: '', //✅
        hasSecondLevel: false, //✅

        // CASA
        orientation: '', // ✅
        typeOfHeating: '', //✅

        // LOCAL COMERCIAL
        locatedInGallery: false, //✅
        locatedFacingTheStreet: false, //✅
        numberOfPrivate: 0, //✅

        // DEPARTAMENTO
        numberOfDepartment: '', //✅
        apartmentsPerFloor: 0, //✅
        departmentType: '', //✅
        hasRooftop: false, //✅
        hasBoiler: false, //✅
        hasLoggia: false, //✅

        // PARCELA
        frontageMeters: 0, //✅
        deepMeters: 0, //✅
        isUrbanized: false, //✅
        hasFlatSurface: false, //✅
        typeOfBuilding: '', //✅
        hasControlledAccess: false, //✅
        hasThreephaseCurrent: false, //✅
        hasSurveillanceCamera: false, //✅
        hasScale: false, //✅
        hasVentilationSystem: false, //✅
        typeOfWinery: '', //✅
        cellarHeight: 0, //✅
        cellarHeightUnit: 'm', //✅
        pricePerUnitOfArea: 0, //✅
        pricePerUnitOfAreaUnit: '$/ha', //✅ REVISION DE TIPADO
        floorStand: 0, //✅
        floorStandUnit: 't/m2', //✅
        flatbedTrailers: 0, //✅
        hasAlarm: false, //✅
        hasFireProtectionSystem: false, //✅

        // OFICINA
        hasMeetingRooms: false, // ✅
        hasFreeFloor: false, //✅
        hasValetParking: false, //✅
        hasLobby: false, //✅
        hasReceptionArea: false, //✅
        bathroomsPerFloor: 0, //✅
        officesPerFloor: 0, //✅

        // ESTACIONAMIENTO
        hasSimpleParking: false,
        hasDoubleParking: false,
        hasSubway: false,
        typeOfParking: '',
        accessToParking: '',
        typeOfParkingCoverage: '',

        // TERRENO
        hasReforestation: false,

        // INDUSTRIAL
        hasWarehouses: false,
        hasLocationCentral: false,

        // LOCAL COMERCIAL
        hasWheelchairRamp: false,
        hasFittingRoom: false,

        // AGRICOLA
        hectares: 0,
        hasDrinkingFountains: false,
        hasWaterTank: false,
        hasBarn: false,
        hasMills: false,
        hasCorral: false,
        hasSilos: false,

        typeOfFarm: '',
        coveredHullAread: 0,
        coveredHullAreadUnit: 'm2',

        // DEPARTAMENTO AMOBLADO
        hasCowork: false,
        hasClosedCondominium: false,
        hasWashingMachineConnection: false,

        // SEPULTURA
        sectionWithinTheCemetery: '',
        depth: 0,
        depthUnit: 'm',
        cementeryName: '',
        width: 0,
        widthUnit: 'm',
        typeOfCemeteryPlot: '',
        long: 0,
        longUnit: 'm',
      },
    },
    addressInformation: {
      countryId: null,
      stateId: null,
      cityId: null,
      letter: '',
      number: '',
      references: '',
      address: '',
      addressPublic: '',
    },
    financialInformation: {
      isExchanged: false,
      timeInExchange: {
        start: null,
        end: null,
      },
      propertyDescriptionInExchange: '',
    },
    portalOfPortals: {
      portal: '',
      listing_type: '',
      property_type: '',
      external_url: '',
      code: '',
      title: '',
      published_at: '',
      //   scraped_at: '',
      price_clp: null,
      price_uf: null,
      currency: '',
      area_total: null,
      area_useful: null,
      unit: 'mt2',
    },
  },
  stepStatus: {
    0: { status: 'pending' },
    1: { status: 'pending' },
    2: { status: 'pending' },
    3: { status: 'pending' },
    4: { status: 'pending' },
    5: { status: 'pending' },
  },
  currentStep: 0,
}

const kycFormSlice = createSlice({
  name: `${SLICE_NAME}/state`,
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    setStepStatus: (state, action) => {
      state.stepStatus = { ...state.stepStatus, ...action.payload }
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload
    },
    resetFormState: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const { setFormData, setStepStatus, setCurrentStep, resetFormState } =
  kycFormSlice.actions

export default kycFormSlice.reducer
