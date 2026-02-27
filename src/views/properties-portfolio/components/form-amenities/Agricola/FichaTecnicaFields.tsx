/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input, Select } from '@/components/ui'

import { injectReducer } from '@/store'
import {
  filterLandShapeGround,
  filterTypeOfFarm,
  filterUnitCoveredHullAread,
} from '@/utils/types/new-property/constants'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const FichaTecnicaFields = ({ values }: FieldNameProps) => {
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

        <FormItem label="Tipo de Campo">
          <Field name="characteristics.typeOfFarm">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterTypeOfFarm}
                  placeholder="Seleccionar..."
                  value={filterTypeOfFarm?.filter(
                    (option) =>
                      option.value === values.characteristics.typeOfFarm
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2  md:gap-3">
          <FormItem label="Sup. cubierta del casco">
            <Field name="characteristics.coveredHullAread">
              {({ field, form }: FieldProps) => {
                return (
                  <Input
                    field={field}
                    type="number"
                    size="md"
                    className="mb-2"
                    placeholder=""
                    value={values.characteristics?.coveredHullAread}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Unidad Superficie">
            <Field name="characteristics.coveredHullAreadUnit">
              {({ field, form }: FieldProps) => {
                return (
                  <Select
                    isClearable
                    className="relative z-[99]"
                    field={field}
                    options={filterUnitCoveredHullAread}
                    placeholder="Seleccionar..."
                    value={filterUnitCoveredHullAread?.filter(
                      (option) =>
                        option.value ===
                        values.characteristics?.coveredHullAreadUnit
                    )}
                    onChange={(option) => {
                      form.setFieldValue(field.name, option?.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>
        </div>

        <FormItem label="Distancia al Asfalto">
          <Field name="characteristics.distanceToAsphalt">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: 5m - 2.5m"
                  value={values.characteristics?.distanceToAsphalt}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
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

export default FichaTecnicaFields
