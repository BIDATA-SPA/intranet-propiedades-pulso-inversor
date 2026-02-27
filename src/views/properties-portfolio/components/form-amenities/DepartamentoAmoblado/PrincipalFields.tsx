/* eslint-disable @typescript-eslint/no-explicit-any */
import { RichTextEditor } from '@/components/shared'
import { FormItem, Input, InputGroup, Select } from '@/components/ui'
import Addon from '@/components/ui/InputGroup/Addon'
import Switcher from '@/components/ui/Switcher'
import { injectReducer } from '@/store'
import {
  filterBathrooms,
  filterBedrooms,
  filterCeilingType,
  filterFlooringType,
  filterFloors,
  filterGeography,
  filterLandShape,
  filterOrientation,
  filterParkingSpaces,
  filterStorageCount,
  filterTerraces,
  filterTypeOfBuilding,
  filterTypeOfHeating,
} from '@/utils/types/new-property/constants'
import { Field, FieldProps } from 'formik'
import { TbWorldSearch } from 'react-icons/tb'
import reducer, { useAppSelector } from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const PrincipalFields = ({ values, errors, touched }: FieldNameProps) => {
  const formData = useAppSelector(
    (state) => state.accountDetailForm.data.formData
  )

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

        {/* numberOfFloors ✅ */}
        <FormItem
          label="Número de pisos"
          asterisk={
            formData.informacionPrincipal.typeOfPropertyId === 'Casa' ||
            formData.informacionPrincipal.typeOfPropertyId === 'Departamento'
          }
          invalid={
            errors.characteristics?.numberOfFloors &&
            touched.characteristics?.numberOfFloors
          }
        >
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

        {/* terraces ✅ */}
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

        {/* terraceM2 ✅ */}
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

        <FormItem label="Gastos Comunes">
          <Field name="characteristics.commonExpenses">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder="Aprox."
                  value={values.characteristics?.commonExpenses}
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
        {/* bathrooms ✅ */}
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

        {/* bedrooms ✅ */}
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
        <FormItem label="Nombre Edificio">
          <Field name="characteristics.buildingName">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  type="text"
                  field={field}
                  size="md"
                  placeholder=""
                  value={values.characteristics?.buildingName}
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
        <FormItem label="Forma del Terreno">
          <Field name="characteristics.landShape">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterLandShape}
                  placeholder="Seleccionar..."
                  value={filterLandShape?.filter(
                    (option) =>
                      option.value === values.characteristics?.landShape
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Cielo/Techo">
          <Field name="characteristics.ceilingType">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterCeilingType}
                  placeholder="Seleccionar..."
                  value={filterCeilingType?.filter(
                    (option) =>
                      option.value === values.characteristics?.ceilingType
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Tipo Piso">
          <Field name="characteristics.flooringType">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterFlooringType}
                  placeholder="Seleccionar..."
                  value={filterFlooringType?.filter(
                    (option) =>
                      option.value === values.characteristics?.flooringType
                  )}
                  onChange={(option) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Tipo Edificio">
          <Field name="characteristics.typeOfBuilding">
            {({ field, form }: FieldProps) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterTypeOfBuilding}
                  placeholder="Seleccionar..."
                  value={filterTypeOfBuilding?.filter(
                    (option) =>
                      option.value === values.characteristics?.typeOfBuilding
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

      {/* locatedInCondominium ✅ */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
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

        {/* highlighted ✅ */}
        <FormItem label="Destacar Propiedad">
          <Field name="highlighted">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.highlighted}
                  onChange={() => {
                    form.setFieldValue(field.name, !values.highlighted)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
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
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem label="Amoblada">
          <Field name="characteristics.isFurnished">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values?.characteristics?.isFurnished}
                  className="my-3"
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
        <FormItem label="Garage">
          <Field name="characteristics.hasGarage">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasGarage}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasGarage
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Loggia">
          <Field name="characteristics.hasLoggia">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasLoggia}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasLoggia
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem label="Estacionamiento">
          <Field name="characteristics.hasParking">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasParking}
                  className="my-3"
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
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
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
        <FormItem label="Pieza de Servicio">
          <Field name="characteristics.hasServiceRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasServiceRoom}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasServiceRoom
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Escritorio (HomeOffice)">
          <Field name="characteristics.hasHomeOffice">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasHomeOffice}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasHomeOffice
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
