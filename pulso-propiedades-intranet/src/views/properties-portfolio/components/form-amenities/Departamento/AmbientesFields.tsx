/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import Switcher from '@/components/ui/Switcher'
import { injectReducer } from '@/store'
import { filterTypeOfKitchens } from '@/utils/types/new-property/constants'
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
      <div className="w-full grid grid-cols-1 gap-0 md:grid-cols-2 xl:grid-cols-3 md:gap-3">
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
        {/* hasKitchen ✅ */}
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
        <FormItem label="Patio">
          <Field name="characteristics.hasYard">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasYard}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasYard
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
        <FormItem label="Mansarda">
          <Field name="characteristics.hasMansard">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasMansard}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasMansard
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Balcón">
          <Field name="characteristics.hasBalcony">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasBalcony}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasBalcony
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <FormItem label="Closets">
          <Field name="characteristics.hasClosets">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasClosets}
                  className="my-3"
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
        <FormItem label="Dormitorio en Suite">
          <Field name="characteristics.hasSuite">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasSuite}
                  className="my-3"
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
                  className="my-3"
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
        <FormItem label="Playroom">
          <Field name="characteristics.hasPlayground">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasPlayground}
                  className="my-3"
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
        <FormItem label="Caballeriza">
          <Field name="characteristics.hasHorseStable">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics?.hasHorseStable}
                  className="my-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasHorseStable
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
