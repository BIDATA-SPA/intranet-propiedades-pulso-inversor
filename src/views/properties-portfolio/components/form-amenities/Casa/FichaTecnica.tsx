/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input, Select } from '@/components/ui'

import { injectReducer } from '@/store'
import { filterTypeOfHouse } from '@/utils/types/new-property/constants'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const FichaTecnica = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Horario de Contacto">
          <Field name="characteristics.contactHours">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: Desde 08:00am a 16:00pm"
                  value={values.characteristics?.contactHours}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Antiguedad (En años)">
          <Field name="characteristics.yearOfConstruction">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: 1-20-30"
                  value={values.characteristics?.yearOfConstruction}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Tipo de Casa">
          <Field name="characteristics.houseType">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  className="relative z-[99]"
                  field={field}
                  options={filterTypeOfHouse}
                  placeholder="Seleccionar..."
                  value={filterTypeOfHouse?.filter(
                    (option) =>
                      option.value === values.characteristics?.houseType
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>
    </>
  )
}

export default FichaTecnica
