import { InputGroup } from '@/components/ui'
import { FormItem } from '@/components/ui/Form'
import type { InputProps } from '@/components/ui/Input'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { useGetAllDialCodesQuery } from '@/services/RtkQueryService'
import { FormModel } from '@/views/my-properties/PropertyDetails/StepFormFour'
import type { FieldInputProps } from 'formik'
import { Field, FieldProps } from 'formik'
import { ComponentType } from 'react'
import { HiCheck } from 'react-icons/hi'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import type { OptionProps, SingleValueProps } from 'react-select'
import { components } from 'react-select'

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

const MainInfo = ({ values, errors, touched }) => {
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
    <>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-5 mt-4">
        <FormItem
          asterisk
          label="Nombres"
          invalid={errors.name && touched.name}
          errorMessage={errors.name}
        >
          <Field name="name">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  size="md"
                  placeholder="Ingresar Nombres"
                  value={values.name}
                  type="text"
                  onChange={(e) => {
                    form.setFieldValue(e.target.name, e.target.value)
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
                  field={field}
                  size="md"
                  placeholder="Ingresar Apellidos"
                  value={values.lastName}
                  type="text"
                  onChange={(e) => {
                    form.setFieldValue(e.target.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="Cliente Alias"
          className="w-[100%]"
          invalid={errors.alias && touched.alias}
          errorMessage={errors.alias}
        >
          <Field name="alias">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  size="md"
                  placeholder="Ingresar un Alias para tu cliente"
                  value={values.alias}
                  type="text"
                  onChange={(e) => {
                    form.setFieldValue(e.target.name, e.target.value)
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
                placeholder="Ingresar RUT"
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
          label="Correo electrónico"
          invalid={errors.email && touched.email}
          errorMessage={errors.email}
        >
          <Field name="email">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  type="email"
                  field={field}
                  size="md"
                  placeholder="Ingresar Correo electrónico"
                  value={values.email}
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
      </div>
    </>
  )
}

export default MainInfo
