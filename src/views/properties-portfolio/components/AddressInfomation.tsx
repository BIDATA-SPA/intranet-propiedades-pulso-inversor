import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import type { FieldProps } from 'formik'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { LuMapPin } from 'react-icons/lu'
import { MdPublic } from 'react-icons/md'
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
  lat: Yup.string().nullable(),
  lng: Yup.string().nullable(),
})

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
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [statesOptions, setStatesOptions] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

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

  useEffect(() => {
    if (states) {
      setStatesOptions(states)
    }
  }, [states])

  useEffect(() => {
    if (data?.countryId && countries) {
      const country = countries?.find((c) => c.value === data?.countryId)
      setSelectedCountry(country || null)
    }
  }, [data.countryId, countries])

  useEffect(() => {
    if (data?.stateId && states) {
      const state = states?.find((s) => s.value === data?.stateId)
      setSelectedState(state || null)
    }
  }, [data.stateId, states])

  useEffect(() => {
    if (data?.cityId && selectedState) {
      const city = selectedState?.cities?.find((c) => c.id === data?.cityId)
      setSelectedCity(city ? { value: city.id, label: city.name } : null)
    }
  }, [data?.cityId, selectedState])

  const onNext = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    onNextChange?.(values, 'addressInformation', setSubmitting)
  }

  const onBack = () => {
    onBackChange?.()
  }

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
          setTimeout(() => {
            onNext(values, setSubmitting)
          }, 1000)
        }}
      >
        {({ values, touched, errors, isSubmitting }) => {
          return (
            <Form>
              <FormContainer>
                <MapVisibilityBadge
                  className="mb-3"
                  onCtaClick={() => {
                    // Opcional: hacer scroll hacia el mapa o enfocar el componente del mapa
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
                    invalid={errors.countryId && touched.countryId}
                    errorMessage={errors.countryId}
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
                          onChange={(selectedOption) => {
                            form.setFieldValue(
                              field.name,
                              selectedOption?.value
                            )

                            form.setFieldValue(
                              'countryId',
                              selectedOption?.value
                            )
                            setSelectedCountry(selectedOption)
                            setSelectedState(null)
                            setSelectedCity(null)
                            form.setFieldValue('stateId', '')
                            form.setFieldValue('cityId', '')
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                  <FormItem
                    asterisk
                    label="Región/Estado"
                    invalid={errors.stateId && touched.stateId}
                    errorMessage={errors.stateId}
                  >
                    <Field name="stateId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          placeholder="Seleccionar..."
                          isDisabled={!selectedCountry || isLoadingStates}
                          options={statesOptions}
                          value={selectedState}
                          noOptionsMessage={() => (
                            <span>
                              {isLoadingStates
                                ? 'Obteniendo regiones...'
                                : isErrorStates
                                ? 'Ha ocurrido un error al obtener las regiones.'
                                : 'Región no encontrada'}
                            </span>
                          )}
                          onChange={(selectedOption) => {
                            form.setFieldValue(
                              field.name,
                              selectedOption?.value
                            )
                            form.setFieldValue('stateId', selectedOption.value)
                            setSelectedState(selectedOption)
                            setSelectedCity(null)
                            form.setFieldValue('cityId', '')
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Comuna o Ciudad"
                    invalid={errors.cityId && touched.cityId}
                    errorMessage={errors.cityId}
                  >
                    <Field name="cityId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          placeholder="Seleccionar..."
                          isDisabled={!selectedState}
                          options={selectedState?.cities?.map((city) => ({
                            value: city.id,
                            label: city.name,
                          }))}
                          noOptionsMessage={() => (
                            <span>
                              {isLoadingStates
                                ? 'Obteniendo ciudades...'
                                : isErrorStates
                                ? 'Ha ocurrido un error al obtener las ciudades.'
                                : 'Ciudad o Comuna no encontrada'}
                            </span>
                          )}
                          value={selectedCity}
                          onChange={(selectedOption) => {
                            form.setFieldValue(
                              field.name,
                              selectedOption?.value
                            )
                            form.setFieldValue('cityId', selectedOption?.value)
                            setSelectedCity(selectedOption)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                </div>

                <>
                  <FormItem
                    asterisk
                    label="Referencia de ubicación de la propiedad (pública para portales)."
                    invalid={errors.addressPublic && touched.addressPublic}
                    errorMessage={errors.addressPublic}
                  >
                    <Field name="addressPublic">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Input
                            field={field}
                            type="text"
                            size="md"
                            className="mb-2"
                            placeholder="Define una dirección únicamente referencial y no tan precisa de la propiedad..."
                            value={values.addressPublic}
                            prefix={<MdPublic />}
                            onChange={(e) => {
                              form.setFieldValue(field.name, e.target.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                    <small className="italic text-sm">
                      Esta dirección será publicada en el portal de propiedades.
                    </small>
                  </FormItem>

                  {userAuthority === 2 ? (
                    <>
                      <FormItem label="Fija la ubicación de esta propiedad en el Mapa">
                        <div id="map-address-picker">
                          <MapAddressPicker
                            addressName="address"
                            latFieldName="lat"
                            lngFieldName="lng"
                          />
                        </div>

                        {values?.address && (
                          <p className="my-1.5 flex items-center justify-start">
                            <LuMapPin className="mr-1.5 text-red-500" />
                            {values?.address}.
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
                        invalid={errors.address && touched.address}
                        errorMessage={errors.address}
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
                        <small className="italic text-sm">
                          Esta dirección NO será publicada en el portal de
                          propiedades.
                        </small>
                      </FormItem>
                    </>
                  ) : null}
                </>

                {userAuthority === 2 ? (
                  <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
                    <FormItem label="Número">
                      <Field name="number">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              field={field}
                              type="text"
                              size="md"
                              className="mb-2"
                              placeholder="Ej: Casa 6 / Depto 20"
                              value={values.number}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                          )
                        }}
                      </Field>
                    </FormItem>

                    <FormItem label="Letra">
                      <Field name="letter">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              field={field}
                              type="text"
                              size="md"
                              className="mb-2"
                              placeholder="Ej: Casa L, Oficina Y"
                              value={values.letter}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                  </div>
                ) : null}

                {userAuthority === 2 ? (
                  <div className="w-full">
                    <FormItem label="Referencias">
                      <Field name="references">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              textArea
                              field={field}
                              size="md"
                              placeholder="Ej: Inmueble ubicado 2 minutos del condominio central de Santiago, a un costado del Supermercado Mayorita 10."
                              value={values.references}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                  </div>
                ) : null}

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
