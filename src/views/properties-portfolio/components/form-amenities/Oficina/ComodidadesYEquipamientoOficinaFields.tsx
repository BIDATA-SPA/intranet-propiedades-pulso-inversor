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
        <FormItem label="Ascensor">
          <Field name="characteristics.hasElevator">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasElevator}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasElevator
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

        <FormItem label="Valet Parking">
          <Field name="characteristics.hasValetParking">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasValetParking}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasValetParking
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Gimnasio">
          <Field name="characteristics.hasGym">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasGym}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasGym
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
