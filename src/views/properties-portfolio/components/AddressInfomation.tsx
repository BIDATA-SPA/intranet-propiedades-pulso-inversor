/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { useToast } from '@/views/my-properties/hooks/use-toast'
import type { FieldProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { LuLoader, LuMapPin } from 'react-icons/lu'
import { MdErrorOutline, MdPublic } from 'react-icons/md'
import * as Yup from 'yup'
import type { Address } from '../store'
import CoordinatesBadge from './CoordinatesBadge'
import MapAddressPicker from './MapAddressPicker'
import MapVisibilityBadge from './MapVisibilityBadge'

type FormModel = Address

type AddressInfomationProps = {
  data: Address
  onNextChange?: (
    values: FormModel,
    formName: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => void
  onBackChange?: () => void
  currentStepStatus?: string
}

type SelectOption = { value: number; label: string }
type StateOption = {
  value: number
  label: string
  cities?: { id: number; name: string }[]
}

const validationSchema = Yup.object().shape({
  countryId: Yup.number()
    .typeError('Este campo es obligatorio.')
    .required('Este campo es obligatorio.'),
  stateId: Yup.number()
    .typeError('Este campo es obligatorio.')
    .required('Este campo es obligatorio.'),
  cityId: Yup.number()
    .typeError('Este campo es obligatorio.')
    .required('Este campo es obligatorio.'),
  letter: Yup.string().nullable(),
  number: Yup.string().nullable(),
  references: Yup.string().nullable(),
  address: Yup.string().trim().required('Este campo es obligatorio.'),
  addressPublic: Yup.string().trim().required('Este campo es obligatorio.'),
  lat: Yup.number().nullable(),
  lng: Yup.number().nullable(),
})

// ------------------------
// Helpers (Nominatim)
// ------------------------
type GeoBox = { latMin: number; latMax: number; lngMin: number; lngMax: number }

const normalizeBBox = (bbox: [string, string, string, string]): GeoBox => {
  // Nominatim: [south, north, west, east]
  const south = Number(bbox[0])
  const north = Number(bbox[1])
  const west = Number(bbox[2])
  const east = Number(bbox[3])

  return {
    latMin: Math.min(south, north),
    latMax: Math.max(south, north),
    lngMin: Math.min(west, east),
    lngMax: Math.max(west, east),
  }
}

const shrinkBox = (box: GeoBox, ratio = 0.12): GeoBox => {
  const latPad = (box.latMax - box.latMin) * ratio
  const lngPad = (box.lngMax - box.lngMin) * ratio

  return {
    latMin: box.latMin + latPad,
    latMax: box.latMax - latPad,
    lngMin: box.lngMin + lngPad,
    lngMax: box.lngMax - lngPad,
  }
}

const randomPointInBox = (box: GeoBox) => {
  const lat = box.latMin + Math.random() * (box.latMax - box.latMin)
  const lng = box.lngMin + Math.random() * (box.lngMax - box.lngMin)
  return { lat, lng }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const WATER_TYPES = new Set([
  'water',
  'bay',
  'sea',
  'ocean',
  'river',
  'riverbank',
  'reservoir',
  'wetland',
  'beach',
  'coastline',
  'strait',
  'canal',
  'waterway',
])

const looksUrbanEnough = (addr: any) => {
  if (!addr) return false
  return Boolean(
    addr.road ||
      addr.pedestrian ||
      addr.footway ||
      addr.amenity ||
      addr.neighbourhood ||
      addr.suburb ||
      addr.quarter ||
      addr.city ||
      addr.town ||
      addr.village ||
      addr.square
  )
}

const reverseValidateLandPoint = async (
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<boolean> => {
  const url =
    `https://nominatim.openstreetmap.org/reverse?` +
    `format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(
      lng
    )}` +
    `&zoom=18&addressdetails=1`

  const res = await fetch(url, { signal })
  if (!res.ok) return false

  const json = await res.json()

  const type = String(json?.type ?? '').toLowerCase()
  const category = String(json?.category ?? '').toLowerCase()

  if (
    WATER_TYPES.has(type) ||
    (category === 'natural' && WATER_TYPES.has(type))
  ) {
    return false
  }

  if (!looksUrbanEnough(json?.address)) return false

  return true
}

type NominatimReverseResult = {
  display_name?: string
  address?: Record<string, any>
  category?: string
  type?: string
}

const reverseGeocode = async (
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<NominatimReverseResult | null> => {
  const url =
    `https://nominatim.openstreetmap.org/reverse?` +
    `format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(
      lng
    )}` +
    `&zoom=18&addressdetails=1`

  const res = await fetch(url, { signal })
  if (!res.ok) return null
  return (await res.json()) as NominatimReverseResult
}

const buildReferenceSuggestion = (addr?: Record<string, any>) => {
  if (!addr) return ''
  const near =
    addr.amenity ||
    addr.building ||
    addr.shop ||
    addr.suburb ||
    addr.neighbourhood ||
    addr.quarter ||
    addr.road ||
    addr.pedestrian ||
    addr.square ||
    addr.city ||
    addr.town ||
    addr.village

  if (!near) return ''

  const prefix =
    addr.railway || String(near).toLowerCase().includes('estación')
      ? 'Cerca de la estación'
      : 'Cerca de'

  return `${prefix} ${near}.`
}

const geocodeAndPlaceRealisticRandomPin = async (
  query: string,
  setFieldValue: (field: string, value: any) => void,
  abortRef: React.MutableRefObject<AbortController | null>
) => {
  if (!query) return

  try {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const searchUrl =
      `https://nominatim.openstreetmap.org/search?` +
      `format=json&limit=1&addressdetails=0&polygon_geojson=0&` +
      `q=${encodeURIComponent(query)}`

    const res = await fetch(searchUrl, { signal: controller.signal })
    if (!res.ok) return

    const json = (await res.json()) as any[]
    if (!json?.length) return

    const item = json[0]
    const bboxRaw = item?.boundingbox as
      | [string, string, string, string]
      | undefined
    const latCenter = Number(item?.lat)
    const lngCenter = Number(item?.lon)

    const fallbackCenter = {
      lat: Number.isFinite(latCenter) ? latCenter : -33.45,
      lng: Number.isFinite(lngCenter) ? lngCenter : -70.6667,
    }

    if (!bboxRaw || bboxRaw.length !== 4) {
      for (let i = 0; i < 8; i++) {
        const jitter = 0.01 + Math.random() * 0.02
        const lat = fallbackCenter.lat + (Math.random() - 0.5) * jitter
        const lng = fallbackCenter.lng + (Math.random() - 0.5) * jitter

        const ok = await reverseValidateLandPoint(lat, lng, controller.signal)
        if (ok) {
          setFieldValue('lat', lat)
          setFieldValue('lng', lng)
          return
        }

        await sleep(250)
      }

      setFieldValue('lat', fallbackCenter.lat)
      setFieldValue('lng', fallbackCenter.lng)
      return
    }

    const bbox = shrinkBox(normalizeBBox(bboxRaw), 0.12)

    const MAX_TRIES = 14
    for (let i = 0; i < MAX_TRIES; i++) {
      const { lat, lng } = randomPointInBox(bbox)
      const ok = await reverseValidateLandPoint(lat, lng, controller.signal)
      if (ok) {
        setFieldValue('lat', lat)
        setFieldValue('lng', lng)
        return
      }
      await sleep(250)
    }

    for (let i = 0; i < 10; i++) {
      const jitter = 0.008 + Math.random() * 0.02
      const lat = fallbackCenter.lat + (Math.random() - 0.5) * jitter
      const lng = fallbackCenter.lng + (Math.random() - 0.5) * jitter

      const ok = await reverseValidateLandPoint(lat, lng, controller.signal)
      if (ok) {
        setFieldValue('lat', lat)
        setFieldValue('lng', lng)
        return
      }

      await sleep(250)
    }

    setFieldValue('lat', fallbackCenter.lat)
    setFieldValue('lng', fallbackCenter.lng)
  } catch (e: any) {
    if (e?.name === 'AbortError') return
    throw e
  }
}

// ------------------------
// Component
// ------------------------
const AddressInfomation = ({
  data = {
    countryId: null,
    stateId: null,
    cityId: null,
    letter: '',
    number: '',
    references: '',
    address: '',
    addressPublic: '',
    lat: -33.45,
    lng: -70.6667,
  },
  onNextChange,
  onBackChange,
  currentStepStatus,
}: AddressInfomationProps) => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(
    null
  )
  const [selectedState, setSelectedState] = useState<StateOption | null>(null)
  const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null)
  const [statesOptions, setStatesOptions] = useState<StateOption[]>([])

  // ✅ UX: alert/banner visible mientras geocodifica/reverse
  const [isSearchingLocation, setIsSearchingLocation] = useState(false)
  const [searchMessage, setSearchMessage] = useState<string | null>(null)

  const { openNotification } = useToast()

  // evita que la auto-geo reemplace un pin manual (cuando rol=2)
  const [hasManualPin, setHasManualPin] = useState(false)

  // abort geocode + reverse
  const abortGeocodeRef = useRef<AbortController | null>(null)
  const abortReverseRef = useRef<AbortController | null>(null)

  // debounce timer
  const debounceRef = useRef<number | null>(null)

  // para no spamear notificaciones
  const mapToastCooldownRef = useRef<number>(0)

  // control de notificaciones tipo "loading" para no repetirlas
  const isSearchToastOpenRef = useRef(false)

  const {
    data: countries,
    isLoading: isLoadingCountries,
    isError: isErrorCountries,
  } = useGetAllCountriesQuery({
    limit: 100,
    page: 1,
    transformToSelectOptions: true,
  })

  const {
    data: states,
    isLoading: isLoadingStates,
    isError: isErrorStates,
  } = useGetAllStatesQuery(
    {
      limit: 100,
      page: 1,
      countryId: selectedCountry?.value,
      transformToSelectOptions: true,
    },
    { skip: !selectedCountry }
  )

  // ------------------------
  // Notifications (Pulso)
  // ------------------------
  const notifySearchingOnce = (msg?: string) => {
    if (isSearchToastOpenRef.current) return
    isSearchToastOpenRef.current = true
    openNotification({
      title: 'Buscando ubicación',
      content: (
        <div className="flex items-center gap-2">
          <LuLoader className="animate-spin text-amber-500" />
          <span>{msg ?? 'Estamos buscando la ubicación en el mapa…'}</span>
        </div>
      ),
      duration: 4000,
    })
  }

  const notifySuccess = () => {
    isSearchToastOpenRef.current = false
    openNotification({
      title: 'Ubicación actualizada',
      content: <FaCheck className="text-green-500" />,
      duration: 2500,
    })
  }

  const notifyError = (msg?: string) => {
    isSearchToastOpenRef.current = false
    openNotification({
      title: 'No pudimos ubicar la dirección',
      content: (
        <div className="flex items-center gap-2 text-red-500">
          <MdErrorOutline />
          <span>
            {msg ?? 'Intenta ser más específico o revisa tu conexión.'}
          </span>
        </div>
      ),
      duration: 4000,
    })
  }

  useEffect(() => {
    if (states) setStatesOptions(states as any)
  }, [states])

  // hidratar selects desde data (modo edición)
  useEffect(() => {
    if (data?.countryId && countries) {
      const country = (countries as any[])?.find(
        (c) => c.value === data.countryId
      )
      setSelectedCountry(country || null)
    }
  }, [data.countryId, countries])

  useEffect(() => {
    if (data?.stateId && statesOptions?.length) {
      const st = statesOptions.find((s) => s.value === data.stateId) || null
      setSelectedState(st)
    }
  }, [data.stateId, statesOptions])

  useEffect(() => {
    if (data?.cityId && selectedState) {
      const city = selectedState?.cities?.find((c) => c.id === data.cityId)
      setSelectedCity(city ? { value: city.id, label: city.name } : null)
    }
  }, [data.cityId, selectedState])

  const locationQueryBase = useMemo(() => {
    const parts = [
      selectedCity?.label,
      selectedState?.label,
      selectedCountry?.label,
    ].filter(Boolean)
    return parts.join(', ')
  }, [selectedCountry?.label, selectedState?.label, selectedCity?.label])

  const onNext = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    onNextChange?.(values, 'addressInformation', setSubmitting)
  }

  const onBack = () => onBackChange?.()

  // autofill control para references (no pisar al usuario)
  const didAutofillReferencesRef = useRef(false)
  const lastAutoReferencesRef = useRef('')

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Ubicación</h3>
      </div>

      <Formik
        enableReinitialize
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          setTimeout(() => onNext(values, setSubmitting), 1000)
        }}
      >
        {({ values, touched, errors, isSubmitting, setFieldValue }) => {
          // ------------------------
          // 1) Selects/addressPublic -> Map (geocode con debounce)
          // ------------------------
          const canAutoGeocode =
            Boolean(selectedCountry?.label) &&
            Boolean(selectedState?.label) &&
            Boolean(selectedCity?.label)

          const fullQuery = useMemo(() => {
            const parts = [
              values.addressPublic?.trim(),
              locationQueryBase,
            ].filter(Boolean)
            return parts.join(', ')
          }, [values.addressPublic, locationQueryBase])

          useEffect(() => {
            if (!canAutoGeocode) return
            if (userAuthority === 2 && hasManualPin) return

            if (debounceRef.current) window.clearTimeout(debounceRef.current)

            debounceRef.current = window.setTimeout(async () => {
              setIsSearchingLocation(true)
              setSearchMessage('Buscando ubicación en el mapa…')
              notifySearchingOnce('Estamos buscando la ubicación en el mapa…')

              try {
                await geocodeAndPlaceRealisticRandomPin(
                  fullQuery || locationQueryBase,
                  setFieldValue,
                  abortGeocodeRef
                )
                notifySuccess()
              } catch {
                notifyError(
                  'No pudimos ubicar esa referencia. Prueba con más detalle.'
                )
              } finally {
                setIsSearchingLocation(false)
                setSearchMessage(null)
              }
            }, 550)

            return () => {
              if (debounceRef.current) window.clearTimeout(debounceRef.current)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [fullQuery, canAutoGeocode, userAuthority, hasManualPin])

          // ------------------------
          // 2) Map -> form (toast + reverse para sugerir referencia)
          // ------------------------
          const prevLatLngRef = useRef<{
            lat: number | null
            lng: number | null
          }>({
            lat: values.lat ?? null,
            lng: values.lng ?? null,
          })

          useEffect(() => {
            const prev = prevLatLngRef.current
            const lat = values.lat ?? null
            const lng = values.lng ?? null

            const changed = lat !== prev.lat || lng !== prev.lng
            if (!changed) return
            prevLatLngRef.current = { lat, lng }

            const now = Date.now()
            if (now - mapToastCooldownRef.current > 1200) {
              mapToastCooldownRef.current = now
              openNotification({
                title: 'Actualizando ubicación',
                content: (
                  <div className="flex items-center gap-2">
                    <LuLoader className="animate-spin text-amber-500" />
                    <span>Validando ubicación seleccionada…</span>
                  </div>
                ),
                duration: 4000,
              })
              isSearchToastOpenRef.current = true
            }

            if (!lat || !lng) return
            ;(async () => {
              setIsSearchingLocation(true)
              setSearchMessage('Validando ubicación seleccionada…')

              try {
                abortReverseRef.current?.abort()
                const controller = new AbortController()
                abortReverseRef.current = controller

                const rev = await reverseGeocode(lat, lng, controller.signal)
                const suggestion = buildReferenceSuggestion(rev?.address)

                const current = String(values.references ?? '').trim()
                const lastAuto = lastAutoReferencesRef.current

                const canAutofill =
                  !current ||
                  (didAutofillReferencesRef.current && current === lastAuto)

                if (suggestion && canAutofill) {
                  didAutofillReferencesRef.current = true
                  lastAutoReferencesRef.current = suggestion
                  setFieldValue('references', suggestion)
                }

                notifySuccess()
              } catch (e: any) {
                if (e?.name === 'AbortError') return
                notifyError(
                  'No pudimos validar la ubicación. Reintenta o revisa tu conexión.'
                )
              } finally {
                setIsSearchingLocation(false)
                setSearchMessage(null)
              }
            })()
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [values.lat, values.lng])

          return (
            <Form>
              <FormContainer>
                <MapVisibilityBadge
                  className="mb-3"
                  onCtaClick={() => {
                    document
                      .getElementById('map-address-picker')
                      ?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      })
                  }}
                />

                <div className="relative grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3 mt-1">
                  <FormItem
                    asterisk
                    label="País"
                    invalid={Boolean(errors.countryId && touched.countryId)}
                    errorMessage={errors.countryId as any}
                  >
                    <Field name="countryId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          placeholder="Seleccionar..."
                          isDisabled={isLoadingCountries}
                          options={countries as any}
                          value={selectedCountry}
                          noOptionsMessage={() => (
                            <span>
                              {isLoadingCountries
                                ? 'Obteniendo países...'
                                : isErrorCountries
                                ? 'Ha ocurrido un error al obtener los países.'
                                : 'País no encontrado'}
                            </span>
                          )}
                          onChange={(opt: SelectOption | null) => {
                            form.setFieldValue(field.name, opt?.value ?? null)

                            setSelectedCountry(opt)
                            setSelectedState(null)
                            setSelectedCity(null)
                            setStatesOptions([])

                            setHasManualPin(false)

                            form.setFieldValue('stateId', null)
                            form.setFieldValue('cityId', null)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Región/Estado"
                    invalid={Boolean(errors.stateId && touched.stateId)}
                    errorMessage={errors.stateId as any}
                  >
                    <Field name="stateId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          placeholder="Seleccionar..."
                          isDisabled={!selectedCountry || isLoadingStates}
                          options={statesOptions as any}
                          value={selectedState as any}
                          noOptionsMessage={() => (
                            <span>
                              {isLoadingStates
                                ? 'Obteniendo regiones...'
                                : isErrorStates
                                ? 'Ha ocurrido un error al obtener las regiones.'
                                : 'Región no encontrada'}
                            </span>
                          )}
                          onChange={(opt: StateOption | null) => {
                            form.setFieldValue(field.name, opt?.value ?? null)

                            setSelectedState(opt)
                            setSelectedCity(null)

                            setHasManualPin(false)

                            form.setFieldValue('cityId', null)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Comuna o Ciudad"
                    invalid={Boolean(errors.cityId && touched.cityId)}
                    errorMessage={errors.cityId as any}
                  >
                    <Field name="cityId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          placeholder="Seleccionar..."
                          isDisabled={!selectedState}
                          options={
                            selectedState?.cities?.map((c) => ({
                              value: c.id,
                              label: c.name,
                            })) ?? []
                          }
                          value={selectedCity}
                          noOptionsMessage={() => (
                            <span>
                              {isLoadingStates
                                ? 'Obteniendo ciudades...'
                                : isErrorStates
                                ? 'Ha ocurrido un error al obtener las ciudades.'
                                : 'Ciudad o Comuna no encontrada'}
                            </span>
                          )}
                          onChange={(opt: SelectOption | null) => {
                            form.setFieldValue(field.name, opt?.value ?? null)
                            setSelectedCity(opt)
                            setHasManualPin(false)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                </div>

                <FormItem
                  asterisk
                  label="Referencia o Cercanía de ubicación de la propiedad (pública para portales)."
                  invalid={Boolean(
                    errors.addressPublic && touched.addressPublic
                  )}
                  errorMessage={errors.addressPublic as any}
                >
                  <Field name="addressPublic">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Input
                        field={field}
                        type="text"
                        size="md"
                        className="mb-2"
                        placeholder="Ej: Los Militares, Villa APOLO, Barrio la Capitanía"
                        value={values.addressPublic}
                        prefix={<MdPublic />}
                        onChange={(e) => {
                          setHasManualPin(false)
                          form.setFieldValue(field.name, e.target.value)
                        }}
                      />
                    )}
                  </Field>
                  <div className="flex-col flex">
                    <small className="italic text-sm text-sky-500">
                      Indique un lugar en específico: Nombre de calle, lugar
                      céntrico, centro de eventos, etc.
                    </small>
                    <small className="italic text-sm">
                      Esta dirección será publicada en el portal de propiedades.
                    </small>
                  </div>
                </FormItem>

                {userAuthority === 2 ? (
                  <>
                    <FormItem label="Fija la ubicación de esta propiedad en el Mapa">
                      {/* ✅ Alert/banner visible mientras se busca o valida */}
                      {isSearchingLocation ? (
                        <div
                          role="alert"
                          className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900"
                        >
                          <div className="flex items-center gap-2">
                            <LuLoader className="animate-spin text-amber-500" />
                            <span>
                              {searchMessage ?? 'Buscando ubicación…'}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-medium text-amber-900/80">
                            Esto puede tardar unos segundos según tu conexión.
                          </p>
                        </div>
                      ) : null}

                      <div id="map-address-picker">
                        <MapAddressPicker
                          addressName="address"
                          latFieldName="lat"
                          lngFieldName="lng"
                          // si el componente lo soporta, perfecto. Si no, agrega estos props allá.
                          // @ts-expect-error
                          onInteractionStart={() => {
                            setIsSearchingLocation(true)
                            setSearchMessage(
                              'Actualizando ubicación en el mapa…'
                            )
                            notifySearchingOnce(
                              'Actualizando ubicación en el mapa…'
                            )
                          }}
                          // @ts-expect-error
                          onInteractionEnd={() => {
                            setIsSearchingLocation(false)
                            setSearchMessage(null)
                            notifySuccess()
                          }}
                          // ✅ al mover pin manualmente, bloqueamos auto-geo
                          // @ts-expect-error
                          onManualChange={() => {
                            setHasManualPin(true)
                            openNotification({
                              title: 'Ubicación ajustada manualmente',
                              content: (
                                <div className="flex items-center gap-2">
                                  <FaCheck className="text-green-500" />
                                  <span>El pin fue ajustado manualmente.</span>
                                </div>
                              ),
                              duration: 2200,
                            })
                          }}
                        />
                      </div>

                      {values?.address && (
                        <p className="my-1.5 flex items-center justify-start">
                          <LuMapPin className="mr-1.5 text-red-500" />
                          {values.address}.
                        </p>
                      )}

                      <CoordinatesBadge
                        lat={values.lat}
                        lng={values.lng}
                        className="mt-2"
                      />
                    </FormItem>

                    <FormItem
                      asterisk
                      label="Dirección"
                      invalid={Boolean(errors.address && touched.address)}
                      errorMessage={errors.address as any}
                    >
                      <Field name="address">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            field={field}
                            type="text"
                            size="md"
                            className="mb-2"
                            placeholder="Ej: Avenida Libertador Bernardo O'Higgins 1234, Santiago"
                            value={values.address}
                            onChange={(e) =>
                              form.setFieldValue(field.name, e.target.value)
                            }
                          />
                        )}
                      </Field>
                      <div className="flex flex-col">
                        <small className="italic text-sm text-sky-500">
                          Para completar este campo especifique con el{' '}
                          {`"${'Pin'}"`} dentro del Mapa.
                        </small>
                        <small className="italic text-sm">
                          Esta dirección NO será publicada en el portal de
                          propiedades.
                        </small>
                      </div>
                    </FormItem>
                  </>
                ) : null}

                {userAuthority === 2 ? (
                  <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
                    <FormItem label="Número">
                      <Field name="number">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            field={field}
                            type="text"
                            size="md"
                            className="mb-2"
                            placeholder="Ej: Casa 6 / Depto 20"
                            value={values.number}
                            onChange={(e) =>
                              form.setFieldValue(field.name, e.target.value)
                            }
                          />
                        )}
                      </Field>
                    </FormItem>

                    <FormItem label="Letra">
                      <Field name="letter">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            field={field}
                            type="text"
                            size="md"
                            className="mb-2"
                            placeholder="Ej: Casa L, Oficina Y"
                            value={values.letter}
                            onChange={(e) =>
                              form.setFieldValue(field.name, e.target.value)
                            }
                          />
                        )}
                      </Field>
                    </FormItem>
                  </div>
                ) : null}

                {/* ✅ */}
                {/* {userAuthority === 2 ? (
                  <div className="w-full">
                    <FormItem label="Referencias">
                      <Field name="references">
                        {({ field, form }: FieldProps<FormModel>) => (
                          <Input
                            textArea
                            field={field}
                            size="md"
                            placeholder="Ej: Frente a la estación y calle Padre Hurtado..."
                            value={values.references}
                            onChange={(e) => {
                              didAutofillReferencesRef.current = false
                              lastAutoReferencesRef.current = ''
                              form.setFieldValue(field.name, e.target.value)
                            }}
                          />
                        )}
                      </Field>
                      <small className="italic text-sm">
                        Tip: si mueves el pin, podemos sugerirte una referencia
                        automática.
                      </small>
                    </FormItem>
                  </div>
                ) : null} */}

                <div className="flex justify-start gap-2">
                  <Button type="button" onClick={onBack}>
                    Volver
                  </Button>
                  <Button loading={isSubmitting} variant="solid" type="submit">
                    {currentStepStatus === 'complete' ? 'Guardar' : 'Siguiente'}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default AddressInfomation
