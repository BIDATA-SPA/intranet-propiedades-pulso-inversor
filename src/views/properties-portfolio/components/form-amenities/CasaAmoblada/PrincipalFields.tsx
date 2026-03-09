/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input, InputGroup, Select } from '@/components/ui'
import Addon from '@/components/ui/InputGroup/Addon'
import Switcher from '@/components/ui/Switcher'

import { RichTextEditor } from '@/components/shared'
import { injectReducer } from '@/store'
import {
  filterAccessToParkingCoverage,
  filterBathrooms,
  filterBedrooms,
  filterFloors,
  filterOrientation,
  filterParkingSpaces,
  filterStorageCount,
  filterTerraces,
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

        <FormItem label="Terraza(s)">
          <Field name="characteristics.terraces">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterTerraces}
                  placeholder="Seleccionar..."
                  value={filterTerraces?.filter(
                    (option) => option.value === values.characteristics.terraces
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="M2 Terraza"
          invalid={
            errors.characteristics?.terraceM2 &&
            touched.characteristics?.terraceM2
          }
          errorMessage={errors.characteristics?.terraceM2}
        >
          <Field name="characteristics.terraceM2">
            {({ field, form }: FieldProps) => {
              return (
                <InputGroup>
                  <Input
                    type="number"
                    field={field}
                    size="md"
                    placeholder="Ej: 20 - 10.5"
                    value={values.characteristics?.terraceM2}
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

        <FormItem label="Número de pisos">
          <Field name="characteristics.numberOfFloors">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterFloors}
                  placeholder="Seleccionar..."
                  value={filterFloors?.filter(
                    (option) =>
                      option.value === values.characteristics.numberOfFloors
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Baño(s)">
          <Field name="characteristics.bathrooms">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterBathrooms}
                  placeholder="Seleccionar..."
                  value={filterBathrooms?.filter(
                    (option) =>
                      option.value === values.characteristics.bathrooms
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Dormitorio(s)">
          <Field name="characteristics.bedrooms">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterBedrooms}
                  placeholder="Seleccionar..."
                  value={filterBedrooms?.filter(
                    (option) =>
                      option.value === values.characteristics?.bedrooms
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="¿En condominio?">
          <Field name="characteristics.locatedInCondominium">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.locatedInCondominium}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.locatedInCondominium
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Amoblada">
          <Field name="characteristics.isFurnished">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values?.characteristics?.isFurnished}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.isFurnished
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="$ GGCC">
          <Field name="characteristics.ggcc">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder=""
                  value={values.characteristics?.ggcc}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Incluye Agua Caliente">
          <Field name="characteristics.hasHotWater">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasHotWater}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasHotWater
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Estacionamiento">
          <Field name="characteristics.hasParking">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasParking}
                  onChange={() => {
                    if (field.name) {
                      form.setFieldValue(
                        'characteristics.numberOfParkingSpaces',
                        ''
                      )
                    }

                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasParking
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        {values.characteristics.hasParking && (
          <FormItem label="Estacionamiento(s)">
            <Field name="characteristics.numberOfParkingSpaces">
              {({ field, form }: FieldProps) => {
                return (
                  <Select
                    isClearable
                    field={field}
                    isDisabled={!values.characteristics.hasParking}
                    options={filterParkingSpaces}
                    placeholder="Seleccionar..."
                    value={filterParkingSpaces?.filter(
                      (option) =>
                        option.value ===
                        values.characteristics?.numberOfParkingSpaces
                    )}
                    onChange={(option) => {
                      form.setFieldValue(field.name, option?.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>
        )}

        <FormItem label="Tipo de Covertura/Estacionamiento">
          <Field name="characteristics.typeOfParkingCoverage">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterAccessToParkingCoverage}
                  placeholder="Seleccionar..."
                  value={filterAccessToParkingCoverage?.filter(
                    (option) =>
                      option.value ===
                      values.characteristics?.typeOfParkingCoverage
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Número de pisos">
          <Field name="characteristics.numberOfFloors">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterFloors}
                  placeholder="Seleccionar..."
                  value={filterFloors?.filter(
                    (option) =>
                      option.value === values.characteristics.numberOfFloors
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Número de piso de la unidad">
          <Field name="characteristics.floorNumber">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 12"
                  value={values.characteristics?.floorNumber}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Departamentos por Piso">
          <Field name="characteristics.apartmentsPerFloor">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 2"
                  value={values.characteristics?.apartmentsPerFloor}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Bodegas">
          <Field name="characteristics.storageCount">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterStorageCount}
                  placeholder="Seleccionar..."
                  value={filterStorageCount?.filter(
                    (option) =>
                      option.value === values.characteristics?.storageCount
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
