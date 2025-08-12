import { RichTextEditor } from '@/components/shared'
import { Checkbox, DatePicker, FormItem } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import { useCallback, useEffect } from 'react'
import { FormModel } from './PropertyForm'

const StepFormFour = ({ values, touched, errors, setValues }) => {
  // Reset fields based on the isExchanged switch
  const resetFields = useCallback(() => {
    if (!values.step4.isExchanged) {
      setValues((prevValues) => ({
        ...prevValues,
        step4: {
          ...prevValues.step4,
          propertyDescriptionInExchange: '',
          timeInExchange: {
            start: null,
            end: null,
          },
        },
      }))
    }
  }, [values.step4.isExchanged, setValues])

  useEffect(() => {
    resetFields()
  }, [resetFields, values.step4.isExchanged])

  return (
    <>
      <div className="mb-8">
        <div className="card card-border" role="presentation">
          <div className="card-body flex flex-col lg:flex-row items-center w-full gap-4">
            <div className="flex flex-col items-start justify-start text-start w-full">
              <div className="flex flex-col md:flex-row">
                <h6>Activar esta propiedad en Canje</h6>
                <div
                  className={`${
                    values?.step4?.isExchanged
                      ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-100'
                      : 'bg-yellow-50 text-yellow-500 dark:bg-yellow-500/20 dark:text-emerald-100'
                  } tag flex justify-center items-center rounded-md border-0 mx-0 my-1 md:my-0 md:mx-2 w-20 text-center`}
                >
                  <span className="uppercase">
                    {values?.step4?.isExchanged ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>
              <div className="w-full">
                <p className="text-gray-400">
                  Desea que la publicación este disponible para canje desde un
                  principio |{' '}
                  <span className="text-gray-700">activar aquí</span>.
                </p>
              </div>
            </div>

            <div className="pt-10">
              <FormItem label="">
                <Field name="step4.isExchanged">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <Checkbox
                      checked={values.step4.isExchanged}
                      onChange={() =>
                        form.setFieldValue(
                          field.name,
                          !values.step4.isExchanged
                        )
                      }
                    >
                      {values.step4.isExchanged ? 'Desactivar' : 'Activar'}
                    </Checkbox>
                  )}
                </Field>
              </FormItem>
            </div>
          </div>
        </div>

        {values.step4.isExchanged && (
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-4">
              <FormItem
                label="Desde"
                error={
                  errors.step4?.timeInExchange?.start &&
                  touched.step4?.timeInExchange?.start
                }
                errorMessage={errors.step4?.timeInExchange?.start}
              >
                <Field name="step4.timeInExchange.start">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DatePicker
                      locale="es"
                      placeholder="Selecciona una fecha de inicio"
                      value={values.step4.timeInExchange.start}
                      onChange={(date) => form.setFieldValue(field.name, date)}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                label="Hasta"
                error={
                  errors.step4?.timeInExchange?.end &&
                  touched.step4?.timeInExchange?.end
                }
                errorMessage={errors.step4?.timeInExchange?.end}
              >
                <Field name="step4.timeInExchange.end">
                  {({ field, form }: FieldProps<FormModel>) => (
                    <DatePicker
                      locale="es"
                      placeholder="Selecciona una fecha de fin"
                      value={values.step4.timeInExchange.end}
                      onChange={(date) => form.setFieldValue(field.name, date)}
                    />
                  )}
                </Field>
              </FormItem>
            </div>

            <FormItem
              label="Descripción de la Propiedad en Canje"
              className="mb-6"
              labelClass="!justify-start"
            >
              {values.step4.propertyDescriptionInExchange && (
                <Field name="step4.propertyDescriptionInExchange">
                  {({ field, form }: FieldProps) => (
                    <RichTextEditor
                      value={field.value}
                      placeholder="Ingresar una descripción de la propiedad en canje..."
                      onChange={(val) => {
                        form.setFieldValue(field.name, val)
                      }}
                    />
                  )}
                </Field>
              )}
            </FormItem>
          </div>
        )}
      </div>
    </>
  )
}

export default StepFormFour
