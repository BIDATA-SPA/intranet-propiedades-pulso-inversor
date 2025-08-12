import AdaptableCard from '@/components/shared/AdaptableCard'
import { InputGroup } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import type { InputProps } from '@/components/ui/Input'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useGetAllDialCodesQuery } from '@/services/RtkQueryService'
import {
  Field,
  FieldInputProps,
  FieldProps,
  FormikErrors,
  FormikTouched,
  FormikValues,
} from 'formik'
import { ComponentType } from 'react'
import { HiCheck } from 'react-icons/hi'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import {
  components,
  type OptionProps,
  type SingleValueProps,
} from 'react-select'
import AddressFields from './AddressFields'

export type FormFieldsName = {
  name: string
  lastName: string
  alias: string
  rut: string
  email: string
  dialCodeId: number
  phone: string
  address: {
    countryId: number
    stateId: number
    cityId: number
    street: string
  }
}

type BasicInformationFields = {
  touched: FormikTouched<FormFieldsName>
  errors: FormikErrors<FormFieldsName>
  values: FormikValues
  setFieldValue?: any
}

type CountryOption = {
  label: string
  dialCode: string
  value: string
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
  return <Input {...props} value={props.field.value} name={props.field.name} />
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

const BasicInfoFields = (props: BasicInformationFields) => {
  const { values, touched, errors, setFieldValue } = props

  const { data } = useGetAllDialCodesQuery({
    limit: 234,
    page: 1,
    paginated: false,
  })

  const countryOptions = data?.data?.map((option) => ({
    value: `${option.id}`,
    label: `${option.country}`,
    dialCode: `${option.dialCode}`,
  }))

  return (
    <AdaptableCard className="my-4">
      <div className="border-b mb-4 pb-2 dark:border-b-gray-700">
        <h5>Información básica</h5>
        <p>
          Sección para ingresar información básica del perfil de tu cliente.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormItem
          asterisk
          label="Nombres"
          invalid={(errors.name && touched.name) as boolean}
          errorMessage={errors.name}
        >
          <Field
            type="text"
            autoComplete="off"
            name="name"
            placeholder="Ingresar nombres"
            component={Input}
          />
        </FormItem>
        <FormItem
          asterisk
          label="Apellidos"
          invalid={(errors.lastName && touched.lastName) as boolean}
          errorMessage={errors.lastName}
        >
          <Field
            type="text"
            autoComplete="off"
            name="lastName"
            placeholder="Ingresar apellidos"
            component={Input}
          />
        </FormItem>
        <FormItem
          label="Alias del cliente"
          invalid={(errors.alias && touched.alias) as boolean}
          errorMessage={errors.alias}
        >
          <Field
            type="text"
            autoComplete="off"
            name="alias"
            placeholder="Ingresar alias"
            component={Input}
          />
        </FormItem>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <FormItem
          label="Rut o DNI"
          invalid={(errors.rut && touched.rut) as boolean}
          errorMessage={errors.rut}
          extra={
            <span className="text-[11px] font-thin ml-2">
              (Sin puntos ni guión)
            </span>
          }
        >
          <Field
            type="text"
            autoComplete="off"
            name="rut"
            placeholder="Ingresar RUT o DNI"
            component={Input}
          />
        </FormItem>

        <FormItem
          asterisk
          label="Correo electrónico"
          invalid={(errors.email && touched.email) as boolean}
          errorMessage={errors.email}
        >
          <Field
            type="email"
            autoComplete="off"
            name="email"
            placeholder="Ingresar correo electrónico"
            component={Input}
          />
        </FormItem>

        <FormItem
          asterisk
          label="Teléfono celular"
          invalid={(errors.phone && touched.phone) as boolean}
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
        </FormItem>
      </div>

      <AddressFields
        values={values}
        touched={touched}
        errors={errors}
        setFieldValue={setFieldValue}
      />
    </AdaptableCard>
  )
}

export default BasicInfoFields
