/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import Switcher from '@/components/ui/Switcher'
import { injectReducer } from '@/store'
import {
  filterTypeOfHeating,
  filterTypeOfKitchens,
} from '@/utils/types/new-property/constants'
import { Field, FieldProps } from 'formik'
import reducer from '../../../store'

injectReducer('accountDetailForm', reducer)

interface FieldNameProps {
  errors: any
  touched: any
  values: any
}

const AmbientesFields = ({ values }: FieldNameProps) => {
  return (
    <>
      <div className="border-b mb-4">
        <h3 className="text-lg">Amenidades</h3>
      </div>

      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Sala de Estar">
          <Field name="characteristics.hasLivingRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasLivingRoom}
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

        <FormItem label="Cocina">
          <Field name="characteristics.hasKitchen">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics.hasKitchen}
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

        <FormItem label="Comedor">
          <Field name="characteristics.hasDiningRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasDiningRoom}
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

        <FormItem label="Refrigerador">
          <Field name="characteristics.hasRefrigerator">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasRefrigerator}
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

        <FormItem label="Conexión para Lavarropas">
          <Field name="characteristics.hasWashingMachineConnection">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasWashingMachineConnection}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasWashingMachineConnection
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Dormitorio en Suite">
          <Field name="characteristics.hasSuite">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSuite}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasSuite
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Walk-in closet">
          <Field name="characteristics.hasWalkInCloset">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasWalkInCloset}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasWalkInCloset
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Closet">
          <Field name="characteristics.hasClosets">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasClosets}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasClosets
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

        <FormItem label="Playroom">
          <Field name="characteristics.hasPlayground">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasPlayground}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasPlayground
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="HomeOffice">
          <Field name="characteristics.hasHomeOffice">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasHomeOffice}
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

        <FormItem label="Baño de Visitas">
          <Field name="characteristics.hasGuestBathroom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasGuestBathroom}
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

        <FormItem label="Aire acondicionado">
          <Field name="characteristics.hasAirConditioning">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasAirConditioning}
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

        {/* aca */}
      </div>

      <div className="border-b mb-4">
        <h3 className="text-lg">Amenidades exterior</h3>
      </div>

      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
        <FormItem label="Jacuzzi">
          <Field name="characteristics.hasJacuzzi">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasJacuzzi}
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

        <FormItem label="Piscina">
          <Field name="characteristics.hasSwimmingPool">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSwimmingPool}
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
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasBarbecueArea}
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

        <FormItem label="Gimnasio">
          <Field name="characteristics.hasGym">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasGym}
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

        <FormItem label="Sauna">
          <Field name="characteristics.hasSauna">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSauna}
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

        <FormItem label="Lavandería">
          <Field name="characteristics.hasLaundryRoom">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasLaundryRoom}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasLaundryRoom
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

        <FormItem label="Azotea">
          <Field name="characteristics.hasRooftop">
            {({ field, form }: FieldProps<any>) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasRooftop}
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasRooftop
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
    </>
  )
}

export default AmbientesFields
