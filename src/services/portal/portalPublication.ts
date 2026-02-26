export type PortalCoordinates = { lat: number; lng: number }

export type PortalLocation = {
  address: string
  neighborhood: string
  commune: string
  city: string
  region: string
  coordinates: PortalCoordinates
}

export type PortalBroker = {
  name: string
  phone: string
  email: string
}

export type PortalPublication = {
  portal: string
  listing_type: string
  property_type: string
  external_url: string | null
  code: string
  title: string
  status?: string
  published_at: string
  //   scraped_at: string
  price_clp: number
  price_uf: number
  currency: string
  area_total: number
  area_useful: number
  unit: string
  bedrooms: number
  bathrooms: number
  parking: number
  floor: number
  age: number
  orientation: string
  common_expenses: number
  condition: string
  location: PortalLocation
  description: string
  features: string[]
  tags: string[]
  images: string[]
  broker: PortalBroker
  consolidated_id?: string
  consolidated_status?: string
  uuid?: string
  created_at?: string
  updated_at?: string
  owner_id: number
  pending_approval: boolean
}

export type PortalPublicationCreate = Omit<
  PortalPublication,
  | 'status'
  | 'consolidated_id'
  | 'consolidated_status'
  | 'uuid'
  | 'created_at'
  | 'updated_at'
  | 'owner_id'
>

export type PortalPublicationUpdate = Omit<
  PortalPublication,
  | 'portal'
  | 'listing_type'
  | 'property_type'
  | 'external_url'
  | 'code'
  | 'uuid'
  | 'created_at'
  | 'updated_at'
> & {
  consolidated_id?: string
  consolidated_status?: string
}

export type PortalErrorDetail = {
  loc: string[]
  msg: string
  type: string
}

export type PortalError402 = {
  detail: PortalErrorDetail[]
}

export type PortalFindParams = Partial<{
  page: number
  page_size: number
  portal: string | null
  listing_type: string | null
  property_type: string | null
  status: string | null
  external_url: string | null
  code: string | null
  price_clp_min: number | null
  price_clp_max: number | null
  price_uf_min: number | null
  price_uf_max: number | null
  currency: string | null
  area_useful_min: number | null
  area_useful_max: number | null
  area_total_min: number | null
  area_total_max: number | null
  unit: string | null
  bedrooms_min: number | null
  bedrooms_max: number | null
  bathrooms_min: number | null
  bathrooms_max: number | null
  parking_min: number | null
  parking_max: number | null
  city: string | null
  commune: string | null
  region: string | null
  neighborhood: string | null
  published_at_from: string | null
  published_at_to: string | null
  scraped_at_from: string | null
  scraped_at_to: string | null
  age_min: number | null
  age_max: number | null
  orientation: string | null
  condition: string | null
  consolidated_id: string | null
  consolidated_status: string | null
}>

export type PortalId = 'pulsoPropiedades'

export const PORTAL_OPTIONS: Array<{
  value: PortalId
  label: string
}> = [
  {
    value: 'pulsoPropiedades',
    label: 'pulsoPropiedades',
  },
]
