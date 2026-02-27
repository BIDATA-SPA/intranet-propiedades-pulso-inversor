/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import Switcher from '@/components/ui/Switcher'

import { injectReducer } from '@/store'
import { filterTypeOfKitchens } from '@/utils/types/new-property/constants'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const AmbientesFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Comedor">
          <Field name="characteristics.hasDiningRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasDiningRoom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasDiningRoom
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Cocina">
          <Field name="characteristics.hasKitchen">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics.hasKitchen}
                  className="my-3"
                  onChange={() => {
                    if (values.characteristics.hasKitchen) {
                      form.setFieldValue('characteristics.typeOfKitchen', '')
                    }
                    form.setFieldValue(
                      field.name,
                      !values.characteristics.hasKitchen
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Tipo de Cocina">
          <Field name="characteristics.typeOfKitchen">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  isDisabled={!values.characteristics?.hasKitchen}
                  field={field}
                  options={filterTypeOfKitchens}
                  placeholder="Seleccionar..."
                  value={filterTypeOfKitchens?.filter(
                    (option) =>
                      option.value === values.characteristics?.typeOfKitchen
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

export default AmbientesFields
