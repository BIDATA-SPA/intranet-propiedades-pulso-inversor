import { RichTextEditor } from '@/components/shared'
import { Checkbox, DatePicker, FormItem } from '@/components/ui'
import { CreatePropertyFormModel } from '@/services/properties/types/property.type'
import { Field, FieldProps } from 'formik'

export type FormModel = CreatePropertyFormModel

const StepFormFour = ({ values, touched, errors }) => {
  const toLocalDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  }

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
                    values.isExchanged
                      ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-100'
                      : 'bg-yellow-50 text-yellow-500 dark:bg-yellow-500/20 dark:text-emerald-100'
                  } tag flex justify-center items-center rounded-md border-0 mx-0 my-1 md:my-0 md:mx-2 w-20 text-center`}
                >
                  <span className="uppercase">
                    {values.isExchanged ? 'Activa' : 'Inactiva'}
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

            <Field name="isExchanged">
              {({ field, form }: FieldProps<FormModel>) => {
                return (
                  <Checkbox.Group>
                    <Checkbox
                      className="my-3"
                      checked={values?.isExchanged}
                      onChange={() => {
                        form.setFieldValue(field.name, !values.isExchanged)
                      }}
                    >
                      Activar
                    </Checkbox>
                  </Checkbox.Group>
                )
              }}
            </Field>
          </div>
        </div>
      </div>

      {values.isExchanged && (
        <>
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
            <FormItem
              asterisk
              label="Desde"
              invalid={
                errors.timeInExchange?.start && touched.timeInExchange?.start
              }
              errorMessage={errors.timeInExchange?.start}
            >
              <Field name="timeInExchange.start">
                {({ field, form }: FieldProps<FormModel>) => {
                  return (
                    <DatePicker
                      locale="es"
                      placeholder="Seleccionar una fecha de inicio"
                      field={field}
                      form={form}
                      value={
                        values.timeInExchange?.start
                          ? toLocalDate(values.timeInExchange?.start)
                          : null
                      }
                      onChange={(date) => {
                        form.setFieldValue(field.name, date)
                      }}
                    />
                  )
                }}
              </Field>
            </FormItem>

            <FormItem
              asterisk
              label="Hasta"
              invalid={
                errors.timeInExchange?.end && touched.timeInExchange?.end
              }
              errorMessage={errors.timeInExchange?.end}
            >
              <Field name="timeInExchange.end">
                {({ field, form }: FieldProps<FormModel>) => (
                  <DatePicker
                    locale="es"
                    placeholder="Seleccionar una fecha de fin"
                    field={field}
                    form={form}
                    value={
                      values.timeInExchange?.end
                        ? toLocalDate(values.timeInExchange?.end)
                        : null
                    }
                    onChange={(date) => {
                      form.setFieldValue(field.name, date)
                    }}
                  />
                )}
              </Field>
            </FormItem>
          </div>

          <div className="w-full">
            <FormItem label="Descripción de la Propiedad en Canje">
              {
                values.propertyDescriptionInExchange && (
                  <Field name="propertyDescriptionInExchange">
                  {({ field, form }: FieldProps<FormModel>) => {
                    return (
                      <RichTextEditor
                        value={values.propertyDescriptionInExchange}
                        placeholder="Ingresar una descripción de la propiedad en canje..."
                        onChange={(val) => {
                          form.setFieldValue(field.name, val)
                        }}
                      />
                    )
                  }}
                </Field>
                )
              }
       
            </FormItem>
          </div>
        </>
      )}
    </>
  )
}

export default StepFormFour
