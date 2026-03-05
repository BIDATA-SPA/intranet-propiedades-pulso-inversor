/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select, Switcher } from '@/components/ui'
import { injectReducer } from '@/store'
import { filterTypeOfSecurity } from '@/utils/types/new-property/constants'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const Seguridad = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem label="Seguridad">
          <Field name="characteristics.hasSecurity">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSecurity}
                  onChange={() => {
                    if (values.characteristics.hasSecurity) {
                      form.setFieldValue('characteristics.typeOfSecurity', [])
                    }

                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSecurity
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Tipo de seguridad">
          <Field name="characteristics.typeOfSecurity">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isMulti
                  isClearable
                  isDisabled={!values.characteristics.hasSecurity}
                  placeholder="Seleccionar"
                  value={values.characteristics.typeOfSecurity}
                  options={filterTypeOfSecurity as any}
                  onChange={(option: any) => {
                    form.setFieldValue(field.name, option)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Condominio Cerrado">
          <Field name="characteristics.hasClosedCondominium">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasClosedCondominium}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasClosedCondominium
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Conserjería 24hrs">
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

        <FormItem label="Acceso Controlado">
          <Field name="characteristics.hasControlledAccess">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasControlledAccess}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasControlledAccess
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Cámara de Seguridad">
          <Field name="characteristics.hasSurveillanceCamera">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSurveillanceCamera}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSurveillanceCamera
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

export default Seguridad
