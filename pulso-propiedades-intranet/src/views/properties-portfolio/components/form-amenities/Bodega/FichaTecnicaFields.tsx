/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input, Select } from '@/components/ui'

import { injectReducer } from '@/store'
import {
  filterTypeOfWinery,
  filterUnitFloorStand,
  filterUnitHeight,
  filterUnitPricePerArea,
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

        <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem label="Altura">
            <Field name="characteristics.cellarHeight">
              {({ field, form }: FieldProps) => {
                return (
                  <Input
                    field={field}
                    type="number"
                    size="md"
                    className="mb-2"
                    placeholder=""
                    value={values.characteristics?.cellarHeight}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Unidad de Altura">
            <Field name="characteristics.cellarHeightUnit">
              {({ field, form }: FieldProps) => {
                return (
                  <Select
                    isClearable
                    className="relative z-[99]"
                    field={field}
                    options={filterUnitHeight}
                    placeholder="Seleccionar..."
                    value={filterUnitHeight?.filter(
                      (option) =>
                        option.value ===
                        values.characteristics?.cellarHeightUnit
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

        {/* aca */}
        <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem label="P. por Unidad de Área">
            <Field name="characteristics.pricePerUnitOfArea">
              {({ field, form }: FieldProps) => {
                return (
                  <Input
                    field={field}
                    type="number"
                    size="md"
                    className="mb-2"
                    placeholder=""
                    value={values.characteristics?.pricePerUnitOfArea}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Unidad de Área">
            <Field name="characteristics.pricePerUnitOfAreaUnit">
              {({ field, form }: FieldProps) => {
                return (
                  <Select
                    isClearable
                    className="relative z-[99]"
                    field={field}
                    options={filterUnitPricePerArea}
                    placeholder="Seleccionar..."
                    value={filterUnitPricePerArea?.filter(
                      (option) =>
                        option.value ===
                        values.characteristics?.pricePerUnitOfAreaUnit
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

        <FormItem label="Tipo de Bodega">
          <Field name="characteristics.typeOfWinery">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  className="relative z-[99]"
                  field={field}
                  options={filterTypeOfWinery}
                  placeholder="Seleccionar..."
                  value={filterTypeOfWinery?.filter(
                    (option) =>
                      option.value === values.characteristics?.typeOfWinery
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem label="Soporte de Piso">
            <Field name="characteristics.floorStand">
              {({ field, form }: FieldProps) => {
                return (
                  <Input
                    field={field}
                    type="number"
                    size="md"
                    className="mb-2"
                    placeholder=""
                    value={values.characteristics?.floorStand}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Unidad de Soporte">
            <Field name="characteristics.floorStandUnit">
              {({ field, form }: FieldProps) => {
                return (
                  <Select
                    isClearable
                    className="relative z-[99]"
                    field={field}
                    options={filterUnitFloorStand}
                    placeholder="Seleccionar..."
                    value={filterUnitFloorStand?.filter(
                      (option) =>
                        option.value === values.characteristics?.floorStandUnit
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

        <FormItem label="Remolques de Plataforma">
          <Field name="characteristics.flatbedTrailers">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  className="mb-2"
                  placeholder=""
                  value={values.characteristics?.flatbedTrailers}
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
