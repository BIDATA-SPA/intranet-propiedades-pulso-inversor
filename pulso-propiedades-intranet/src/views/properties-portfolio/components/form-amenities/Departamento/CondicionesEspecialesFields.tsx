/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import Switcher from '@/components/ui/Switcher'

import { injectReducer } from '@/store'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const CondicionesEspecialesFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Mascotas">
          <Field name="characteristics.petsAllowed">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.petsAllowed}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.petsAllowed
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Uso Comercial">
          <Field name="characteristics.isCommercialUseAllowed">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.isCommercialUseAllowed}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.isCommercialUseAllowed
                    )
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

export default CondicionesEspecialesFields
