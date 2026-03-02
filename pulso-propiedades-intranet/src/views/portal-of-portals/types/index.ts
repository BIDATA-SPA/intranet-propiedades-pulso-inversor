export type Coordinates = {
  lat: number
  lng: number
}

export type Location = {
  address: string
  neighborhood: string
  commune: string
  city: string
  region: string
  coordinates: Coordinates
}

export type Broker = {
  name: string
  phone: string
  email: string
}

export type Property = {
  portal: string
  listing_type: 'venta' | 'arriendo' | string
  property_type: string
  external_url: string | null
  code: string
  title: string
  status: 'available' | 'reserved' | 'sold' | string
  published_at: string
  //   scraped_at: string
  price_clp: number | null
  price_uf: number | null
  currency: 'CLP' | 'UF' | string
  area_total: number | null
  area_useful: number | null
  unit: 'mt2' | string
  bedrooms: number | null
  bathrooms: number | null
  parking: number | null
  floor: number | null
  age: number | null
  orientation: 'N' | 'S' | 'E' | 'W' | 'NE' | 'NW' | 'SE' | 'SW' | string
  common_expenses: number | null
  condition: 'new' | 'used' | string
  location: Location
  description: string
  features: string[]
  tags: string[]
  images: string[]
  broker: Broker
  consolidated_id: string
  consolidated_status: 'pending' | 'approved' | 'rejected' | string
  uuid: string
  created_at: string
  updated_at: string
  property_portales: { id: string; name: string }[]
  lat: number
  lng: number
  owner_id: number
  pending_approval: boolean
}
