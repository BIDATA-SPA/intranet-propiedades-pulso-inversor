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

const EspaciosComunesFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Lavandería">
          <Field name="characteristics.hasLaundryRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasLaundryRoom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasLaundryRoom
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Salón de fiestas">
          <Field name="characteristics.hasPartyRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasPartyRoom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasPartyRoom
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Salón de usos múltiples">
          <Field name="characteristics.hasMultipurposeRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasMultipurposeRoom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasMultipurposeRoom
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

export default EspaciosComunesFields
