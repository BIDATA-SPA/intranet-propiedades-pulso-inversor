/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import Input from '@/components/ui/Input'
import Switcher from '@/components/ui/Switcher'
import { Field, FieldProps } from 'formik'

const OfficeFields = ({ values, errors, touched }) => {
  return (
    <div className="border bg-gray-50/50 p-4 rounded-lg mb-6">
      <div className="mb-3">
        <h6>Información de Oficina</h6>
        <p>Completa la información correspondiente al inmueble.</p>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-4 gap-3">
        <FormItem
          label="Número de privados"
          invalid={
            errors.characteristics?.numberOfPrivate &&
            touched.characteristics?.numberOfPrivate
          }
          errorMessage={errors.characteristics?.numberOfPrivate}
        >
          <Field name="characteristics.numberOfPrivate">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 2"
                  value={values.characteristics.numberOfPrivate}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="Planta libre"
          invalid={
            errors.characteristics?.numberOfVacantFloors &&
            touched.characteristics?.numberOfVacantFloors
          }
          errorMessage={errors.characteristics?.numberOfVacantFloors}
        >
          <Field name="characteristics.numberOfVacantFloors">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 2"
                  value={values.characteristics.numberOfVacantFloors}
                  onChange={(e) => {
                    form.setFieldValue(field.name, e.target.value)
                  }}
                />
              )
            }}
          </Field>
        </FormItem>

        <FormItem
          label="Sala de reuniones"
          invalid={
            errors.characteristics?.numberOfMeetingRooms &&
            touched.characteristics?.numberOfMeetingRooms
          }
          errorMessage={errors.characteristics?.numberOfMeetingRooms}
        >
          <Field name="characteristics.numberOfMeetingRooms">
            {({ field, form }: FieldProps) => {
              return (
                <Input
                  field={field}
                  type="number"
                  size="md"
                  placeholder="Ej: 2"
                  value={values.characteristics.numberOfMeetingRooms}
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
          <Field name="characteristics.hasKitchenet">
            {({ field, form }: FieldProps) => {
              return (
                <Switcher
                  checked={values.characteristics.hasKitchenet}
                  className="mt-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values.characteristics?.hasKitchenet
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
