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

const ServiciosFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem label="Agua Corriente">
          <Field name="characteristics.hasRunningWater">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasRunningWater}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasRunningWater
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Gas Natural">
          <Field name="characteristics.hasNaturalGas">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasNaturalGas}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasNaturalGas
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Cloaca">
          <Field name="characteristics.hasSewerConnection">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSewerConnection}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSewerConnection
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Luz Electrica">
          <Field name="characteristics.hasElectricity">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasElectricity}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasElectricity
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

export default ServiciosFields
