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
        <FormItem label="Chimenea">
          <Field name="characteristics.hasFireplace">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasFireplace}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasFireplace
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
        <FormItem label="Area de Cine">
          <Field name="characteristics.hasCinemaArea">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasCinemaArea}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasCinemaArea
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
        <FormItem label="Área verde">
          <Field name="characteristics.hasGreenAreas">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasGreenAreas}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasGreenAreas
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
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
        <FormItem label="Refrigerador">
          <Field name="characteristics.hasRefrigerator">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasRefrigerator}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasRefrigerator
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Jacuzzi">
          <Field name="characteristics.hasJacuzzi">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasJacuzzi}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasJacuzzi
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Sauna">
          <Field name="characteristics.hasSauna">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSauna}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSauna
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
        <FormItem label="Cancha Polideportiva">
          <Field name="characteristics.hasMultiSportsCourt">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasMultiSportsCourt}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasMultiSportsCourt
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
      </div>
    </>
  )
}

export default ComodidadesYEquipamiento
