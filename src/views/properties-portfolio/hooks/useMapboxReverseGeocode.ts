type Coordinates = { lat: number; lng: number }

export type AddressES = {
  full: string
  street?: string
  number?: string
  neighborhood?: string
  commune?: string
  city?: string
  region?: string
  postcode?: string
  lat?: string
  lng?: string
}

export function useMapboxReverseGeocode(
  token = import.meta.env.VITE_MAPBOX_TOKEN as string
) {
  const reverse = async ({
    lat,
    lng,
  }: Coordinates): Promise<AddressES | null> => {
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`
    )
    url.searchParams.set('access_token', token)
    url.searchParams.set('language', 'es')
    url.searchParams.set(
      'types',
      [
        'address',
        'place',
        'locality',
        'district',
        'neighborhood',
        'region',
        'postcode',
      ].join(',')
    )

    const res = await fetch(url.toString())
    if (!res.ok) return null
    const data = await res.json()
    const feature = data.features?.[0]
    if (!feature) return null

    const full = feature.place_name as string
    const ctx: Record<string, string> = {}
    ;(feature.context || []).forEach((c: any) => {
      const [k] = (c.id as string).split('.')
      ctx[k] = c.text_es || c.text
    })

    const street = feature.properties?.street || feature.text_es || feature.text
    const number = feature.address
    const neighborhood = ctx.neighborhood
    const commune = ctx.district || ctx.place
    const city = ctx.place || ctx.locality
    const region = ctx.region
    const postcode = ctx.postcode

    return {
      full,
      street,
      number,
      neighborhood,
      commune,
      city,
      region,
      postcode,
    }
  }

  return { reverse }
}
