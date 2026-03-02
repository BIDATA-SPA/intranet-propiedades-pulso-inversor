/* eslint-disable import/named */
import { TimeInput } from '@/components/ui'
import Badge from '@/components/ui/Badge'
import DatePicker from '@/components/ui/DatePicker'
import { FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { colorOptions } from '@/constants/colors.contant'
import {
  useGetAllCustomersQuery,
  useGetAllPropertiesQuery,
} from '@/services/RtkQueryService'
import { Field, FieldProps } from 'formik'
import { HiCheck } from 'react-icons/hi'
import { ControlProps, OptionProps, components } from 'react-select'

type ColorOption = {
  value: string
  label: string
  color?: string
}

const { Control } = components

const CustomSelectOption = ({
  innerProps,
  label,
  data,
  isSelected,
}: OptionProps<ColorOption>) => {
  return (
    <div
      className={`flex items-center justify-between p-2 ${
        isSelected
          ? 'bg-gray-100 dark:bg-gray-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
      {...innerProps}
    >
      <div className="flex items-center">
        <Badge className={`${data.color}`} />
        <span className="ml-2 rtl:mr-2 capitalize">{label}</span>
      </div>
      {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
    </div>
  )
}

const CustomControl = ({ children, ...props }: ControlProps<ColorOption>) => {
  const selected = props.getValue()[0]

  return (
    <Control className="capitalize" {...props}>
      {selected && <Badge className={`${selected.color} ltr:ml-4 rtl:mr-4`} />}
      {children}
    </Control>
  )
}

const VisitingOrderFields = ({ errors, touched, values }) => {
  const { data: customers } = useGetAllCustomersQuery({
    page: 1,
    limit: 999999,
    paginated: false,
    search: '',
  })

  const { data: properties } = useGetAllPropertiesQuery({
    page: 1,
    limit: 999999,
    search: '',
  })

  const customerOptions =
    customers &&
    customers?.map((customer) => ({
      value: Number(customer.id),
      label: `${customer.name} ${customer.lastName} ${
        customer?.alias && `(${customer?.alias})`
      }`,
    }))

  const propertyOptions =
    properties?.data &&
    properties?.data?.map((property) => ({
      value: Number(property.id),
      label: `(#${property.id})  ${property.propertyTitle}`,
    }))

  return (
    <div>
      <FormItem
        asterisk
        label="Título"
        invalid={errors.title && touched.title}
        errorMessage={errors.title}
      >
        <Field
          type="text"
          autoComplete="off"
          name="title"
          placeholder="Ingresar título de esta orden"
          component={Input}
        />
      </FormItem>

      <div>
        <FormItem
          label="Cliente"
          invalid={errors.customerId && touched.customerId}
          errorMessage={errors.customerId}
        >
          <Field name="customerId">
            {({ field, form }: FieldProps) => (
              <Select
                placeholder="Seleccionar..."
                field={field}
                form={form}
                options={customerOptions}
                value={customerOptions?.filter(
                  (option) => option.value === values.customerId
                )}
                menuPlacement="bottom"
                onChange={(option) =>
                  form.setFieldValue(field.name, option?.value)
                }
              />
            )}
          </Field>
        </FormItem>
      </div>

      <div>
        <FormItem
          label="Propiedad"
          invalid={errors.propertyId && touched.propertyId}
          errorMessage={errors.propertyId}
        >
          <Field name="propertyId">
            {({ field, form }: FieldProps) => (
              <Select
                placeholder="Seleccionar..."
                field={field}
                form={form}
                options={propertyOptions}
                value={propertyOptions?.filter(
                  (option) => option.value === values.propertyId
                )}
                menuPlacement="bottom"
                onChange={(option) =>
                  form.setFieldValue(field.name, option?.value)
                }
              />
            )}
          </Field>
        </FormItem>
      </div>

      <div className="grid grid-cols-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-content-center">
          <FormItem
            label="Fecha inicial"
            invalid={errors.start && touched.start}
            errorMessage={errors.start}
          >
            <Field name="start" placeholder="Ingresar fecha">
              {({ field, form }: FieldProps) => (
                <DatePicker
                  field={field}
                  form={form}
                  value={field.value}
                  onChange={(date) => {
                    form.setFieldValue(field.name, date)
                  }}
                />
              )}
            </Field>
          </FormItem>

          <div>
            <FormItem
              label="Hora de inicio"
              invalid={errors.startTime && touched.startTime}
              errorMessage={errors.startTime}
            >
              <Field name="startTime" placeholder="Ingresar hora">
                {({ field, form }: FieldProps) => (
                  <TimeInput
                    format="24"
                    defaultValue={new Date()}
                    field={field}
                    form={form}
                    value={field.value}
                    onChange={(date) => {
                      form.setFieldValue(field.name, date)
                    }}
                  />
                )}
              </Field>
            </FormItem>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 place-content-center">
          <FormItem
            label="Fecha de término"
            invalid={errors.end && touched.end}
            errorMessage={errors.end}
          >
            <Field name="end" placeholder="Ingresar fecha">
              {({ field, form }: FieldProps) => (
                <DatePicker
                  field={field}
                  form={form}
                  value={field.value}
                  onChange={(date) => {
                    form.setFieldValue(field.name, date)
                  }}
                />
              )}
            </Field>
          </FormItem>

          <div>
            <FormItem
              label="Hora de término"
              invalid={errors.endTime && touched.endTime}
              errorMessage={errors.endTime}
            >
              <Field name="endTime" placeholder="Ingresar hora">
                {({ field, form }: FieldProps) => (
                  <TimeInput
                    format="24"
                    defaultValue={new Date()}
                    field={field}
                    form={form}
                    value={field.value}
                    onChange={(date) => {
                      form.setFieldValue(field.name, date)
                    }}
                  />
                )}
              </Field>
            </FormItem>
          </div>
        </div>
      </div>

      <FormItem
        label="Descripción"
        invalid={errors.description && touched.description}
        errorMessage={errors.description}
      >
        <Field
          textArea
          type="text"
          autoComplete="off"
          name="description"
          placeholder="Ingresar detalles del evento"
          component={Input}
        />
      </FormItem>

      <FormItem
        label="Color"
        invalid={errors.eventColor && touched.eventColor}
        errorMessage={errors.eventColor}
      >
        <Field name="eventColor">
          {({ field, form }: FieldProps) => (
            <Select<ColorOption>
              placeholder="Seleccionar..."
              field={field}
              form={form}
              options={colorOptions}
              value={colorOptions.filter(
                (option) => option.value === values.eventColor
              )}
              components={{
                Option: CustomSelectOption,
                Control: CustomControl,
              }}
              menuPlacement="top"
              onChange={(option) =>
                form.setFieldValue(field.name, option?.value)
              }
            />
          )}
        </Field>
      </FormItem>
    </div>
  )
}

export default VisitingOrderFields
