/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input, Select, Switcher } from '@/components/ui'

import { injectReducer } from '@/store'
import { filterLandShapeGround } from '@/utils/types/new-property/constants'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const FichaTecnica = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Horario de Contacto">
          <Field name="characteristics.contactHours">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: Desde 08:00am a 16:00pm"
                  value={values.characteristics?.contactHours}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Forma del Terreno">
          <Field name="characteristics.landShape">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterLandShapeGround}
                  placeholder="Seleccionar..."
                  value={filterLandShapeGround?.filter(
                    (option) =>
                      option.value === values.characteristics.landShape
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Piscina">
          <Field name="characteristics.hasSwimmingPool">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSwimmingPool}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSwimmingPool
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Antiguedad (En años)">
          <Field name="characteristics.yearOfConstruction">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: 1-20-30"
                  value={values.characteristics?.yearOfConstruction}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Quincho">
          <Field name="characteristics.hasBarbecueArea">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasBarbecueArea}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasBarbecueArea
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Baño de Visitas">
          <Field name="characteristics.hasGuestBathroom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasGuestBathroom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasGuestBathroom
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

export default FichaTecnica
