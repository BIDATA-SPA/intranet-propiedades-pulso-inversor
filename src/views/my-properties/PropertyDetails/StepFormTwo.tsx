/* eslint-disable react-hooks/exhaustive-deps */
import { RichTextEditor } from '@/components/shared'
import { FormItem, Input, InputGroup, Select, Switcher } from '@/components/ui'
import Addon from '@/components/ui/InputGroup/Addon'
import { CreatePropertyFormModel } from '@/services/properties/types/property.type'
import { useAppSelector } from '@/store'
import { useCopyToClipboard } from '@/utils/hooks/useCopyToClipboard'
import {
  filterBathrooms,
  filterBedrooms,
  filterFloors,
  filterTerraces,
  filterTypeOfHeating,
  filterTypeOfKitchens,
  filterTypeOfSecurity,
} from '@/utils/types/new-property/constants'
import { TSelect } from '@/utils/types/new-property/selects'
import { Field, FieldProps } from 'formik'
import { Dispatch, useCallback, useEffect, useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi'
import { TbWorldSearch } from 'react-icons/tb'
import {
  ContentPublishedProperty,
  ContentTypeOfHeating,
  ContentTypeOfKitchen,
} from '../NewProperty/PropertyForm/components/dialogs/ContentDialog'
import ShowDialog from '../NewProperty/PropertyForm/components/dialogs/ShowDialog'
import CommercialPremisesFields from './components/fields/CommercialPremisesFields'
import OfficeFields from './components/fields/OfficeFields'

export type FormModel = CreatePropertyFormModel

const StepFormTwo = ({ values, touched, errors, setValues }) => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const [dialogTypeCaleIsOpen, setTypeCaleIsOpen] = useState<boolean>(false)
  const [dialogTypeOfKitchen, setDialogTypeOfKitchen] = useState<boolean>(false)
  const [dialogPublishedProperty, setDialogPublishedProperty] =
    useState<boolean>(false)
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const openDialog = useCallback(
    (setter: Dispatch<React.SetStateAction<boolean>>) => {
      setter(true)
    },
    []
  )

  const closeDialog = useCallback(
    (setter: Dispatch<React.SetStateAction<boolean>>) => {
      setter(false)
    },
    []
  )

  // Funtion to reset selects
  const resetValues = useCallback(
    (switcher: boolean | undefined, key: string) => {
      if (!switcher && values.characteristics[key] !== '') {
        setValues((prevValues) => ({
          ...prevValues,
          characteristics: {
            ...prevValues.characteristics,
            [key]: '',
          },
        }))
      }
    },
    [setValues, values.characteristics]
  )

  const resetArrayTypes = useCallback(() => {
    if (!values.characteristics?.hasSecurity) {
      setValues((prevValues) => ({
        ...prevValues,
        characteristics: {
          ...prevValues.characteristics,
          typeOfSecurity: [],
        },
      }))
    }
  }, [values.characteristics?.hasSecurity, setValues])

  const handleCopyClick = () => {
    if (values.externalLink) {
      copyToClipboard(values.externalLink)
    }
  }

  useEffect(() => {
    resetArrayTypes()
  }, [values.characteristics?.hasSecurity])

  useEffect(() => {
    resetValues(values.characteristics?.hasKitchen, 'typeOfKitchen')
    resetValues(values.characteristics?.hasHeating, 'typeOfHeating')
  }, [
    values.characteristics?.hasKitchen,
    values.characteristics?.hasHeating,
    values.characteristics?.hasSecurity,
    values.characteristics?.typeOfKitchen,
    values.characteristics?.typeOfHeating,
    resetValues,
  ])

  return (
    <>
      {userAuthority === 2 ? (
        <FormItem
          label="Enlace de la propiedad publicada en otros portales (Enlace público)."
          className="border-2 p-3 rounded-lg dark:border-gray-600"
          invalid={errors.step2?.externalLink && touched.step2?.externalLink}
          errorMessage={errors.step2?.externalLink}
        >
          <div className="absolute top-2 bottom-0 right-2">
            <button
              type="button"
              className="border-none bg-transparent"
              onClick={() => openDialog(setDialogPublishedProperty)}
            >
              <HiInformationCircle size={20} />
            </button>
          </div>
          <Field name="step2.externalLink">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  prefix={<TbWorldSearch className="text-xl" />}
                  field={field}
                  type="text"
                  size="md"
                  className="mb-2 border-sky-500/60 border-[3px] rounded-lg"
                  placeholder="Ej: https://www.portalinmobiliario.com/detalles-de-mi-publicacion"
                  value={values?.step2?.externalLink}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 md:grid-cols-2 md:gap-3 mt-4 place-content-center justify-items-center text-center">
        <FormItem label="¿En condominio?">
          <Field name="characteristics.locatedInCondominium">
            {({ field, form }: FieldProps<FormModel>) => {
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

        <FormItem label="Destacar Propiedad">
          <Field name="highlighted">
            {({ field, form }: FieldProps<FormModel>) => {
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

      {userAuthority === 2 ? (
        <div className="w-full">
          <FormItem
            label="Observación y/o detalles"
            invalid={errors.observations && touched.observations}
            errorMessage={errors.observations}
          >
            <Field name="observations">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Input
                    textArea
                    field={field}
                    size="md"
                    placeholder="Ingresa algo que necesita saber el comprador: Año de Propiedad, Ubicación cerca de..."
                    value={values.observations}
                    onChange={(e) => {
                      form.setFieldValue(field.name, e.target.value)
                    }}
                  />
                )
              }}
            </Field>
          </FormItem>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
        <FormItem
          label="Superficie de terreno"
          invalid={
            errors.characteristics?.surface && touched.characteristics?.surface
          }
          errorMessage={errors.characteristics?.surface}
        >
          <Field name="characteristics.surface">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <InputGroup>
                  <Input
                    type="text"
                    field={field}
                    size="md"
                    placeholder="Ej: 200"
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
          label="Superficie construida"
          invalid={
            errors.characteristics?.constructedSurface &&
            touched.characteristics?.constructedSurface
          }
          errorMessage={errors.characteristics?.constructedSurface}
        >
          <Field name="characteristics.constructedSurface">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <InputGroup>
                  <Input
                    type="text"
                    field={field}
                    size="md"
                    placeholder="Ej: 200"
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
      </div>
      {values?.typeOfPropertyId === 'Local Comercial' && (
        <CommercialPremisesFields values={values} />
      )}
      {values?.typeOfPropertyId === 'Oficina' && (
        <OfficeFields values={values} />
      )}
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
        <FormItem
          label="Piso(s)"
          invalid={
            errors.characteristics?.floors && touched.characteristics?.floors
          }
          errorMessage={errors.characteristics?.floors}
        >
          <Field name="characteristics.floors">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterFloors}
                  placeholder="Seleccionar"
                  value={filterFloors?.filter(
                    (option: TSelect) =>
                      option.value === values.characteristics?.floors
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="Terraza(s)"
          invalid={
            errors.characteristics?.terraces &&
            touched.characteristics?.terraces
          }
          errorMessage={errors.characteristics?.terraces}
        >
          <Field name="characteristics.terraces">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterTerraces}
                  placeholder="Seleccionar"
                  value={filterTerraces?.filter(
                    (option: TSelect) =>
                      option.value === values.characteristics?.terraces
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
        <FormItem
          label="Baño(s)"
          invalid={
            errors.characteristics?.bathrooms &&
            touched.characteristics?.bathrooms
          }
          errorMessage={errors.characteristics?.bathrooms}
        >
          <Field name="characteristics.bathrooms">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterBathrooms}
                  placeholder="Seleccionar"
                  value={filterBathrooms?.filter(
                    (option: TSelect) =>
                      option.value === values.characteristics?.bathrooms
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="Dormitorio(s)"
          invalid={
            errors.characteristics?.bedrooms &&
            touched.characteristics?.bedrooms
          }
          errorMessage={errors.characteristics?.bedrooms}
        >
          <Field name="characteristics.bedrooms">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  field={field}
                  options={filterBedrooms}
                  placeholder="Seleccionar"
                  value={filterBedrooms?.filter(
                    (option: TSelect) =>
                      option.value === values.characteristics?.bedrooms
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>
      <div className="grid grid-cols-2 gap-0 md:gap-3">
        <FormItem
          label="Cocina(s)"
          className="flex justify-items-center items-start md:items-center"
        >
          <Field name="characteristics.hasKitchen">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasKitchen}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasKitchen
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="Tipo"
          invalid={
            errors.characteristics?.typeOfKitchen &&
            touched.characteristics?.typeOfKitchen
          }
          errorMessage={errors.characteristics?.typeOfKitchen}
        >
          <div className="absolute top-0 bottom-0 right-0">
            <button
              type="button"
              className="border-none bg-transparent"
              onClick={() => openDialog(setDialogTypeOfKitchen)}
            >
              <HiInformationCircle size={20} />
            </button>
          </div>
          <Field name="characteristics.typeOfKitchen">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  isDisabled={!values.characteristics?.hasKitchen}
                  field={field}
                  options={filterTypeOfKitchens}
                  placeholder="Seleccionar"
                  value={filterTypeOfKitchens?.filter(
                    (option: TSelect) =>
                      option.value === values.characteristics?.typeOfKitchen
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>
      <div className="grid grid-cols-2 gap-0 md:gap-3">
        <FormItem
          label="Calefacción"
          className="flex justify-items-center items-start md:items-center"
        >
          <Field name="characteristics.hasHeating">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasHeating}
                  className="my-3"
                  onChange={() => {
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

        <FormItem
          label="Tipo"
          invalid={
            errors.characteristics?.typeOfHeating &&
            touched.characteristics?.typeOfHeating
          }
          errorMessage={errors.characteristics?.typeOfHeating}
          className="relative"
        >
          <div className="absolute top-0 bottom-0 right-0">
            <button
              type="button"
              className="border-none bg-transparent"
              onClick={() => openDialog(setTypeCaleIsOpen)}
            >
              <HiInformationCircle size={20} />
            </button>
          </div>
          <Field name="characteristics.typeOfHeating">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Select
                  isClearable
                  isDisabled={!values.characteristics?.hasHeating}
                  field={field}
                  options={filterTypeOfHeating}
                  placeholder="Seleccionar"
                  value={filterTypeOfHeating?.filter(
                    (option: TSelect) =>
                      option.value === values.characteristics?.typeOfHeating
                  )}
                  onChange={(option: TSelect) => {
                    form.setFieldValue(field.name, option?.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>
      <div className="grid grid-cols-2 gap-0 md:gap-3">
        <FormItem
          label="Seguridad"
          className="flex justify-items-center items-start md:items-center"
        >
          <Field name="characteristics.hasSecurity">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSecurity}
                  className="my-3"
                  onChange={() => {
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

        <FormItem
          label="Tipo"
          invalid={
            errors.characteristics?.typeOfSecurity &&
            touched.characteristics?.typeOfSecurity
          }
          errorMessage={errors.characteristics?.typeOfSecurity}
          className="relative"
        >
          <Field name="characteristics.typeOfSecurity">
            {({ field, form }: FieldProps<FormModel>) => {
              const transformedOptions =
                values.characteristics?.typeOfSecurity?.map((option) => ({
                  value: option,
                  label: option,
                }))

              return (
                <Select
                  isMulti
                  isClearable
                  isDisabled={!values.characteristics?.hasSecurity}
                  placeholder="Seleccionar"
                  value={transformedOptions}
                  options={filterTypeOfSecurity}
                  onChange={(options) => {
                    const newValues = options.map((opt) => opt?.value)
                    form.setFieldValue(field.name, newValues)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-0 md:gap-3 place-content-start md:place-content-center justify-items-start md:justify-items-center text-start md:text-center">
        <FormItem label="Amoblada">
          <Field name="characteristics.isFurnished">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Switcher
                  checked={values.characteristics?.isFurnished}
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

        <FormItem label="A. acondicionado">
          <Field name="characteristics.hasAirConditioning">
            {({ field, form }: FieldProps<FormModel>) => {
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
            {({ field, form }: FieldProps<FormModel>) => {
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

        <FormItem label="Estacionamiento(s)">
          <Field name="characteristics.hasParking">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasParking}
                  className="my-3"
                  onChange={() => {
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

        <FormItem label="Ascensor">
          <Field name="characteristics.hasElevator">
            {({ field, form }: FieldProps<FormModel>) => {
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

        <FormItem label="Gimnasio">
          <Field name="characteristics.hasGym">
            {({ field, form }: FieldProps<FormModel>) => {
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

        <FormItem label="Piscina">
          <Field name="characteristics.hasSwimmingPool">
            {({ field, form }: FieldProps<FormModel>) => {
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

        <FormItem label="Quincho">
          <Field name="characteristics.hasBarbecueArea">
            {({ field, form }: FieldProps<FormModel>) => {
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
      </div>
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
          {({ field, form }: FieldProps<FormModel>) => {
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
      <FormItem label="Descripción de la Propiedad" className="relative">
        {values.characteristics?.propertyDescription && (
          <Field
            name="characteristics.propertyDescription"
            className="relative z-10"
          >
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <RichTextEditor
                  value={values.characteristics?.propertyDescription}
                  placeholder="Ingresar una descripción de la propiedad..."
                  onChange={(val) => {
                    form.setFieldValue(field.name, val)
                  }}
                />
              )
            }}
          </Field>
        )}
      </FormItem>
      {/* Kitchen type dialog */}
      <ShowDialog
        title="Tipos de cocina"
        isOpen={dialogTypeOfKitchen}
        Content={<ContentTypeOfKitchen />}
        closable={false}
        onClose={() => closeDialog(setDialogTypeOfKitchen)}
        onRequestClose={() => closeDialog(setDialogTypeOfKitchen)}
      />
      {/* Heating type dialog */}
      <ShowDialog
        title="Tipos de calefacción"
        isOpen={dialogTypeCaleIsOpen}
        closable={false}
        Content={<ContentTypeOfHeating />}
        onClose={() => closeDialog(setTypeCaleIsOpen)}
        onRequestClose={() => closeDialog(setTypeCaleIsOpen)}
      />
      {/* External published property */}
      <ShowDialog
        closable
        title="Información sobre este campo"
        isOpen={dialogPublishedProperty}
        Content={<ContentPublishedProperty />}
        onClose={() => closeDialog(setDialogPublishedProperty)}
        onRequestClose={() => closeDialog(setDialogPublishedProperty)}
      />
    </>
  )
}

export default StepFormTwo
