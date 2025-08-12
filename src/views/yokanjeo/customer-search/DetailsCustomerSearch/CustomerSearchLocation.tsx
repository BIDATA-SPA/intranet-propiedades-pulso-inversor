import { AdaptableCard } from '@/components/shared'
import { FormItem } from '@/components/ui/Form'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllStatesQuery,
} from '@/services/RtkQueryService'
import { useEffect, useState } from 'react'

const CustomerSearchLocation = ({ values, setFieldValue }) => {
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
    if (values?.countryId && countries) {
      const country = countries?.find((c) => c.value === values?.countryId)
      setSelectedCountry(country || null)
    }
  }, [values?.countryId, countries])

  useEffect(() => {
    if (values?.stateId && states) {
      const state = states?.find((s) => s.value === values.stateId)
      setSelectedState(state || null)
    }
  }, [values?.stateId, states])

  useEffect(() => {
    if (values?.cityId && selectedState) {
      const city = selectedState?.cities?.find((c) => c.id === values?.cityId)
      setSelectedCity(city ? { value: city.id, label: city.name } : null)
    }
  }, [values?.cityId, selectedState])

  return (
    <>
      <AdaptableCard divider isLastChild>
        <h5>Establecer Ubicación de la Propiedad</h5>
        <p className="mb-5">
          Sección para establecer la ubicación y dirección física del Inmueble.
        </p>
      </AdaptableCard>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-4">
        <FormItem label="País">
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
        <FormItem label="Región/Estado">
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
        <FormItem label="Ciudad o Comuna">
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
    </>
  )
}

export default CustomerSearchLocation
