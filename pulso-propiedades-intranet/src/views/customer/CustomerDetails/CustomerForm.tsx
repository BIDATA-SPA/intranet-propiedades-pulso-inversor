import { InputGroup, Notification, toast } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import type { InputProps } from '@/components/ui/Input'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import {
  useGetAllCountriesQuery,
  useGetAllDialCodesQuery,
  useGetAllStatesQuery,
  useUpdateCustomerMutation,
} from '@/services/RtkQueryService'
import { CreateCustomerFormModel } from '@/services/customers/types/customer.type'
import type { FieldInputProps } from 'formik'
import { Field, FieldProps, Form, Formik } from 'formik'
import { ComponentType, useEffect, useState } from 'react'
import { HiCheck } from 'react-icons/hi'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { useParams } from 'react-router-dom'
import type { OptionProps, SingleValueProps } from 'react-select'
import { components } from 'react-select'
import * as Yup from 'yup'

type CountryOption = {
  id: string
  label: string
  dialCode: string
}

type FormModel = Partial<CreateCustomerFormModel>

const { SingleValue } = components

// const RUT_REGEX = /^\d{2}\.\d{3}\.\d{3}-[0-9Kk]$/

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Este campo es requerido.'),
  lastName: Yup.string().required('Este campo es requerido.'),
  rut: Yup.string().optional(),
  phone: Yup.string()
    .required('Este campo es requerido.')
    .matches(
      /^[0-9]{1,9}$/,
      'El número de teléfono debe contener solo números y no exceder 9 dígitos.'
    ),
  dialCodeId: Yup.string().required('Este campo es requerido.'),
  email: Yup.string()
    .email('Formato del correo incorrecto.')
    .required('Este campo es requerido.')
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'El correo electrónico no es válido.'
    ),
  address: Yup.object().shape({
    countryId: Yup.number().required('Este campo es requerido.'),
    stateId: Yup.number().required('Este campo es requerido.'),
    cityId: Yup.number().required('Este campo es requerido.'),
    street: Yup.string().optional(),
  }),
})

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
  return <Input {...props} value={props.field.value} />
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

