import { FormItem, Input } from '@/components/ui'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} from '@/services/RtkQueryService'
import { CreatePropertyFormModel } from '@/services/properties/types/property.type'
import { useAppSelector } from '@/store'
import { Field, FieldProps } from 'formik'
import { useEffect, useState } from 'react'
import { MdPublic } from 'react-icons/md'

export type FormModel = CreatePropertyFormModel

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
    if (values?.address?.countryId && countries) {
      const country = countries?.find(
        (c) => c.value === values.address.countryId
      )
      setSelectedCountry(country || null)
    }
  }, [values?.address?.countryId, countries])

  useEffect(() => {
    if (values?.address?.stateId && states) {
      const state = states?.find((s) => s.value === values.address.stateId)
      setSelectedState(state || null)
    }
  }, [values?.address?.stateId, states])

  useEffect(() => {
    if (values?.address?.cityId && selectedState) {
      const city = selectedState?.cities?.find(
        (c) => c.id === values.address.cityId
      )
      setSelectedCity(city ? { value: city.id, label: city.name } : null)
    }
  }, [values?.address?.cityId, selectedState])

  return (
    <div className="relative h-auto w-100">
      <div className="relative grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3 mt-4">
        <FormItem asterisk label="País">
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
              setFieldValue('address.countryId', selectedOption.value)
              setSelectedCountry(selectedOption)
              setSelectedState(null)
              setSelectedCity(null)
              setFieldValue('address.stateId', '')
              setFieldValue('address.cityId', '')
            }}
          />
        </FormItem>
        <FormItem asterisk label="Región/Estado">
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
              setFieldValue('address.stateId', selectedOption.value)
              setSelectedState(selectedOption)
              setSelectedCity(null)
              setFieldValue('address.cityId', '')
            }}
          />
        </FormItem>
        <FormItem asterisk label="Comuna o Ciudad">
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
              setFieldValue('address.cityId', selectedOption?.value)
              setSelectedCity(selectedOption)
            }}
          />
        </FormItem>
      </div>

      <FormItem
        asterisk
        label="Referencia de ubicación de la propiedad (pública para portales)."
        invalid={
          (errors?.address?.addressPublic &&
            errors?.address?.addressPublic) as boolean
        }
        errorMessage={errors?.address?.addressPublic}
      >
        <Field name="address.addressPublic">
          {({ field, form }: FieldProps<FormModel>) => {
            return (
              <Input
                field={field}
                type="text"
                size="md"
                className="mb-2"
                placeholder="Define una dirección únicamente referencial y no tan precisa de la propiedad..."
                value={values?.address?.addressPublic}
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
        <FormItem label="Dirección">
          <Field name="address.address">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: Avenida Libertado Bernardo O'Higgins, calle Sargento Aldea, bloque 4"
                  value={values?.address?.address}
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
      ) : null}

      {userAuthority === 2 ? (
        <>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3 mt-4">
            <FormItem
              label="Número"
              invalid={errors.address?.number && touched.address?.number}
              errorMessage={errors.address?.number}
            >
              <Field name="address.number">
                {({ field, form }: FieldProps<FormModel>) => {
                  return (
                    <Input
                      field={field}
                      type="text"
                      size="md"
                      className="mb-2"
                      placeholder="Ingresar un número"
                      value={values?.address?.number}
                      onChange={(e) => {
                        form.setFieldValue(field.name, e.target.value)
                      }}
                    />
                  )
                }}
              </Field>
            </FormItem>

            <FormItem
              label="Letra"
              invalid={errors.address?.letter && touched.address?.letter}
              errorMessage={errors.address?.letter}
            >
              <Field name="address.letter">
                {({ field, form }: FieldProps<FormModel>) => {
                  return (
                    <Input
                      field={field}
                      type="text"
                      size="md"
                      className="mb-2"
                      placeholder="Ingresar un letra"
                      value={values?.address?.letter}
                      onChange={(e) => {
                        form.setFieldValue(field.name, e.target.value)
                      }}
                    />
                  )
                }}
              </Field>
            </FormItem>
          </div>
          <div className="w-full">
            <FormItem
              label="Referencias"
              invalid={
                errors.address?.references && touched.address?.references
              }
              errorMessage={errors.address?.references}
            >
              <Field name="address.references">
                {({ field, form }: FieldProps<FormModel>) => {
                  return (
                    <Input
                      textArea
                      field={field}
                      type="text"
                      size="md"
                      className="mb-2"
                      placeholder="Ej: Inmueble ubicado 2 minutos del condominio central de Santiago, a un costado del Supermercado Mayorita 10."
                      value={values?.address?.references}
                      onChange={(e) => {
                        form.setFieldValue(field.name, e.target.value)
                      }}
                    />
                  )
                }}
              </Field>
            </FormItem>
          </div>
        </>
      ) : null}
    </div>
  )
}

export default StepFormThree
