/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import Switcher from '@/components/ui/Switcher'
import { Field, FieldProps } from 'formik'
import { FormModel } from '../../StepFormFour'

interface FieldNameProps {
  values?: any
}

const PlotFields = ({ values }: FieldNameProps) => {
  return (
    <div className="w-full border bg-gray-50/50 p-4 rounded-lg mb-6 flex flex-col justify-center">
      <div className="mb-3">
        <h4 className="font-semibold text-md">Información de Parcela</h4>
        <p className="font-noraml text-md">
          Completa la información correspondiente al inmueble.
        </p>
      </div>
      <div className="w-full grid grid-cols-1 gap-3">
        <FormItem
          label="¿Cuenta con Casa?"
          className="flex justify-items-center items-center"
        >
          <Field name="characteristics.hasHouse">
            {({ field, form }: FieldProps<FormModel>) => {
              return (
                <Switcher
                  checked={values?.characteristics?.hasHouse}
                  className="mt-3"
                  onChange={() => {
                    form.setFieldValue(
                      field.name,
                      !values?.characteristics?.hasHouse
                    )
                  }}
                />
              )
            }}
          </Field>
        </FormItem>
        <Alert showIcon closable type="info" title="Información!">
          Esta opción se habilitará siempre y cuando el tipo de inmueble
          seleccionado sea <strong>{`"Parcela"`}</strong>.
        </Alert>
      </div>
    </div>
  )
}

export default PlotFields
