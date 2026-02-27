/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input, Select } from '@/components/ui'

import { injectReducer } from '@/store'
import {
  filterTypeOfCemeteryPlot,
  filterUnitHeight,
} from '@/utils/types/new-property/constants'
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

        <FormItem label="Sector dentro del Cementerio">
          <Field name="characteristics.sectionWithinTheCemetery">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2"
                  placeholder=""
                  value={values.characteristics?.sectionWithinTheCemetery}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem label="Profundidad">
            <Field name="characteristics.depth">
              {({ field, form }: FieldProps) => {
                return (
                  <Input
                    field={field}
                    type="number"
                    size="md"
                    className="mb-2"
                    placeholder=""
                    value={values.characteristics?.depth}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Unid. de Prof.">
            <Field name="characteristics.depthUnit">
              {({ field, form }: FieldProps) => {
                return (
                  <Select
                    isClearable
                    field={field}
                    options={filterUnitHeight}
                    placeholder="Seleccionar..."
                    value={filterUnitHeight?.filter(
                      (option) =>
                        option.value === values.characteristics.depthUnit
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

        <FormItem label="Nombre del Cementerio">
          <Field name="characteristics.cementeryName">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2"
                  placeholder=""
                  value={values.characteristics?.cementeryName}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
          <FormItem label="Ancho">
            <Field name="characteristics.width">
              {({ field, form }: FieldProps) => {
                return (
                  <Input
                    field={field}
                    type="number"
                    size="md"
                    className="mb-2"
                    placeholder=""
                    value={values.characteristics?.width}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Unid. de Ancho">
            <Field name="characteristics.widthUnit">
              {({ field, form }: FieldProps) => {
                return (
                  <Select
                    isClearable
                    field={field}
                    options={filterUnitHeight}
                    placeholder="Seleccionar..."
                    value={filterUnitHeight?.filter(
                      (option) =>
                        option.value === values.characteristics.widthUnit
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

        <FormItem label="Tipo de lote de cementerio">
          <Field name="characteristics.typeOfCemeteryPlot">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterTypeOfCemeteryPlot}
                  placeholder="Seleccionar..."
                  value={filterTypeOfCemeteryPlot?.filter(
                    (option) =>
                      option.value === values.characteristics.typeOfCemeteryPlot
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
          <FormItem label="Largo">
            <Field name="characteristics.long">
              {({ field, form }: FieldProps) => {
                return (
                  <Input
                    field={field}
                    type="number"
                    size="md"
                    className="mb-2"
                    placeholder=""
                    value={values.characteristics?.long}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>

          <FormItem label="Unid. de Largo">
            <Field name="characteristics.longUnit">
              {({ field, form }: FieldProps) => {
                return (
                  <Select
                    isClearable
                    field={field}
                    options={filterUnitHeight}
                    placeholder="Seleccionar..."
                    value={filterUnitHeight?.filter(
                      (option) =>
                        option.value === values.characteristics.longUnit
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
      </div>
    </>
  )
}

export default FichaTecnica
