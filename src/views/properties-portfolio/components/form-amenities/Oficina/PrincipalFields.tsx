/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Input, InputGroup, Select, Switcher } from '@/components/ui'

import { RichTextEditor } from '@/components/shared'
import Addon from '@/components/ui/InputGroup/Addon'
import { injectReducer } from '@/store'
import {
  filterBathrooms,
  filterFloors,
  filterOrientation,
  filterStorageCount,
  filterTerraces,
  filterTypeOfHeating,
  filterTypeOfKitchens,
  filterTypeOfSecurity,
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

        <FormItem label="Sala de Reuniones">
          <Field name="characteristics.hasMeetingRooms">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasMeetingRooms}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasMeetingRooms
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Número de Oficinas">
          <Field name="characteristics.officesPerFloor">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  className="mb-2"
                  placeholder="Ej: 12"
                  value={values.characteristics?.officesPerFloor}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Número de privados">
          <Field name="characteristics.numberOfPrivate">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 2"
                  value={values?.characteristics?.numberOfPrivate}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
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

        <FormItem label="Número de piso de la unidad">
          <Field name="characteristics.floorNumber">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  className="mb-2"
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

        <FormItem
          label="Número de Piso(s)"
          invalid={
            errors.characteristics?.numberOfFloors &&
            touched.characteristics?.numberOfFloors
          }
          errorMessage={errors.characteristics?.numberOfFloors}
        >
          <Field name="characteristics.numberOfFloors">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterFloors}
                  placeholder="Seleccionar"
                  value={filterFloors?.filter(
                    (option) =>
                      option.value === values.characteristics?.numberOfFloors
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

      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Cocina">
          <Field name="characteristics.hasKitchen">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics.hasKitchen}
                  className="my-3"
                  onChange={() => {
                    if (values.characteristics.hasKitchen) {
                      form.setFieldValue('characteristics.typeOfKitchen', '')
                    }
                    form.setFieldValue(
                      field.name,
                      !values.characteristics.hasKitchen
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Tipo de Cocina">
          <Field name="characteristics.typeOfKitchen">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  isDisabled={!values.characteristics?.hasKitchen}
                  field={field}
                  options={filterTypeOfKitchens}
                  placeholder="Seleccionar..."
                  value={filterTypeOfKitchens?.filter(
                    (option) =>
                      option.value === values.characteristics?.typeOfKitchen
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

      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Hall de Acceso">
          <Field name="characteristics.hasEntryHall">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values?.characteristics?.hasEntryHall}
                  className="mt-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values?.characteristics?.hasEntryHall
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Kitchenette">
          <Field name="characteristics.hasKitchenet">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values?.characteristics?.hasKitchenet}
                  className="mt-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values?.characteristics?.hasKitchenet
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Comedor">
          <Field name="characteristics.hasDiningRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasDiningRoom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasDiningRoom
                    )
                  }}
                />
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

        <FormItem label="Cowork">
          <Field name="characteristics.hasCowork">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasCowork}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasCowork
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Planta Libre">
          <Field name="characteristics.hasFreeFloor">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasFreeFloor}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasFreeFloor
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

        <FormItem label="Sala de Estar">
          <Field name="characteristics.hasLivingRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasLivingRoom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasLivingRoom
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Aire acondicionado">
          <Field name="characteristics.hasAirConditioning">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasAirConditioning}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasAirConditioning
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Calefacción">
          <Field name="characteristics.hasHeating">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics.hasHeating}
                  className="my-3"
                  onChange={() => {
                    if (values.characteristics.hasHeating) {
                      form.setFieldValue('characteristics.typeOfHeating', '')
                    }
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasHeating
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Tipo" className="relative">
          <Field name="characteristics.typeOfHeating">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  isDisabled={!values.characteristics?.hasHeating}
                  field={field}
                  options={filterTypeOfHeating}
                  placeholder="Seleccionar"
                  value={filterTypeOfHeating?.filter(
                    (option) =>
                      option.value === values.characteristics?.typeOfHeating
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
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

        <FormItem label="Áreas verdes">
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

        <FormItem label="Rampa para silla de Ruedas">
          <Field name="characteristics.hasWheelchairRamp">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasWheelchairRamp}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasWheelchairRamp
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem label="Seguridad">
          <Field name="characteristics.hasSecurity">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSecurity}
                  className="my-3"
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
