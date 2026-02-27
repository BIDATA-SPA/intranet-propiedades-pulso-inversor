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
        <FormItem label="Playroom">
          <Field name="characteristics.hasPlayground">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasPlayground}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasPlayground
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Cancha de Fútbol">
          <Field name="characteristics.hasSoccerField">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSoccerField}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSoccerField
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Cancha de Tenis">
          <Field name="characteristics.hasTennisCourt">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasTennisCourt}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasTennisCourt
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Cancha de Basketball">
          <Field name="characteristics.hasBasketballCourt">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasBasketballCourt}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasBasketballCourt
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Cancha de Paddle">
          <Field name="characteristics.hasPaddleCourt">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasPaddleCourt}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasPaddleCourt
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Caballeriza">
          <Field name="characteristics.hasHorseStable">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasHorseStable}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasHorseStable
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
