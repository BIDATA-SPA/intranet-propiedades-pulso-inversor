import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} from '@/services/RtkQueryService'
import { CreateCustomerFormModel } from '@/services/customers/types/customer.type'
import { Field, FieldProps } from 'formik'
import { useEffect, useState } from 'react'

type FormModel = CreateCustomerFormModel

const AddressInfo = ({ values, errors, touched, setFieldValue }) => {
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
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-4">
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

        {/* <FormItem label="Región/Estado ">
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
        </FormItem> */}

        {/* <FormItem label="Ciudad">
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
                  : 'Ciudad no encontrada'}
              </span>
            )}
            value={selectedCity}
            onChange={(selectedOption) => {
              setFieldValue('address.cityId', selectedOption?.value)
              setSelectedCity(selectedOption)
            }}
          />
        </FormItem> */}

        <FormItem
          label="Dirección"
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

        {/* <FormItem
          asterisk
          label="País"
          invalid={errors.countryId && (touched.countryId as any)}
          errorMessage={errors.countryId as any}
        >
          <Field name="countryId">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  field={field}
                  options={countries}
                  placeholder="Seleccionar"
                  value={countries?.filter(
                    (option) => option.value === values.countryId
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem> */}

        {/* <FormItem label="Región">
          <Field name="state">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder="Ingresar una región"
                  value={values.state}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem> */}

        {/* <FormItem label="Ciudad o Comuna">
          <Field name="city">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder="Ingresar una ciudad o comuna"
                  value={values.city}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem> */}

        {/* <FormItem label="Dirección">
          <Field name="street">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder="Ingresar una dirección"
                  value={values.street}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem> */}
      </div>
    </>
  )
}

export default AddressInfo
