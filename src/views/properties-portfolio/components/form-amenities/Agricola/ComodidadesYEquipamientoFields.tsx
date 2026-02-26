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
        <FormItem label="Bebederos">
          <Field name="characteristics.hasDrinkingFountains">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasDrinkingFountains}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasDrinkingFountains
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Galpón">
          <Field name="characteristics.hasWarehouses">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasWarehouses}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasWarehouses
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Tanque de Agua">
          <Field name="characteristics.hasWaterTank">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasWaterTank}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasWaterTank
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Casco">
          <Field name="characteristics.hasBarn">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasBarn}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasBarn
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Molinos">
          <Field name="characteristics.hasMills">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasMills}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasMills
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Corral">
          <Field name="characteristics.hasCorral">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasCorral}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasCorral
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Silos">
          <Field name="characteristics.hasSilos">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSilos}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSilos
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
