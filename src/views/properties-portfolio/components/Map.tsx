import MapboxLanguage from '@mapbox/mapbox-gl-language'
import { getIn, useFormikContext } from 'formik'
import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef, useState } from 'react'
import MapGL, {
  GeolocateControl,
  MapLayerMouseEvent,
  MapRef,
  Marker,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl'
import { useMapboxReverseGeocode } from '../hooks/useMapboxReverseGeocode'

;(mapboxgl as any).accessToken = import.meta.env.VITE_MAPBOX_TOKEN

type Coordinates = { lat: number; lng: number }
type MapProps<FormValues extends object = any> = {
  name: string
  addressFieldName?: string
  initialCenter?: Coordinates
  initialZoom?: number
  className?: string
  mapStyle?: string
}

const DEFAULT_CENTER: Coordinates = { lat: -33.45, lng: -70.6667 } // Santiago

export default function Map<FormValues extends object = any>({
  name,
  addressFieldName = 'reverseAddress',
  initialCenter = DEFAULT_CENTER,
  initialZoom = 12,
  className = 'h-96 w-full rounded-2xl overflow-hidden shadow',
  mapStyle = 'mapbox://styles/mapbox/streets-v12',
}: MapProps<FormValues>) {
  const mapRef = useRef<MapRef | null>(null)
  const { values, setFieldValue } = useFormikContext<FormValues>()
  const { reverse } = useMapboxReverseGeocode()

  const fieldValue = getIn(
    values as unknown as Record<string, unknown>,
    name
  ) as Coordinates | undefined
  const position = useMemo<Coordinates>(
    () => (fieldValue?.lat && fieldValue?.lng ? fieldValue : initialCenter),
    [fieldValue, initialCenter]
  )

  const [viewport, setViewport] = useState({
    latitude: position.lat,
    longitude: position.lng,
    zoom: fieldValue ? 15 : initialZoom,
  })

  useEffect(() => {
    setViewport((v) => ({
      ...v,
      latitude: position.lat,
      longitude: position.lng,
      zoom: fieldValue ? 15 : initialZoom,
    }))
  }, [position.lat, position.lng, fieldValue, initialZoom])

  const handleMapLoad = () => {
    const m = mapRef.current?.getMap()
    if (!m) return
    const language = new MapboxLanguage({ defaultLanguage: 'es' })
    m.addControl(language as unknown as mapboxgl.IControl)
  }

  const setCoordsAndAddress = async (coords: Coordinates) => {
    setFieldValue(name, coords, true)
    const addr = await reverse(coords)
    setFieldValue(addressFieldName as string, addr?.full ?? '', true)
  }

  const onMapClick = (e: MapLayerMouseEvent) => {
    if (!e?.lngLat) return
    setCoordsAndAddress({ lat: e.lngLat.lat, lng: e.lngLat.lng })
  }

  return (
    <div className={className}>
      <MapGL
        ref={mapRef}
        attributionControl
        initialViewState={viewport}
        mapStyle={mapStyle}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={handleMapLoad}
        onMove={(ev) => setViewport(ev.viewState as any)}
        onClick={onMapClick}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          trackUserLocation
          showUserHeading
          position="top-right"
          showAccuracyCircle={false}
          positionOptions={{ enableHighAccuracy: true }}
          onGeolocate={(pos) => {
            const coords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            }
            setCoordsAndAddress(coords)
          }}
        />
        <ScaleControl position="bottom-left" />

        <Marker
          draggable
          longitude={position.lng}
          latitude={position.lat}
          anchor="bottom"
          onDragEnd={(ev) => {
            const next = { lat: ev.lngLat.lat, lng: ev.lngLat.lng }
            setCoordsAndAddress(next)
          }}
        >
          <div className="drop-shadow">
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="#1d4ed8"
              stroke="white"
              strokeWidth="1.5"
            >
              <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
            </svg>
          </div>
        </Marker>
      </MapGL>

      {/* Previsualización */}
      <div className="mt-2 text-sm text-gray-700">
        <span className="font-medium">Coordenadas:</span>{' '}
        {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
      </div>
    </div>
  )
}
