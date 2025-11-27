import { createSlice } from '@reduxjs/toolkit'

export type PersonalInformation = {
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

export type Identification = {
  externalLink: string | null
  highlighted: boolean
  observations: string | null
  characteristics: {
    locatedInCondominium: boolean
    surface: string | null
    constructedSurface: string | null
    numberOfPrivate: string | null
    numberOfVacantFloors: string | null
    numberOfMeetingRooms: string | null
    hasKitchenet: boolean
    hasHouse: boolean
    officeNumber: string
    floorLevelLocation: string
    locatedInGallery: boolean
    locatedFacingTheStreet: boolean
    commonExpenses: string
    floors: string
    numberOfFloors: string
    terraces: string
    terraceM2: string
    bathrooms: string
    bedrooms: string
    hasKitchen: boolean
    typeOfKitchen: string
    hasHeating: boolean
    typeOfHeating: string
    hasSecurity: boolean
    typeOfSecurity: string[]
    isFurnished: boolean
    hasAirConditioning: boolean
    hasGarage: boolean
    hasParking: boolean
    hasElevator: boolean
    hasGym: boolean
    hasSwimmingPool: boolean
    hasBarbecueArea: boolean
    propertyTitle: string
    propertyDescription: string
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
  //   bedrooms?: number | null
  //   bathrooms?: number | null
  //   parking?: number | null
  //   floor?: number | null
  //   age?: number | null
  //   orientation?: string | null
  //   common_expenses?: number | null
  //   condition?: string | null
  //   location: {
  //     address?: string | null
  //     neighborhood?: string | null
  //     commune?: string | null
  //     city?: string | null
  //     region?: string | null
  //     coordinates?: {
  //       lat: number
  //       lng: number
  //     }
  //   }
  //   description?: string | null
  //   features: string[]
  //   tags: string[]
  //   images: string[]
  //   broker: {
  //     name: string | null
  //     phone: string | null
  //     email: string | null
  //   }
}

type FormData = {
  personalInformation: PersonalInformation
  identification: Identification
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
    personalInformation: {
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
    identification: {
      externalLink: '',
      highlighted: false,
      observations: '',
      characteristics: {
        locatedInCondominium: false,
        surface: '',
        constructedSurface: '',
        numberOfPrivate: '',
        numberOfVacantFloors: '',
        numberOfMeetingRooms: '',
        hasKitchenet: false,
        hasHouse: false,
        officeNumber: '',
        floorLevelLocation: '',
        locatedInGallery: false,
        locatedFacingTheStreet: false,
        commonExpenses: '',
        floors: '',
        numberOfFloors: '',
        terraces: '',
        terraceM2: '',
        bathrooms: '',
        bedrooms: '',
        hasKitchen: false,
        typeOfKitchen: '',
        hasHeating: false,
        typeOfHeating: '',
        hasSecurity: false,
        typeOfSecurity: [],
        isFurnished: false,
        hasAirConditioning: false,
        hasGarage: false,
        hasParking: false,
        hasElevator: false,
        hasGym: false,
        hasSwimmingPool: false,
        hasBarbecueArea: false,
        propertyTitle: '',
        propertyDescription: '',
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
      isExchanged: true,
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
