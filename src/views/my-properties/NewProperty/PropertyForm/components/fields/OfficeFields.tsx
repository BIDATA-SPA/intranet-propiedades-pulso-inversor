/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { Field, FieldProps } from 'formik'
import { FormModel } from '../../PropertyForm'

interface FieldNameProps {
  values?: any
}

/**
 * numberOfPrivate: number
 * numberOfVacantFloors: number
 * numberOfMeetingRooms: number
 * hasKitchenet: boolean
 *
 *
 * hasHouse
 *
 * locatedInGallery: boolean
 * locatedFacingTheStreet: boolean
 * floorLevelLocation: 1 | 2 | 3 (number)
 * commonExpenses: number
 * officeNumber:string
 */

const OfficeFields = ({ values }: FieldNameProps) => {
  return (
    <div className="border bg-gray-50/50 p-4 rounded-lg mb-6">
      <div className="mb-3">
        <h4 className="font-semibold text-md">Información de Oficina</h4>
        <p className="font-noraml text-md">
          Completa la información correspondiente al inmueble.
        </p>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem label="Número de privados">
          <Field name="step2.characteristics.numberOfPrivate">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 2"
                  value={values?.step2?.characteristics?.numberOfPrivate}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Planta libre">
          <Field name="step2.characteristics.numberOfVacantFloors">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 2"
                  value={values?.step2?.characteristics?.numberOfVacantFloors}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem label="Sala de reuniones">
          <Field name="step2.characteristics.numberOfMeetingRooms">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 2"
                  value={values?.step2?.characteristics?.numberOfMeetingRooms}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="Kitchenette"
          className="flex justify-items-center items-center"
        >
          <Field name="step2.characteristics.hasKitchenet">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Switcher
                  checked={values?.step2?.characteristics?.hasKitchenet}
                  className="mt-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values?.step2?.characteristics?.hasKitchenet
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
      </div>
      <Alert showIcon closable type="info" title="Información!">
        Esta opción se habilitará siempre y cuando el tipo de inmueble
        seleccionado sea <strong>{`"Oficina"`}</strong>.
      </Alert>
    </div>
  )
}

export default OfficeFields
