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

const SeguridadFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem label="Conserjería">
          <Field name="characteristics.has24hConcierge">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.has24hConcierge}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.has24hConcierge
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Alarma">
          <Field name="characteristics.hasAlarm">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasAlarm}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasAlarm
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Sistema Contra Incendio">
          <Field name="characteristics.hasFireProtectionSystem">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasFireProtectionSystem}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasFireProtectionSystem
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

export default SeguridadFields
