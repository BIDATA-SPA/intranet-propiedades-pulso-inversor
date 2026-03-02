import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} from '@/services/RtkQueryService'
import {
  Field,
  FieldProps,
  FormikErrors,
  FormikTouched,
  FormikValues,
} from 'formik'
import { useEffect, useState } from 'react'
import { FormFieldsName } from './BasicInfoFields'
import { FormModel } from './CustomerForm'

type BasicInformationFields = {
  touched?: FormikTouched<FormFieldsName>
  errors?: FormikErrors<FormFieldsName>
  values?: FormikValues
  setFieldValue?: any
}

const AddressFields = (props: BasicInformationFields) => {
  const { values, touched, errors, setFieldValue } = props
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
    <>
      <div className="border-b mb-4 pb-2 dark:border-b-gray-700">
        <h5>Ubicación</h5>
        <p>
          Sección para ingresar información básica del perfil de residencia del
          cliente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormItem
          asterisk
          label="País"
          invalid={
            (errors?.address?.countryId &&
              touched?.address?.countryId) as boolean
          }
          errorMessage={errors?.address?.countryId}
        >
          <Field name="address.countryId">
            {({ field, form }: FieldProps) => (
              <Select
                placeholder="Seleccionar..."
                field={field}
                form={form}
                options={countries ?? []}
                value={countries?.filter(
                  (category) => category.value === values?.address?.countryId
                )}
                noOptionsMessage={() => (
                  <span>
                    {isLoadingCountries
                      ? 'Obteniendo países...'
                      : isErrorCountries
                      ? 'Ha ocurrido un error al obtener los países.'
                      : 'País no encontrado'}
                  </span>
                )}
                onChange={(option) => {
                  setFieldValue('address.countryId', option.value)
                  setSelectedCountry(option)
                  setSelectedState(null)
                  setSelectedCity(null)
                  setFieldValue('address.stateId', '')
                  setFieldValue('address.cityId', '')
                }}
              />
            )}
          </Field>
        </FormItem>

        <FormItem
          asterisk
          label="Región/Estado"
          invalid={
            (errors?.address?.stateId && touched?.address?.stateId) as boolean
          }
          errorMessage={errors?.address?.stateId}
        >
          <Field name="address.stateId">
            {({ field, form }: FieldProps) => (
              <Select
                placeholder="Seleccionar..."
                field={field}
                form={form}
                isDisabled={!selectedCountry || isLoadingStates}
                options={statesOptions ?? []}
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
                onChange={(option) => {
                  setFieldValue('address.stateId', option.value)
                  setSelectedState(option)
                  setSelectedCity(null)
                  setFieldValue('address.cityId', '')
                }}
              />
            )}
          </Field>
        </FormItem>

        <FormItem
          asterisk
          label="Ciudad"
          invalid={
            (errors?.address?.cityId && touched?.address?.cityId) as boolean
          }
          errorMessage={errors?.address?.cityId}
        >
          <Field name="address.cityId">
            {({ field, form }: FieldProps) => (
              <Select
                placeholder="Seleccionar..."
                field={field}
                form={form}
                isDisabled={!selectedState}
                noOptionsMessage={() => (
                  <span>
                    {isLoadingStates
                      ? 'Obteniendo ciudades...'
                      : isErrorStates
                      ? 'Ha ocurrido un error al obtener las ciudades.'
                      : 'Ciudad no encontrada'}
                  </span>
                )}
                options={selectedState?.cities?.map((city) => ({
                  value: city.id,
                  label: city.name,
                }))}
                value={selectedCity}
                onChange={(option) => {
                  setFieldValue('address.cityId', option?.value)
                  setSelectedCity(option)
                }}
              />
            )}
          </Field>
        </FormItem>

        <FormItem
          label="Calle/Avenida"
          invalid={errors.address?.street && touched.address?.street}
          errorMessage={errors.address?.street}
        >
          <Field name="address.street">
            {({ field, form }: FieldProps<FormModel>) => (
              <Input
                type="text"
                field={field}
                size="md"
                placeholder="Ingresar Dirección"
                value={values.address?.street}
                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
              />
            )}
          </Field>
        </FormItem>
      </div>
    </>
  )
}

export default AddressFields
