import { FormItem, Input } from '@/components/ui'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { Field, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { MdPublic } from 'react-icons/md'
import { FormModel } from './PropertyForm'

const StepFormThree = ({ values, touched, errors, setFieldValue }) => {
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
    if (values?.step3?.countryId && countries) {
      const country = countries?.find(
        (c) => c.value === values?.step3?.countryId
      )
      setSelectedCountry(country || null)
    }
  }, [values?.step3?.countryId, countries])

  useEffect(() => {
    if (values?.step3?.stateId && states) {
      const state = states?.find((s) => s.value === values?.step3?.stateId)
      setSelectedState(state || null)
    }
  }, [values?.step3?.stateId, states])

  useEffect(() => {
    if (values?.step3?.cityId && selectedState) {
      const city = selectedState?.cities?.find(
        (c) => c.id === values?.step3?.cityId
      )
      setSelectedCity(city ? { value: city.id, label: city.name } : null)
    }
  }, [values?.step3?.cityId, selectedState])

  return (
    <div className="relative h-auto w-100">
      <div className="relative grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3 mt-1">
        <FormItem
          asterisk
          label="País"
          invalid={
            (errors?.step3?.countryId && errors?.step3?.countryId) as boolean
          }
          errorMessage={errors?.step3?.countryId}
        >
          <Field name="step3.countryId">
            {({ field, form }: FieldProps) => (
              <Select
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
                  form.setFieldValue(field.name, selectedOption?.value)

                  setFieldValue('step3.countryId', selectedOption?.value)
                  setSelectedCountry(selectedOption)
                  setSelectedState(null)
                  setSelectedCity(null)
                  setFieldValue('step3.stateId', '')
                  setFieldValue('step3.cityId', '')
                }}
              />
            )}
          </Field>
        </FormItem>
        <FormItem
          asterisk
          label="Región/Estado"
          invalid={
            (errors?.step3?.stateId && errors?.step3?.stateId) as boolean
          }
          errorMessage={errors?.step3?.stateId}
        >
          <Field name="step3.stateId">
            {({ field, form }: FieldProps) => (
              <Select
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
                  form.setFieldValue(field.name, selectedOption?.value)
                  setFieldValue('step3.stateId', selectedOption.value)
                  setSelectedState(selectedOption)
                  setSelectedCity(null)
                  setFieldValue('step3.cityId', '')
                }}
              />
            )}
          </Field>
        </FormItem>

        <FormItem
          asterisk
          label="Comuna o Ciudad"
          invalid={(errors?.step3?.cityId && errors?.step3?.cityId) as boolean}
          errorMessage={errors?.step3?.cityId}
        >
          <Field name="step3.cityId">
            {({ field, form }: FieldProps) => (
              <Select
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
                  form.setFieldValue(field.name, selectedOption?.value)
                  setFieldValue('step3.cityId', selectedOption?.value)
                  setSelectedCity(selectedOption)
                }}
              />
            )}
          </Field>
        </FormItem>
      </div>

      <div className="pt-6">
        <FormItem
          asterisk
          label="Referencia de ubicación de la propiedad (pública para portales)."
          invalid={
            (errors?.step3?.addressPublic &&
              errors?.step3?.addressPublic) as boolean
          }
          errorMessage={errors?.step3?.addressPublic}
        >
          <Field name="step3.addressPublic">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2"
                  placeholder="Define una dirección únicamente referencial y no tan precisa de la propiedad..."
                  value={values?.step3?.addressPublic}
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
            <FormItem label="Dirección">
              <Field name="step3.address">
                {({ field, form }: FieldProps<FormModel>) => {
                  return (
                    <Input
                      field={field}
                      type="text"
                      size="md"
                      className="mb-2"
                      placeholder="Ej: Avenida Libertado Bernardo O'Higgins, calle Sargento Aldea, bloque 4"
                      value={values?.step3?.address}
                      onChange={(e) => {
                        form.setFieldValue(field.name, e.target.value)
                      }}
                    />
                  )
                }}
              </Field>
              <small className="italic text-sm">
                Esta dirección NO será publicada en el portal de propiedades.
              </small>
            </FormItem>
          </>
        ) : null}
      </div>

      {userAuthority === 2 ? (
        <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem label="Número">
            <Field name="step3.number">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Input
                    field={field}
                    type="text"
                    size="md"
                    className="mb-2"
                    placeholder="Ej: Casa 6 / Depto 20"
                    value={values?.step3?.number}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Letra">
            <Field name="step3.letter">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Input
                    field={field}
                    type="text"
                    size="md"
                    className="mb-2"
                    placeholder="Ej: Casa L, Oficina Y"
                    value={values?.step3?.letter}
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
            <Field name="step3.references">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Input
                    textArea
                    field={field}
                    size="md"
                    placeholder="Ej: Inmueble ubicado 2 minutos del condominio central de Santiago, a un costado del Supermercado Mayorita 10."
                    value={values?.step3?.references}
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
    </div>
  )
}

export default StepFormThree
