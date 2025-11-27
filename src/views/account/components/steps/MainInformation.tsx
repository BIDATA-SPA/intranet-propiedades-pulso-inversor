import { RichTextEditor } from '@/components/shared'
import { InputGroup } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormItem } from '@/components/ui/Form'
import type { InputProps } from '@/components/ui/Input'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllDialCodesQuery,
  useGetAllStatesQuery,
} from '@/services/RtkQueryService'
import { CreateRealtorFormModel } from '@/services/user/types/user.type'
import { useAppSelector } from '@/store'
import type { FieldInputProps } from 'formik'
import { Field, FieldArray, FieldProps } from 'formik'
import { ComponentType, useEffect, useState } from 'react'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { HiCheck } from 'react-icons/hi'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import type { OptionProps, SingleValueProps } from 'react-select'
import { components } from 'react-select'

type FormModel = CreateRealtorFormModel

type CountryOption = {
  id: string
  label: string
  dialCode: string
}

const { SingleValue } = components

const PhoneSelectOption = ({
  innerProps,
  data,
  isSelected,
}: OptionProps<CountryOption>) => {
  return (
    <div
      className={`cursor-pointer flex items-center justify-between p-2 ${
        isSelected
          ? 'bg-gray-100 dark:bg-gray-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
      {...innerProps}
    >
      <div className="flex items-center gap-2">
        <span>
          {`${data?.label}`} {`(${data?.dialCode})`}
        </span>
        {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
      </div>
    </div>
  )
}

const PhoneControl = (props: SingleValueProps<CountryOption>) => {
  const selected = props.getValue()[0]
  return (
    <SingleValue {...props}>
      {selected && (
        <span>
          {selected?.label} {`(${selected?.dialCode})`}
        </span>
      )}
    </SingleValue>
  )
}

const NumberInput = (props: InputProps) => {
  return <Input {...props} name="dialCodeId" value={props.field.value} />
}

const NumericFormatInput = ({
  onValueChange,
  ...rest
}: Omit<NumericFormatProps, 'form'> & {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  form: any
  field: FieldInputProps<unknown>
}) => {
  return (
    <NumericFormat
      customInput={Input as ComponentType}
      type="text"
      autoComplete="off"
      onValueChange={onValueChange}
      {...rest}
    />
  )
}

const MainInformation = ({ values, errors, touched, setFieldValue }) => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [statesOptions, setStatesOptions] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)
  const { data } = useGetAllDialCodesQuery({
    limit: 234,
    page: 1,
    paginated: false,
  })

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

  const countryOptions = data?.data?.map((option) => ({
    value: `${option.id}`,
    label: `${option.country}`,
    dialCode: `${option.dialCode}`,
  }))

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
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-5 mt-4">
        <FormItem
          asterisk
          label="Nombre"
          invalid={errors.name && touched.name}
          errorMessage={errors.name}
        >
          <Field name="name">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder="Ingresar Nombre"
                  value={values.name}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          asterisk
          label="Apellidos"
          invalid={errors.lastName && touched.lastName}
          errorMessage={errors.lastName}
        >
          <Field name="lastName">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder="Ingresar Apellidos"
                  value={values.lastName}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="RUT"
          invalid={errors.rut && touched.rut}
          errorMessage={errors.rut}
        >
          <Field name="rut">
            {({ field, form }: FieldProps<FormModel>) => (
              <Input
                type="text"
                field={field}
                size="md"
                placeholder="Ingresar Rut o ID"
                value={values.rut}
                onChange={(e) => {
                  form.setFieldValue(field.name, e.target.value)
                }}
              />
            )}
          </Field>
        </FormItem>

        <FormItem
          label="Teléfono/Celular"
          invalid={
            (errors.dialCodeId && touched.dialCodeId) ||
            (errors.phone && touched.phone)
          }
          errorMessage={errors.phone}
        >
          <InputGroup>
            <Field name="dialCodeId">
              {() => (
                <Select<CountryOption>
                  className="min-w-[180px]"
                  placeholder="Cód. País"
                  components={{
                    Option: PhoneSelectOption,
                    SingleValue: PhoneControl,
                  }}
                  options={countryOptions}
                  value={countryOptions?.find(
                    (country) => country.value === values.dialCodeId
                  )}
                  onChange={(selectedOption) => {
                    setFieldValue('dialCodeId', selectedOption?.value)
                  }}
                />
              )}
            </Field>
            <Field name="phone">
              {({ field, form }: FieldProps) => (
                <NumericFormatInput
                  form={form}
                  field={field}
                  customInput={NumberInput as ComponentType}
                  placeholder="Teléfono celular"
                  onValueChange={(e) => {
                    setFieldValue('phone', e.value)
                  }}
                />
              )}
            </Field>
          </InputGroup>
        </FormItem>
      </div>

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
                  : 'Comuna o Ciudad no encontrada'}
              </span>
            )}
            value={selectedCity}
            onChange={(selectedOption) => {
              setFieldValue('address.cityId', selectedOption?.value)
              setSelectedCity(selectedOption)
            }}
          />
        </FormItem>
        <FormItem label="Dirección">
          <Field name="address.street">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder="Ingresar Dirección"
                  value={values.address?.street}
                  onChange={(e) => {
                    form.setFieldValue('address.street', e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      {userAuthority === 2 ? (
        <>
          <FormItem
            label="Página web"
            invalid={Boolean(touched.webPage && errors.webPage)}
            errorMessage={touched.webPage ? (errors.webPage as string) : ''}
          >
            <Field name="webPage">
              {({ field, form }: FieldProps<FormModel>) => (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder="Ej: https://mi-empresa.cl"
                  value={form.values.webPage ?? ''}
                  onChange={(e) =>
                    form.setFieldValue(field.name, e.target.value)
                  }
                  onBlur={() => form.setFieldTouched(field.name, true)}
                />
              )}
            </Field>
          </FormItem>

          <FormItem
            label="Sobre mí"
            className="mb-4"
            labelClass="justify-start"
            invalid={errors.about && touched.about}
            errorMessage={errors.about}
          >
            <Field name="about">
              {({ field, form }: FieldProps) => (
                <RichTextEditor
                  value={field.value}
                  onChange={(val) => form.setFieldValue(field.name, val)}
                />
              )}
            </Field>
          </FormItem>

          <div className="mb-4">
            <h6>Empresas</h6>
            <p>Ingresar empresa/s a las que pertence el/la corredor/a.</p>
          </div>

          <FieldArray name="companies">
            {({ remove, push }) => (
              <div>
                {values.companies &&
                  values.companies.length > 0 &&
                  values.companies.map((_: string, index: number) => (
                    <div key={index} className="">
                      <div className="grid grid-cols-3 gap-4 my-2">
                        <div className="col-span-2">
                          <Field
                            as={Input}
                            type="text"
                            name={`companies.${index}`}
                            placeholder="Ingresar nombre de la empresa"
                            className="w-full"
                          />
                        </div>

                        <div className="w-full flex justify-end items-center gap-2">
                          <Button
                            type="button"
                            variant="twoTone"
                            color="red-600"
                            className="w-auto text-center flex justify-center items-center"
                            onClick={() => remove(index)}
                          >
                            <FaTrash />
                          </Button>

                          {index === values.companies.length - 1 && (
                            <Button
                              type="button"
                              variant="twoTone"
                              color="green-600"
                              aria-label="Agregar empresa"
                              onClick={() => {
                                if (
                                  values.companies[values.companies.length - 1]
                                ) {
                                  push('')
                                }
                              }}
                            >
                              <FaPlus />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                {values?.companies?.length === 0 && (
                  <Button
                    type="button"
                    variant="solid"
                    color="lime-500"
                    aria-label="Agregar primera empresa"
                    onClick={() => push('')}
                  >
                    Agregar empresa
                  </Button>
                )}
              </div>
            )}
          </FieldArray>
        </>
      ) : null}
    </>
  )
}

export default MainInformation
