import { RichTextEditor } from '@/components/shared'
import { DatePicker } from '@/components/ui'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'
import {
  useAppSelector,
  type FinancialInformation as FinancialInformationType,
} from '../store'

type FormModel = FinancialInformationType

type FinancialInformationProps = {
  data: FinancialInformationType
  onNextChange?: (
    values: FormModel,
    formName: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => void
  onBackChange?: () => void
  currentStepStatus?: string
}

const validationSchema = Yup.object({
  isExchanged: Yup.boolean(),

  timeInExchange: Yup.object({
    start: Yup.string().nullable().optional(),
    end: Yup.string().nullable().optional(),
  }).when('isExchanged', {
    is: true,
    then: (schema) =>
      schema.shape({
        start: Yup.string().required('Este campo es requerido.'),
        end: Yup.string().required('Este campo es requerido.'),
      }),
    otherwise: (schema) =>
      schema.shape({
        start: Yup.string().nullable().optional(),
        end: Yup.string().nullable().optional(),
      }),
  }),

  propertyDescriptionInExchange: Yup.string()
    .nullable()
    .transform((value) => (value?.trim() === '' ? null : value))
    .when('isExchanged', {
      is: true,
      then: (schema) =>
        schema
          .min(20, 'El largo mínimo es de 20 caracteres.')
          .max(5120, 'No puede exceder los 5120 caracteres.'),
      otherwise: (schema) =>
        schema
          .min(20, 'El largo mínimo es de 20 caracteres.')
          .max(5120, 'No puede exceder los 5120 caracteres.'),
    }),
})

const FinancialInformation = ({
  data = {
    isExchanged: false,
    timeInExchange: {
      start: null,
      end: null,
    },
    propertyDescriptionInExchange: '',
  },
  onNextChange,
  onBackChange,
  currentStepStatus,
}: FinancialInformationProps) => {
  const formData = useAppSelector(
    (state) => state.accountDetailForm.data.formData
  )

  const onNext = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    onNextChange?.(values, 'financialInformation', setSubmitting)
  }

  const onBack = () => {
    onBackChange?.()
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Configurar canje</h3>
      </div>
      <Formik
        enableReinitialize
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          setTimeout(() => {
            onNext(values, setSubmitting)
          }, 1000)
        }}
      >
        {({ values, touched, errors, isSubmitting }) => {
          return (
            <Form>
              <FormContainer>
                <div className="card card-border mb-6" role="presentation">
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
                          Desea que la publicación este disponible para canje
                          desde un principio |{' '}
                          <span className="text-gray-700">activar aquí</span>.
                        </p>
                      </div>
                    </div>

                    <div className="pt-10">
                      <FormItem label="">
                        <Field name="isExchanged">
                          {({ field, form }: FieldProps<FormModel>) => (
                            <Checkbox
                              checked={values.isExchanged}
                              onChange={() => {
                                if (!values.isExchanged) {
                                  form.setFieldValue(
                                    'timeInExchange.start',
                                    null
                                  )
                                  form.setFieldValue('timeInExchange.end', null)
                                  form.setFieldValue('timeInExchange.end', null)
                                  form.setFieldValue(
                                    'propertyDescriptionInExchange',
                                    ''
                                  )
                                }
                                form.setFieldValue(
                                  field.name,
                                  !values.isExchanged
                                )
                              }}
                            >
                              {values.isExchanged ? 'Desactivar' : 'Activar'}
                            </Checkbox>
                          )}
                        </Field>
                      </FormItem>
                    </div>
                  </div>
                </div>

                {values.isExchanged && (
                  <div className="w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-4">
                      <FormItem
                        asterisk={values.isExchanged}
                        label="Desde"
                        invalid={
                          errors.timeInExchange?.start &&
                          touched.timeInExchange?.start
                        }
                        errorMessage={errors.timeInExchange?.start as string}
                      >
                        <Field name="timeInExchange.start">
                          {({ field, form }: FieldProps<FormModel>) => (
                            <DatePicker
                              locale="es"
                              placeholder="Selecciona una fecha de inicio"
                              value={values.timeInExchange?.start}
                              onChange={(date) =>
                                form.setFieldValue(field.name, date)
                              }
                            />
                          )}
                        </Field>
                      </FormItem>

                      <FormItem
                        asterisk={values.isExchanged}
                        label="Hasta"
                        invalid={
                          errors.timeInExchange?.end &&
                          touched.timeInExchange?.end
                        }
                        errorMessage={errors.timeInExchange?.end as string}
                      >
                        <Field name="timeInExchange.end">
                          {({ field, form }: FieldProps<FormModel>) => (
                            <DatePicker
                              locale="es"
                              placeholder="Selecciona una fecha de fin"
                              value={values.timeInExchange.end}
                              onChange={(date) =>
                                form.setFieldValue(field.name, date)
                              }
                            />
                          )}
                        </Field>
                      </FormItem>
                    </div>

                    <FormItem
                      //   asterisk={values.isExchanged}
                      label="Descripción de la Propiedad en Canje"
                      className="mb-6"
                      labelClass="!justify-start"
                      invalid={
                        errors.propertyDescriptionInExchange &&
                        touched.propertyDescriptionInExchange
                      }
                      errorMessage={errors.propertyDescriptionInExchange}
                    >
                      <Field name="propertyDescriptionInExchange">
                        {({ field, form }: FieldProps) => (
                          <RichTextEditor
                            readOnly={true}
                            value={
                              formData.caracteristicas.characteristics
                                .propertyDescription
                            }
                            // value={field.value}
                            placeholder="Ingresar una descripción de la propiedad en canje..."
                            onChange={(val) => {
                              form.setFieldValue(field.name, val)
                            }}
                          />
                        )}
                      </Field>
                      <small className="italic font-normal text-sm">
                        Este campo se sincroniza con la descripción de la
                        Propiedad en el Paso 2:{' '}
                        <strong>
                          {'Características > Descripción de la Propiedad)'}
                        </strong>{' '}
                      </small>
                    </FormItem>

                    {/* <FormItem
                      asterisk={values.isExchanged}
                      label="Descripción de la Propiedad en Canje"
                      className="mb-6"
                      labelClass="!justify-start"
                      invalid={
                        errors.propertyDescriptionInExchange &&
                        touched.propertyDescriptionInExchange
                      }
                      errorMessage={errors.propertyDescriptionInExchange}
                    >
                      <Field name="propertyDescriptionInExchange">
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
                    </FormItem> */}
                  </div>
                )}

                <div className="flex justify-start gap-2">
                  <Button type="button" onClick={onBack}>
                    Volver
                  </Button>
                  <Button loading={isSubmitting} variant="solid" type="submit">
                    {currentStepStatus === 'complete' ? 'Guardar' : 'Siguiente'}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default FinancialInformation
