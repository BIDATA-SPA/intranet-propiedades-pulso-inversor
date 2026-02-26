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

const ComodidadesYEquipamientoFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
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

        <FormItem label="Rampa para silla de Ruedas">
          <Field name="characteristics.hasWheelchairRamp">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasWheelchairRamp}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasWheelchairRamp
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Probador">
          <Field name="characteristics.hasFittingRoom">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasFittingRoom}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasFittingRoom
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Estac. para Visitas">
          <Field name="characteristics.hasVisitorParking">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasVisitorParking}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasVisitorParking
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

export default ComodidadesYEquipamientoFields
