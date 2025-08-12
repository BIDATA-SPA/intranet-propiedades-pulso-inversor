import {
  Button,
  FormItem,
  Input,
  InputGroup,
  Notification,
  Spinner,
  toast,
} from '@/components/ui'
import getGeolocation from '@/services/geolocations/Geolocation.service'
import { Field, FieldProps } from 'formik'
import { useCallback, useEffect, useRef, useState } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import type { LngLat } from 'react-map-gl'
import Map, { MapRef, Marker, NavigationControl } from 'react-map-gl'
import { FormModel } from './CustomerSearchForm'

interface Location {
  id: string
  type: string
  place_type: string[]
  text: string
  place_name: string
}

interface LocationData {
  address: {
    country: string | null
    region: string | null
    address: string | null
  }
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const CustomerSearchMap = ({
  values,
  setValues,
  marker,
  setMarker,
  initialViewState,
}) => {
  const [events, logEvents] = useState<Record<string, LngLat>>({})
  const [isLocationLoading, setIsLocationLoading] = useState(false)
  const mapRef = useRef<MapRef>(null)

  const onMarkerDragStart = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragStart: event.lngLat }))
  }, [])

  const onMarkerDrag = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDrag: event.lngLat }))

    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    })
  }, [])

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  const getCurrentLocation = async (
    lat: number,
    long: number
  ): Promise<LocationData> => {
    const [locations] = await getGeolocation.getGeocode(lat, long)

    const locationData: LocationData = {
      address: {
        country: null,
        region: null,
        address: null,
      },
    }

    try {
      if (locations) {
        await locations?.forEach((location: Location) => {
          const placeType = location?.place_type[0]
          const placeName = location?.text

          switch (placeType) {
            case 'country':
              locationData.address.country = placeName
              break
            case 'region':
              locationData.address.region = placeName
              break
            case 'address':
              locationData.address.address = placeName
              break
          }
        })
        openNotification(
          'success',
          '¡Vas bien!',
          'Ubicación guardada exitosamente.',
          4
        )
      }
    } catch (error) {
      if (error) {
        openNotification(
          'warning',
          'Error',
          'Ubicación no válida, intenta nuevamente.',
          4
        )
        setMarker({
          latitude: -33.4489,
          longitude: -70.6693,
        })
      }
    }

    // Uses the first result as address if it has not been assigned previously.
    if (!locationData?.address && locations.length > 0) {
      locationData.address = locations[0].place_name
    }
    return locationData
  }

  const onMarkerDragEnd = useCallback(async (event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }))
    const data = await getCurrentLocation(event.lngLat.lat, event.lngLat.lng)
    const _normalizedRegionName =
      data?.address?.region === 'Santiago Metropolitan Region'
        ? 'Metropolitana de Santiago'
        : data?.address?.region

    setValues((preValues) => ({
      ...preValues,
      address: {
        country: data?.address?.country,
        region: _normalizedRegionName,
        commune: data?.address?.country,
        address: data?.address?.address,
      },
    }))
  }, [])

  useEffect(() => {
    setValues({
      ...values,
      address: {
        country: values?.address?.country,
        region:
          values?.address?.region === 'Santiago Metropolitan Region'
            ? 'Metropolitana de Santiago'
            : values?.address?.region,
        address: values?.address?.address,
      },
    })
  }, [])

  const centerMapOnPin = (longitude, latitude) => {
    if (mapRef.current) {
      mapRef.current.getMap().flyTo({
        center: [longitude, latitude],
        essential: true,
        zoom: 10,
      })
    }
  }

  const getCoordinatesAndLocationData = async (address) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${MAPBOX_TOKEN}&limit=1`

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (data.features && data.features.length > 0) {
        const firstFeature = data.features[0]
        const coordinates = firstFeature.center
        const locationData = {
          country: findLocationInfo(firstFeature.context, 'country'),
          region:
            findLocationInfo(firstFeature.context, 'region') ===
            'Santiago Metropolitan Region'
              ? 'Metropolitana de Santiago'
              : findLocationInfo(firstFeature.context, 'region'),
        }

        return {
          lat: coordinates[1],
          lng: coordinates[0],
          locationData,
        }
      }
      return null
    } catch (error) {
      throw new Error(error.message)
    }
  }

  const findLocationInfo = (context, types) => {
    for (const type of types) {
      const info = context.find((c) => c.id.startsWith(type))
      if (info) return info.text
    }
    return ''
  }

  const handleAddressChange = async (e, form) => {
    const address = e.target.value
    form.setFieldValue('address.address', address)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (address.length > 1) {
        // >5
        setIsLocationLoading(true)
        const result = await getCoordinatesAndLocationData(address)
        setIsLocationLoading(false)

        if (result) {
          const { lat, lng, locationData } = result
          setMarker({ latitude: lat, longitude: lng })
          centerMapOnPin(lng, lat)
          form.setFieldValue('address.country', locationData?.country)
          form.setFieldValue(
            'address.region',
            locationData?.region === 'Santiago Metropolitan Region'
              ? 'Metropolitana de Santiago'
              : locationData?.region
          )
        }
      }
    }, 500)
  }

  useEffect(() => {
    // Cancel the timer
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-12">
      <div className="w-full order-last h-full">
        <div>
          <FormItem
            label="Buscar por Ciudad/Comuna/Referencia"
            className="mt-4"
          >
            <InputGroup>
              <Field name="address.address">
                {({ field, form }: FieldProps<FormModel>) => {
                  return (
                    <Input
                      field={field}
                      type="text"
                      size="md"
                      placeholder="Ingresar una ciudad/comuna, ej: Las Condes"
                      value={values.address?.address}
                      onChange={(e) => {
                        handleAddressChange(e, form)
                      }}
                    />
                  )
                }}
              </Field>
              <Button
                icon={<HiOutlineSearch className="text-xl cursor-default" />}
              />
            </InputGroup>
            <div className="flex items-center gap-1 mt-1.5">
              <small>Ingresa una comuna válida.</small>
              {isLocationLoading && <Spinner />}
            </div>
          </FormItem>
        </div>

        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
          <FormItem label="País">
            <Field name="address.country">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Input
                    readOnly
                    field={field}
                    type="text"
                    size="md"
                    className="mb-2"
                    placeholder="Esperando selección..."
                    value={values?.address?.country}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Región/Estado">
            <Field name="address.region">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Input
                    readOnly
                    field={field}
                    type="text"
                    size="md"
                    className="mb-2"
                    placeholder="Ingresar una Región/Estado"
                    value={values?.address?.region}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>
        </div>

        <FormItem label="Comuna/Distrito">
          <Field name="address.commune">
            {/* address.city */}
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2"
                  placeholder="Ingresar una Comuna"
                  value={values.address?.commune}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <div className="relative h-auto w-100">
        <div className="h-[50vh] w-100">
          <Map
            ref={mapRef}
            initialViewState={initialViewState}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <Marker
              draggable
              longitude={marker.longitude}
              latitude={marker.latitude}
              anchor="bottom"
              onDragStart={onMarkerDragStart}
              onDrag={onMarkerDrag}
              onDragEnd={onMarkerDragEnd}
            >
              <Pin />
            </Marker>
            <NavigationControl />
          </Map>
        </div>
      </div>
    </div>
  )
}

export default CustomerSearchMap
