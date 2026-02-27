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
        <FormItem label="Acceso a Internet">
          <Field name="characteristics.hasInternetAccess">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasInternetAccess}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasInternetAccess
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
        <FormItem label="Línea Telefónica">
          <Field name="characteristics.hasTelephoneLine">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasTelephoneLine}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasTelephoneLine
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
        <FormItem label="Cisterna">
          <Field name="characteristics.hasCistern">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasCistern}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasCistern
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Caldera">
          <Field name="characteristics.hasBoiler">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasBoiler}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasBoiler
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Energía Solar">
          <Field name="characteristics.hasSolarEnergy">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSolarEnergy}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSolarEnergy
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
