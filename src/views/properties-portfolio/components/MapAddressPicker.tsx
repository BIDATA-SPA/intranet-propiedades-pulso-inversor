// components/MapAddressPicker.tsx
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

type Props<FormValues extends object = any> = {
  /** Opcional: path a objeto { lat, lng } (si en el futuro decides usarlo) */
  coordinatesName?: string
  /** Campos planos en el form (shape actual) */
  latFieldName?: string
  lngFieldName?: string
  /** Campo donde escribir la dirección en ES (ej: "address") */
  addressName: string
  /** Centro/zoom por defecto cuando no hay valores (Santiago por defecto) */
  initialCenter?: Coordinates
  initialZoom?: number
  className?: string
  mapStyle?: string
  debug?: boolean
}

const DEFAULT_CENTER: Coordinates = { lat: -33.45, lng: -70.6667 }

const toNumOrNull = (v: unknown): number | null => {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const isValidCoord = (c?: Coordinates | null): c is Coordinates =>
  !!c && Number.isFinite(c.lat) && Number.isFinite(c.lng)

export default function MapAddressPicker<FormValues extends object = any>({
  coordinatesName, // opcional
  latFieldName = 'lat',
  lngFieldName = 'lng',
  addressName,
  initialCenter = DEFAULT_CENTER,
  initialZoom = 12,
  className = 'h-80 w-full rounded-xl overflow-hidden border border-gray-200',
  mapStyle = 'mapbox://styles/mapbox/streets-v12',
  debug = false,
}: Props<FormValues>) {
  const mapRef = useRef<MapRef | null>(null)
  const { values, setFieldValue } = useFormikContext<FormValues>()
  const { reverse } = useMapboxReverseGeocode()

  // 1) Lee coords desde el form: objeto coordinatesName o campos planos. '' -> null -> fallback
  const readCoordsFromValues = (): Coordinates | null => {
    if (coordinatesName) {
      const obj = getIn(values as any, coordinatesName)
      const objLat = toNumOrNull(obj?.lat ?? obj?.latitude)
      const objLng = toNumOrNull(obj?.lng ?? obj?.longitude)
      if (objLat !== null && objLng !== null)
        return { lat: objLat, lng: objLng }
    }

    const flatLat = toNumOrNull(getIn(values as any, latFieldName))
    const flatLng = toNumOrNull(getIn(values as any, lngFieldName))
    if (flatLat !== null && flatLng !== null)
      return { lat: flatLat, lng: flatLng }

    return null
  }

  const coordsFromValues = useMemo(readCoordsFromValues, [
    values,
    coordinatesName,
    latFieldName,
    lngFieldName,
  ])

  // 2) Normaliza posición final (evita NaN/undefined)
  const normalizedInitial = isValidCoord(coordsFromValues)
    ? coordsFromValues
    : initialCenter ?? DEFAULT_CENTER

  const [markerPos, setMarkerPos] = useState<Coordinates>(normalizedInitial)

  // 3) Sincroniza marcador + recenter suave cuando cambian los values externamente
  useEffect(() => {
    const nextPos = isValidCoord(coordsFromValues)
      ? coordsFromValues
      : normalizedInitial
    setMarkerPos(nextPos)

    if (mapRef.current && isValidCoord(coordsFromValues)) {
      try {
        mapRef.current.getMap().flyTo({
          center: [nextPos.lng, nextPos.lat],
          zoom: 15,
          essential: true,
        })
      } catch {
        /* ignore */
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordsFromValues?.lat, coordsFromValues?.lng])

  // 4) Idioma ES en control de mapa
  const onLoad = () => {
    const m = mapRef.current?.getMap()
    if (!m) return
    const language = new MapboxLanguage({ defaultLanguage: 'es' })
    m.addControl(language as unknown as mapboxgl.IControl)
  }

  // 5) Setear en Formik + reverse geocoding
  const setCoordsInForm = async (next: Coordinates) => {
    setMarkerPos(next)

    // a) objeto coordinatesName (si lo usas)
    if (coordinatesName) {
      try {
        setFieldValue(coordinatesName, { lat: next.lat, lng: next.lng }, true)
      } catch {
        /* noop */
      }
    }

    // b) campos planos: preserva tipo actual (string/number)
    try {
      const prevLat = getIn(values as any, latFieldName)
      const prevLng = getIn(values as any, lngFieldName)

      if (
        prevLat !== undefined ||
        Object.prototype.hasOwnProperty.call(values as any, latFieldName)
      ) {
        setFieldValue(
          latFieldName as any,
          typeof prevLat === 'string' ? String(next.lat) : next.lat,
          true
        )
      }
      if (
        prevLng !== undefined ||
        Object.prototype.hasOwnProperty.call(values as any, lngFieldName)
      ) {
        setFieldValue(
          lngFieldName as any,
          typeof prevLng === 'string' ? String(next.lng) : next.lng,
          true
        )
      }
    } catch {
      /* noop */
    }

    // c) dirección localizada (ES)
    try {
      const addr = await reverse(next)
      setFieldValue(addressName as any, addr?.full ?? '', true)
      if (debug) return {}
    } catch (err) {
      if (debug) {
        return {}
      }
    }
  }

  // 6) Interacciones
  const onMapClick = (e: MapLayerMouseEvent) => {
    if (!e?.lngLat) return
    setCoordsInForm({ lat: e.lngLat.lat, lng: e.lngLat.lng })
  }

  return (
    <div className={className}>
      <MapGL
        ref={mapRef}
        mapStyle={mapStyle}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onLoad={onLoad}
        onClick={onMapClick}
        attributionControl
        // Mapa NO controlado: evita loops; usa initialViewState seguro
        initialViewState={{
          latitude: normalizedInitial.lat,
          longitude: normalizedInitial.lng,
          zoom: isValidCoord(coordsFromValues) ? 15 : initialZoom,
        }}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl
          trackUserLocation
          showUserHeading
          position="top-right"
          showAccuracyCircle={false}
          positionOptions={{ enableHighAccuracy: true }}
          onGeolocate={(pos) => {
            setCoordsInForm({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            })
          }}
        />
        <ScaleControl position="bottom-left" />

        <Marker
          draggable
          longitude={markerPos.lng}
          latitude={markerPos.lat}
          anchor="bottom"
          onDragEnd={(ev) => {
            setCoordsInForm({ lat: ev.lngLat.lat, lng: ev.lngLat.lng })
          }}
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
  )
}

// // components/MapAddressPicker.tsx
// import MapboxLanguage from '@mapbox/mapbox-gl-language'
// import { getIn, useFormikContext } from 'formik'
// import mapboxgl from 'mapbox-gl'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import MapGL, {
//   GeolocateControl,
//   MapLayerMouseEvent,
//   MapRef,
//   Marker,
//   NavigationControl,
//   ScaleControl,
// } from 'react-map-gl'
// import { useMapboxReverseGeocode } from '../hooks/useMapboxReverseGeocode'

// ;(mapboxgl as any).accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// type Coordinates = { lat: number; lng: number }

// type Props<FormValues extends object = any> = {
//   /** Opcional: path a objeto { lat, lng } en el form, ej: "coordinates" */
//   coordinatesName?: string
//   /** Nombres de campos planos en el form (Address.lat/lng) */
//   latFieldName?: string
//   lngFieldName?: string
//   /** Campo de texto donde escribir la dirección completa (ES), ej: "address" */
//   addressName: string
//   /** Centro/zoom por defecto cuando no hay valores (Santiago por defecto) */
//   initialCenter?: Coordinates
//   initialZoom?: number
//   className?: string
//   mapStyle?: string
//   debug?: boolean
// }

// const DEFAULT_CENTER: Coordinates = { lat: -33.45, lng: -70.6667 } // Santiago

// const toNumOrNull = (v: unknown): number | null => {
//   if (v === '' || v === null || v === undefined) return null
//   const n = Number(v)
//   return Number.isFinite(n) ? n : null
// }

// export default function MapAddressPicker<FormValues extends object = any>({
//   coordinatesName, // ej: "coordinates" (opcional)
//   latFieldName = 'lat', // planos del paso Address
//   lngFieldName = 'lng',
//   addressName, // ej: "address"
//   initialCenter = DEFAULT_CENTER,
//   initialZoom = 12,
//   className = 'h-80 w-full rounded-xl overflow-hidden border border-gray-200',
//   mapStyle = 'mapbox://styles/mapbox/streets-v12',
//   debug = false,
// }: Props<FormValues>) {
//   const mapRef = useRef<MapRef | null>(null)
//   const { values, setFieldValue } = useFormikContext<FormValues>()
//   const { reverse } = useMapboxReverseGeocode()

//   // 1) Lee coords desde el form: objeto coordinatesName o campos planos. '' -> null
//   const readCoordsFromValues = (): Coordinates | null => {
//     if (coordinatesName) {
//       const obj = getIn(values as any, coordinatesName)
//       const objLat = toNumOrNull(obj?.lat ?? obj?.latitude)
//       const objLng = toNumOrNull(obj?.lng ?? obj?.longitude)
//       if (objLat !== null && objLng !== null)
//         return { lat: objLat, lng: objLng }
//     }
//     const flatLat = toNumOrNull(getIn(values as any, latFieldName))
//     const flatLng = toNumOrNull(getIn(values as any, lngFieldName))
//     if (flatLat !== null && flatLng !== null)
//       return { lat: flatLat, lng: flatLng }
//     return null
//   }

//   const coordsFromValues = useMemo(readCoordsFromValues, [
//     values,
//     coordinatesName,
//     latFieldName,
//     lngFieldName,
//   ])
//   const position: Coordinates = coordsFromValues ?? initialCenter

//   // 2) Posición del marcador (UI). La mantenemos local y la sincronizamos cuando cambian los values externamente.
//   const [markerPos, setMarkerPos] = useState<Coordinates>(position)

//   useEffect(() => {
//     setMarkerPos(position)
//     // Recentrar suavemente cuando vienen coords válidas desde fuera (modo update)
//     if (mapRef.current && coordsFromValues) {
//       try {
//         mapRef.current.getMap().flyTo({
//           center: [position.lng, position.lat],
//           zoom: 15,
//           essential: true,
//         })
//       } catch {
//         /* ignore */
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [position.lat, position.lng, coordsFromValues])

//   // 3) Cargar etiquetas en español
//   const onLoad = () => {
//     const m = mapRef.current?.getMap()
//     if (!m) return
//     const language = new MapboxLanguage({ defaultLanguage: 'es' })
//     m.addControl(language as unknown as mapboxgl.IControl)
//   }

//   // 4) Setear en Formik + reverse geocoding
//   const setCoordsInForm = async (next: Coordinates) => {
//     setMarkerPos(next)

//     // a) objeto coordinatesName (si se usa)
//     if (coordinatesName) {
//       try {
//         setFieldValue(coordinatesName, { lat: next.lat, lng: next.lng }, true)
//       } catch {
//         /* noop */
//       }
//     }

//     // b) campos planos: preserva tipo actual (string/number)
//     try {
//       const prevLat = getIn(values as any, latFieldName)
//       const prevLng = getIn(values as any, lngFieldName)
//       if (
//         prevLat !== undefined ||
//         Object.prototype.hasOwnProperty.call(values as any, latFieldName)
//       ) {
//         setFieldValue(
//           latFieldName as any,
//           typeof prevLat === 'string' ? String(next.lat) : next.lat,
//           true
//         )
//       }
//       if (
//         prevLng !== undefined ||
//         Object.prototype.hasOwnProperty.call(values as any, lngFieldName)
//       ) {
//         setFieldValue(
//           lngFieldName as any,
//           typeof prevLng === 'string' ? String(next.lng) : next.lng,
//           true
//         )
//       }
//     } catch {
//       /* noop */
//     }

//     // c) dirección localizada (ES)
//     try {
//       const addr = await reverse(next)
//       setFieldValue(addressName as any, addr?.full ?? '', true)
//       if (debug)
//         console.log('[MapAddressPicker] coords:', next, 'address:', addr?.full)
//     } catch (err) {
//       if (debug) console.warn('[MapAddressPicker] reverse error', err)
//     }
//   }

//   // 5) Interacciones
//   const onMapClick = (e: MapLayerMouseEvent) => {
//     if (!e?.lngLat) return
//     setCoordsInForm({ lat: e.lngLat.lat, lng: e.lngLat.lng })
//   }

//   return (
//     <div className={className}>
//       <MapGL
//         ref={mapRef}
//         mapStyle={mapStyle}
//         mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
//         onLoad={onLoad}
//         onClick={onMapClick}
//         attributionControl
//         // ✅ No-controlado: solo initialViewState, nada de onMove -> setState
//         initialViewState={{
//           latitude: position.lat,
//           longitude: position.lng,
//           zoom: coordsFromValues ? 15 : initialZoom,
//         }}
//       >
//         <NavigationControl position="top-right" />
//         <GeolocateControl
//           trackUserLocation
//           showUserHeading
//           position="top-right"
//           showAccuracyCircle={false}
//           positionOptions={{ enableHighAccuracy: true }}
//           onGeolocate={(pos) => {
//             setCoordsInForm({
//               lat: pos.coords.latitude,
//               lng: pos.coords.longitude,
//             })
//           }}
//         />
//         <ScaleControl position="bottom-left" />

//         <Marker
//           draggable
//           longitude={markerPos.lng}
//           latitude={markerPos.lat}
//           anchor="bottom"
//           onDragEnd={(ev) => {
//             setCoordsInForm({ lat: ev.lngLat.lat, lng: ev.lngLat.lng })
//           }}
//         >
//           <div className="drop-shadow">
//             <svg
//               className="h-7 w-7"
//               viewBox="0 0 24 24"
//               fill="#1d4ed8"
//               stroke="white"
//               strokeWidth="1.5"
//             >
//               <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
//             </svg>
//           </div>
//         </Marker>
//       </MapGL>
//     </div>
//   )
// }

// ✅

// import MapboxLanguage from '@mapbox/mapbox-gl-language'
// import { getIn, useFormikContext } from 'formik'
// import mapboxgl from 'mapbox-gl'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import MapGL, {
//   GeolocateControl,
//   MapLayerMouseEvent,
//   MapRef,
//   Marker,
//   NavigationControl,
//   ScaleControl,
// } from 'react-map-gl'
// import { useMapboxReverseGeocode } from '../hooks/useMapboxReverseGeocode'

// ;(mapboxgl as any).accessToken = import.meta.env.VITE_MAPBOX_TOKEN

// type Coordinates = { lat: number; lng: number }

// type Props<FormValues extends object = any> = {
//   coordinatesName: string
//   addressName: string
//   initialCenter?: Coordinates
//   initialZoom?: number
//   className?: string
//   mapStyle?: string
//   debug?: boolean
// }

// const DEFAULT_CENTER: Coordinates = { lat: -33.45, lng: -70.6667 } // Santiago

// export default function MapAddressPicker<FormValues extends object = any>({
//   coordinatesName,
//   addressName,
//   initialCenter = DEFAULT_CENTER,
//   initialZoom = 12,
//   className = 'h-80 w-full rounded-xl overflow-hidden border border-gray-200',
//   mapStyle = 'mapbox://styles/mapbox/streets-v12',
//   debug = false,
// }: Props<FormValues>) {
//   const mapRef = useRef<MapRef | null>(null)
//   const { values, setFieldValue } = useFormikContext<FormValues>()
//   const { reverse } = useMapboxReverseGeocode()

//   console.log('values pciker map', values)

//   const coords = getIn(values as any, coordinatesName) as
//     | Coordinates
//     | undefined
//   const position = useMemo<Coordinates>(
//     () =>
//       coords?.lat && coords?.lng
//         ? coords
//         : {
//             lat: Number(values?.lat ?? initialCenter.lat),
//             lng: Number(values?.lng ?? initialCenter.lng),
//           },
//     [coords, values, initialCenter]
//   )

//   //    const position = useMemo<Coordinates>(
//   //     () => (coords?.lat && coords?.lng ? coords : initialCenter),
//   //     [coords, initialCenter]
//   //   )

//   const [viewState, setViewState] = useState({
//     latitude: Number(values?.lat ?? initialCenter.lat), // position.lat
//     longitude: Number(values?.lng ?? initialCenter.lng), // position.lng
//     zoom: coords ? 15 : initialZoom,
//   })

//   useEffect(() => {
//     setViewState((v) => ({
//       ...v,
//       latitude: Number(values?.lat ?? initialCenter.lat), // position.lat
//       longitude: Number(values?.lng ?? initialCenter.lng), // position.lng
//       zoom: coords ? 15 : initialZoom,
//     }))
//   }, [position.lat, position.lng, coords, initialZoom, values])

//   const onLoad = () => {
//     const m = mapRef.current?.getMap()
//     if (!m) return
//     // Etiquetas en español
//     const language = new MapboxLanguage({ defaultLanguage: 'es' })
//     m.addControl(language as unknown as mapboxgl.IControl)
//   }

//   const setCoordsAndAddress = async (next: Coordinates) => {
//     setFieldValue(coordinatesName, next, true)
//     const addr = await reverse(next)
//     setFieldValue(addressName, addr?.full ?? '', true)
//     if (debug)
//       console.log('[MapAddressPicker] coords:', next, 'address:', addr?.full)
//   }

//   const onClick = (e: MapLayerMouseEvent) => {
//     if (!e?.lngLat) return
//     setCoordsAndAddress({ lat: e.lngLat.lat, lng: e.lngLat.lng })
//   }

//   return (
//     <div className={className}>
//       <MapGL
//         ref={mapRef}
//         attributionControl
//         initialViewState={viewState}
//         mapStyle={mapStyle}
//         mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
//         onMove={(ev) => setViewState(ev.viewState as any)}
//         onLoad={onLoad}
//         onClick={onClick}
//       >
//         <NavigationControl position="top-right" />
//         <GeolocateControl
//           trackUserLocation
//           showUserHeading
//           position="top-right"
//           showAccuracyCircle={false}
//           positionOptions={{ enableHighAccuracy: true }}
//           onGeolocate={(pos) => {
//             const next = { lat: pos.coords.latitude, lng: pos.coords.longitude }
//             setCoordsAndAddress(next)
//           }}
//         />
//         <ScaleControl position="bottom-left" />

//         <Marker
//           draggable
//           longitude={position.lng}
//           latitude={position.lat}
//           anchor="bottom"
//           onDragEnd={(ev) => {
//             const next = { lat: ev.lngLat.lat, lng: ev.lngLat.lng }
//             setCoordsAndAddress(next)
//           }}
//         >
//           <div className="drop-shadow">
//             <svg
//               className="h-7 w-7"
//               viewBox="0 0 24 24"
//               fill="#1d4ed8"
//               stroke="white"
//               strokeWidth="1.5"
//             >
//               <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
//             </svg>
//           </div>
//         </Marker>
//       </MapGL>
//     </div>
//   )
// }
