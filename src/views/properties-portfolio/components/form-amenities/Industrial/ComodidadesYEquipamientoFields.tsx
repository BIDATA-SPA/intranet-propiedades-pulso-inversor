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

const ComodidadesYEquipamiento = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Báscula">
          <Field name="characteristics.hasScale">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasScale}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasScale
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Generador eléctrico">
          <Field name="characteristics.hasElectricGenerator">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasElectricGenerator}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasElectricGenerator
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Sistema de ventilación">
          <Field name="characteristics.hasVentilationSystem">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasVentilationSystem}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasVentilationSystem
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

export default ComodidadesYEquipamiento
