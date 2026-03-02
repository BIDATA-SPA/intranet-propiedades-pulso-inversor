import MapboxLanguage from '@mapbox/mapbox-gl-language'
import mapboxgl from 'mapbox-gl'
import { useEffect, useMemo, useRef } from 'react'
import { LuMapPin } from 'react-icons/lu'
import MapGL, {
  MapRef,
  Marker,
  NavigationControl,
  ScaleControl,
} from 'react-map-gl'
import type { Property } from '../../types'
import Section from '../ui/Section'

;(mapboxgl as any).accessToken = import.meta.env.VITE_MAPBOX_TOKEN

type Coordinates = { lat: number; lng: number }
const SANTIAGO: Coordinates = { lat: -33.45, lng: -70.6667 }

const toNumOrNull = (v: unknown): number | null => {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const LocationInMapSection = ({ property }: { property: Property }) => {
  const mapRef = useRef<MapRef | null>(null)

  const addressLine = useMemo(() => {
    const L = property.location
    if (!L) return 'Ubicación no disponible'
    const parts = [
      L.address,
      L.neighborhood,
      L.commune,
      L.city,
      L.region,
    ].filter(Boolean)
    return parts.length ? parts.join(', ') : 'Ubicación no disponible'
  }, [property.location])

  // Normaliza coordenadas desde property (soporta string o number)
  const coords: Coordinates = useMemo(() => {
    const lat = toNumOrNull(property?.location?.lat)
    const lng = toNumOrNull(property?.location?.lng)
    return lat !== null && lng !== null ? { lat, lng } : SANTIAGO
  }, [property?.location?.lat, property?.location?.lng])

  // Pone etiquetas del mapa en español y hace flyTo si cambia coords
  useEffect(() => {
    const m = mapRef.current?.getMap()
    if (!m) return
    // idioma ES (una sola vez)
    if (!(m as any).__esControlAdded) {
      const language = new MapboxLanguage({ defaultLanguage: 'es' })
      m.addControl(language as unknown as mapboxgl.IControl)
      ;(m as any).__esControlAdded = true
    }
    // recenter suave cuando cambian coords
    m.flyTo({ center: [coords.lng, coords.lat], zoom: 15, essential: true })
  }, [coords.lat, coords.lng])

  return (
    <Section title="Ubicación">
      <div className="flex flex-col gap-3 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <LuMapPin className="text-xl text-red-500" />
          <span>{addressLine}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            Latitud: {property.location?.lat ?? '—'}
          </span>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            Longitud: {property.location?.lng ?? '—'}
          </span>
        </div>

        {/* Mapa */}
        <div className="h-80 w-full rounded-xl overflow-hidden border border-gray-200">
          <MapGL
            ref={mapRef}
            mapStyle="mapbox://styles/mapbox/streets-v12"
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            attributionControl
            // Mapa no controlado: solo initialViewState
            initialViewState={{
              latitude: coords.lat,
              longitude: coords.lng,
              zoom: 15,
            }}
          >
            <NavigationControl position="top-right" />
            <ScaleControl position="bottom-left" />

            <Marker
              longitude={coords.lng}
              latitude={coords.lat}
              anchor="bottom"
            >
              <div className="drop-shadow">
                <svg
                  className="h-7 w-7"
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
        </div>
      </div>
    </Section>
  )
}

export default LocationInMapSection