const CustomerForm = ({ initialValues }: { initialValues: FormModel }) => {
  const { customerId } = useParams()
  const [updateCustomer, { isLoading, isSuccess, isError, isUninitialized }] =
    useUpdateCustomerMutation()
  const { data } = useGetAllDialCodesQuery({
    limit: 234,
    page: 1,
    paginated: false,
  })
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [statesOptions, setStatesOptions] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  const countryOptions = data?.data?.map((option) => ({
    value: `${option.id}`,
    label: `${option.country}`,
    dialCode: `${option.dialCode}`,
  }))

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Cliente Actualizado',
        'Cliente actualizado correctamente',
        3
      )

      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error actualizando el cliente, intentalo más tarde',
        3
      )
    }
  }, [isSuccess, isError])

  const onSubmit = (values: FormModel) => {
    updateCustomer({ id: customerId, ...values })
  }

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
    if (initialValues?.address?.countryId && countries) {
      const country = countries?.find(
        (c) => c.value === initialValues.address.countryId
      )
      setSelectedCountry(country || null)
    }
  }, [initialValues?.address?.countryId, countries])

  useEffect(() => {
    if (initialValues?.address?.stateId && states) {
      const state = states?.find(
        (s) => s.value === initialValues.address.stateId
      )
      setSelectedState(state || null)
    }
  }, [initialValues?.address?.stateId, states])

  useEffect(() => {
    if (initialValues?.address?.cityId && selectedState) {
      const city = selectedState?.cities?.find(
        (c) => c.id === initialValues.address.cityId
      )
      setSelectedCity(city ? { value: city.id, label: city.name } : null)
    }
  }, [initialValues?.address?.cityId, selectedState])

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, setFieldValue }) => {
        return (
          <Form>
            <FormContainer>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormItem
                  asterisk
                  label="Nombre"
                  invalid={errors.name && touched.name}
                  errorMessage={errors.name}
                >
                  <Field
                    autoComplete="off"
                    name="name"
                    placeholder="Nombre del cliente"
                    component={Input}
                    type="text"
                  />
                </FormItem>

                <FormItem
                  asterisk
                  label="Apellido"
                  invalid={errors.lastName && touched.lastName}
                  errorMessage={errors.lastName}
                >
                  <Field
                    autoComplete="off"
                    name="lastName"
                    placeholder="Apellido del cliente"
                    component={Input}
                    type="text"
                  />
                </FormItem>

                <FormItem
                  label="Alias"
                  invalid={errors.alias && touched.alias}
                  errorMessage={errors.alias}
                >
                  <Field
                    autoComplete="off"
                    name="alias"
                    placeholder="Alias"
                    component={Input}
                    type="text"
                  />
                </FormItem>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        placeholder="Ingresar Rut"
                        value={values.rut}
                        onChange={(e) => {
                          form.setFieldValue(field.name, e.target.value)
                        }}
                      />
                    )}
                  </Field>
                </FormItem>

                <FormItem
                  asterisk
                  label="Correo Electrónico"
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    autoComplete="off"
                    name="email"
                    placeholder="Documento de identidad"
                    component={Input}
                    type="text"
                  />
                </FormItem>

                <FormItem
                  asterisk
                  label="Teléfono celular"
                  invalid={errors.phone && touched.phone}
                  errorMessage={errors.phone}
                >
                  <InputGroup>
                    <Field name="dialCodeId">
                      {({ field, form }: FieldProps) => (
                        <Select<CountryOption>
                          className="min-w-[140px]"
                          placeholder="Cód. País"
                          components={{
                            Option: PhoneSelectOption,
                            SingleValue: PhoneControl,
                          }}
                          name="dialCodeId"
                          options={countryOptions}
                          value={countryOptions?.find(
                            (country) => country.value === values?.dialCodeId
                          )}
                          onChange={(country) =>
                            form.setFieldValue(field.name, country?.value)
                          }
                        />
                      )}
                    </Field>

                    <Field name="phone">
                      {({ field, form }: FieldProps) => {
                        return (
                          <NumericFormatInput
                            form={form}
                            field={field}
                            customInput={NumberInput as ComponentType}
                            placeholder="Teléfono celular"
                            onValueChange={(e) => {
                              form.setFieldValue(field.name, e.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </InputGroup>
                  {errors?.phone && (
                    <>{<span className="text-red-500">{errors?.phone}</span>}</>
                  )}
                </FormItem>
                {/* <FormItem
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
                          className="min-w-[150px]"
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
                </FormItem> */}
              </div>

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
                          setFieldValue(
                            'address.countryId',
                            selectedOption.value
                          )
                          setSelectedCountry(selectedOption)
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
                    (errors?.address?.stateId &&
                      touched?.address?.stateId) as boolean
                  }
                  errorMessage={errors?.address?.stateId}
                >
                  <Field name="address.stateId">
                    {({ field, form }: FieldProps) => (
                      <Select
                        field={field}
                        form={form}
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
                    )}
                  </Field>
                </FormItem>

                <FormItem
                  asterisk
                  label="Ciudad"
                  invalid={
                    (errors?.address?.cityId &&
                      touched?.address?.cityId) as boolean
                  }
                  errorMessage={errors?.address?.cityId}
                >
                  <Field name="address.cityId">
                    {({ field, form }: FieldProps) => (
                      <Select
                        field={field}
                        form={form}
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
                    )}
                  </Field>
                </FormItem>

                <FormItem
                  label="Dirección/Calle"
                  invalid={errors.address?.street && touched.address?.street}
                  errorMessage={errors.address?.street}
                >
                  <Field name="address.street">
                    {({ field, form }: FieldProps<FormModel>) => (
                      <Input
                        type="text"
                        field={field}
                        size="md"
                        placeholder="Ingresar Calle"
                        value={values.address?.street}
                        onChange={(e) =>
                          form.setFieldValue(field.name, e.target.value)
                        }
                      />
                    )}
                  </Field>
                </FormItem>
              </div>

              <FormItem>
                <div className="flex gap-2 justify-end">
                  <Button variant="solid" type="submit" loading={isLoading}>
                    Actualizar
                  </Button>
                </div>
              </FormItem>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default CustomerForm
