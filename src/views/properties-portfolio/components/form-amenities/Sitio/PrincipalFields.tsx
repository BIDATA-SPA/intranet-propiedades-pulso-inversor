/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input, InputGroup, Select, Switcher } from '@/components/ui'
import Addon from '@/components/ui/InputGroup/Addon'

import { RichTextEditor } from '@/components/shared'
import { injectReducer } from '@/store'
import {
  filterGeography,
  filterOrientation,
} from '@/utils/types/new-property/constants'
import { Field, FieldProps } from 'formik'
import { TbWorldSearch } from 'react-icons/tb'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const PrincipalFields = ({ values, errors, touched }: FieldNameProps) => {
  return (
    <>
      <div className="w-full">
        {/* externalLink ✅ */}
        <FormItem
          label="Enlace de la propiedad publicada en otros portales (Enlace público)."
          className="border-2 p-3 rounded-lg dark:border-gray-600"
          invalid={errors.externalLink && touched.externalLink}
          errorMessage={errors.externalLink}
        >
          <Field name="externalLink">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Input
                  prefix={<TbWorldSearch className="text-xl" />}
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2 border-sky-500/60 border-[3px] rounded-lg"
                  placeholder="Ej: https://www.portalinmobiliario.com/detalles-de-mi-publicacion"
                  value={values.externalLink}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Rol">
          <Field name="characteristics.rol">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder=""
                  value={values.characteristics?.rol}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        {/* surface ✅ */}
        <FormItem
          label="Superficie de terreno"
          invalid={
            errors.characteristics?.surface && touched.characteristics?.surface
          }
          errorMessage={errors.characteristics?.surface}
        >
          <Field name="characteristics.surface">
            {({ field, form }: FieldProps) => {
              return (
                <InputGroup>
                  <Input
                    type="number"
                    field={field}
                    size="md"
                    placeholder="Ej: 200 - 100.5"
                    value={values.characteristics?.surface}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                  <Addon size="md">m2</Addon>
                </InputGroup>
              )
            }}
          </Field>
        </FormItem>

        {/* constructedSurface surface ✅ */}
        <FormItem
          label="Superficie total construida"
          invalid={
            errors.characteristics?.constructedSurface &&
            touched.characteristics?.constructedSurface
          }
          errorMessage={errors.characteristics?.constructedSurface}
        >
          <Field name="characteristics.constructedSurface">
            {({ field, form }: FieldProps) => {
              return (
                <InputGroup>
                  <Input
                    type="number"
                    field={field}
                    size="md"
                    placeholder="Ej: 180 - 80.5"
                    value={values.characteristics?.constructedSurface}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                  <Addon size="md">m2</Addon>
                </InputGroup>
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="M. Frente">
          <Field name="characteristics.frontageMeters">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: 10"
                  value={values.characteristics?.frontageMeters}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="M. Fondo">
          <Field name="characteristics.deepMeters">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: 10"
                  value={values.characteristics?.deepMeters}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Geografía">
          <Field name="characteristics.geography">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterGeography}
                  placeholder="Seleccionar..."
                  value={filterGeography?.filter(
                    (option) =>
                      option.value === values.characteristics?.geography
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Urbanizado">
          <Field name="characteristics.isUrbanized">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.isUrbanized}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.isUrbanized
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="Orientación"
          invalid={
            errors.characteristics?.orientation &&
            touched.characteristics?.orientation
          }
        >
          <Field name="characteristics.orientation">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterOrientation}
                  placeholder="Seleccionar..."
                  value={filterOrientation?.filter(
                    (option) =>
                      option.value === values.characteristics.orientation
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Superfice Plana">
          <Field name="characteristics.hasFlatSurface">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasFlatSurface}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasFlatSurface
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <div className="w-full grid grid-cols-1 gap-3">
        <FormItem
          asterisk
          label="Titulo de la Propiedad"
          invalid={
            errors.characteristics?.propertyTitle &&
            touched.characteristics?.propertyTitle
          }
          errorMessage={errors.characteristics?.propertyTitle}
        >
          <Field name="characteristics.propertyTitle">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2"
                  placeholder="Ingresar un titulo"
                  value={values.characteristics?.propertyTitle}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          asterisk
          label="Descripción de la Propiedad"
          className="mb-6"
          invalid={
            errors.characteristics?.propertyDescription &&
            touched.characteristics?.propertyDescription
          }
          errorMessage={errors.characteristics?.propertyDescription}
        >
          <Field name="characteristics.propertyDescription">
            {({ field, form }: FieldProps) => (
              <RichTextEditor
                value={field.value}
                placeholder="Ingresar una descripción de la propiedad..."
                onChange={(val) => {
                  form.setFieldValue(field.name, val)
                }}
              />
            )}
          </Field>
        </FormItem>
      </div>
    </>
  )
}

export default PrincipalFields
