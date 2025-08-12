import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
  useGetPreferredAreasQuery,
} from '@/services/RtkQueryService'
import { Field, FieldProps, getIn } from 'formik'
import { useEffect, useState } from 'react'

interface City {
  id: number
  name: string
}

interface CountryOption {
  value: number
  label: string
}

interface StateOption {
  value: number
  label: string
  cities?: City[]
}

interface AddressFieldsProps {
  prefix: string
  values: any
  setFieldValue: (field: string, value: any) => void
  errors: any
}

const AddressFields: React.FC<AddressFieldsProps> = ({
  prefix,
  values,
  setFieldValue,
  errors,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(
    null
  )
  const [selectedState, setSelectedState] = useState<StateOption | null>(null)
  const [selectedCity, setSelectedCity] = useState<{
    value: number
    label: string
  } | null>(null)
  const [statesOptions, setStatesOptions] = useState<StateOption[]>([])
  const { data: preferredAreas } = useGetPreferredAreasQuery({})

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

  // Preselección visual automática cuando los datos estén listos
  useEffect(() => {
    const countryId = values?.[`${prefix}.countryId`]
    const stateId = values?.[`${prefix}.stateId`]
    const cityId = values?.[`${prefix}.cityId`]

    if (
      countries?.length &&
      statesOptions?.length &&
      countryId &&
      stateId &&
      cityId
    ) {
      const foundCountry = countries.find((c) => c.value === countryId)
      const foundState = statesOptions.find((s) => s.value === stateId)
      const foundCity = foundState?.cities?.find((c) => c.id === cityId)

      if (foundCountry) setSelectedCountry(foundCountry)
      if (foundState) setSelectedState(foundState)
      if (foundCity)
        setSelectedCity({ value: foundCity.id, label: foundCity.name })
    }
  }, [countries, statesOptions, values, prefix])

  return (
    <>
      {/* País */}
      <FormItem
        asterisk
        label="País"
        errorMessage={getIn(errors, `${prefix}.countryId`)}
        invalid={!!getIn(errors, `${prefix}.countryId`)}
      >
        <Field name={`${prefix}.countryId`}>
          {({ field, form }: FieldProps) => (
            <Select
              placeholder="Seleccionar..."
              field={field}
              form={form}
              options={countries || []}
              value={selectedCountry}
              noOptionsMessage={() =>
                isLoadingCountries
                  ? 'Cargando países...'
                  : isErrorCountries
                  ? 'Error al obtener países'
                  : 'No hay opciones'
              }
              onChange={(option: any) => {
                setSelectedCountry(option)
                setFieldValue(`${prefix}.countryId`, option.value)
                setFieldValue(`${prefix}.stateId`, '')
                setFieldValue(`${prefix}.cityId`, '')
                setSelectedState(null)
                setSelectedCity(null)
              }}
            />
          )}
        </Field>
      </FormItem>

      {/* Región */}
      <FormItem
        asterisk
        label="Región"
        errorMessage={getIn(errors, `${prefix}.stateId`)}
        invalid={!!getIn(errors, `${prefix}.stateId`)}
      >
        <Field name={`${prefix}.stateId`}>
          {({ field, form }: FieldProps) => (
            <Select
              placeholder="Seleccionar..."
              field={field}
              form={form}
              isDisabled={!selectedCountry}
              options={statesOptions}
              value={selectedState}
              noOptionsMessage={() =>
                isLoadingStates
                  ? 'Cargando regiones...'
                  : isErrorStates
                  ? 'Error al obtener regiones'
                  : 'No hay opciones'
              }
              onChange={(option: any) => {
                setSelectedState(option)
                setFieldValue(`${prefix}.stateId`, option.value)
                setFieldValue(`${prefix}.cityId`, '')
                setSelectedCity(null)
              }}
            />
          )}
        </Field>
      </FormItem>

      {/* Comuna */}
      <FormItem
        asterisk
        label="Comuna"
        errorMessage={getIn(errors, `${prefix}.cityId`)}
        invalid={!!getIn(errors, `${prefix}.cityId`)}
      >
        <Field name={`${prefix}.cityId`}>
          {({ field, form }: FieldProps) => (
            <Select
              placeholder="Seleccionar..."
              field={field}
              form={form}
              isDisabled={!selectedState}
              options={
                selectedState?.cities?.map((city) => ({
                  value: city.id,
                  label: city.name,
                })) || []
              }
              value={selectedCity}
              noOptionsMessage={() =>
                !selectedState
                  ? 'Seleccione una región primero'
                  : 'No hay comunas disponibles'
              }
              onChange={(option: any) => {
                setSelectedCity(option)
                setFieldValue(`${prefix}.cityId`, option.value)
              }}
            />
          )}
        </Field>
      </FormItem>
    </>
  )
}

export default AddressFields
