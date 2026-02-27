/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Switcher } from '@/components/ui'
import { injectReducer } from '@/store'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const OtrosFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem label="Azotea">
          <Field name="characteristics.hasRooftop">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasRooftop}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasRooftop
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

export default OtrosFields
