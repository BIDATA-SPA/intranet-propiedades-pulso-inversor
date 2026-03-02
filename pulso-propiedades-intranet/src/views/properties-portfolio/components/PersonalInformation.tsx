/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, DatePicker, Select } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import {
  useGetAllCustomersQuery,
  useGetMyInfoQuery,
} from '@/services/RtkQueryService'
import { injectReducer } from '@/store'
import {
  filterCurrencyType,
  filterTypeOfOperation,
  filterTypeOfProperty,
} from '@/utils/types/new-property/constants'
import { Field, FieldProps, Form, Formik } from 'formik'
import * as Yup from 'yup'
import reducer, {
  setFormData,
  useAppDispatch,
  useAppSelector,
  type PersonalInformation as PersonalInformationType,
} from '../store'
import FormattedNumberInput from '../utils/formatted-number-input'

injectReducer('accountDetailForm', reducer)

type FormModel = PersonalInformationType

type PersonalInformationProps = {
  data: PersonalInformationType
  onNextChange?: (
    values: FormModel,
    formName: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => void
  currentStepStatus?: string
}

const validationSchema = Yup.object({
  customerId: Yup.number().required('Este campo es requerido.'),
  typeOfOperationId: Yup.string().required('Este campo es requerido.'),
  typeOfPropertyId: Yup.string().required('Este campo es requerido.'),
  timeAvailable: Yup.object({
    start: Yup.string().nullable().optional(),
    end: Yup.string().nullable().optional(),
  }).when('typeOfOperationId', {
    is: 'Arriendo temporal',
    then: (schema) =>
      schema.required('Este campo es requerido.').shape({
        start: Yup.string().required('Este campo es requerido.'),
        end: Yup.string().required('Este campo es requerido.'),
      }),
    otherwise: (schema) =>
      schema.shape({
        start: Yup.string().nullable().optional(),
        end: Yup.string().nullable().optional(),
      }),
  }),
  currencyId: Yup.string().required('Este campo es requerido.'),
  propertyPrice: Yup.number()
    .typeError('Debe ser un número válido.')
    .required('Este campo es requerido.')
    .min(0, 'No se aceptan valores negativos.'),
})

const PersonalInformation = ({
  data = {
    customerId: null,
    typeOfOperationId: null,
    typeOfPropertyId: null,
    timeAvailable: {
      start: '',
      end: '',
    },
    currencyId: 'CLP',
    propertyPrice: 0,
  },
  onNextChange,
  currentStepStatus,
}: PersonalInformationProps) => {
  const dispatch = useAppDispatch()

  const { data: user } = useGetMyInfoQuery(undefined, {
    refetchOnMountOrArgChange: true,
  })

  const { data: customerOptions } = useGetAllCustomersQuery(
    {
      page: 1,
      limit: 999999,
      search: '',
      paginated: false,
      transformToSelectOptions: true,
    },
    { refetchOnMountOrArgChange: true }
  )

  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  const formData = useAppSelector(
    (state) => state.accountDetailForm.data.formData
  )

  const onNext = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    onNextChange?.(values, 'personalInformation', setSubmitting)
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Información Principal</h3>
        <Alert
          showIcon
          closable
          type="info"
          title="Importante"
          className="px-6"
        >
          Todos los campos con este signo (*) son obligatorios.
        </Alert>
      </div>
      <Formik
        initialValues={data}
        enableReinitialize={true}
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
                <div className="md:grid grid-cols-1 gap-4">
                  {/* MAP */}

                  {/* <FormItem
                    asterisk
                    label="Ubicación de la propiedad (click para fijar, arrastra el pin para ajustar)"
                    // No usamos invalid/errorMessage aquí porque el Map no es <Field>, pero puedes mostrar errores abajo si quieres.
                  >
                    <Map name="coordinates" />
                    Mensaje de error (opcional)
                    {touched.coordinates && errors.coordinates && (
    <div className="mt-1 text-sm text-red-600">
      {typeof errors.coordinates === 'string'
        ? errors.coordinates
        : // errores anidados
          (errors.coordinates as any)?.lat || (errors.coordinates as any)?.lng || 'Selecciona la ubicación'}
    </div>
  )}
                  </FormItem> */}

                  {/* END MAP */}

                  <FormItem
                    asterisk
                    label="Nombre del Cliente"
                    invalid={errors.customerId && touched.customerId}
                    errorMessage={errors.customerId}
                  >
                    <Field name="customerId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          placeholder="Seleccionar..."
                          field={field}
                          form={form}
                          options={
                            userAuthority === 3
                              ? [
                                  {
                                    value: Number(user?.id),
                                    label: `${user?.name} ${user?.lastName}`,
                                  },
                                ]
                              : (customerOptions as {
                                  value: number
                                  label: string
                                }[])
                          }
                          value={
                            userAuthority === 3
                              ? [
                                  {
                                    value: Number(user?.id),
                                    label: `${user?.name} ${user?.lastName}`,
                                  },
                                ]?.filter(
                                  (customer) =>
                                    Number(customer.value) ===
                                    Number(values.customerId)
                                )
                              : (customerOptions as any)?.filter(
                                  (customer) =>
                                    Number(customer.value) ===
                                    Number(values.customerId)
                                )
                          }
                          onChange={(customer) =>
                            form.setFieldValue(field.name, customer?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>
                </div>

                <div className="md:grid grid-cols-2 gap-4">
                  <FormItem
                    asterisk
                    label="Tipo de operación"
                    invalid={
                      errors.typeOfOperationId && touched.typeOfOperationId
                    }
                    errorMessage={errors.typeOfOperationId}
                  >
                    <Field name="typeOfOperationId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          form={form}
                          options={filterTypeOfOperation}
                          value={filterTypeOfOperation?.filter(
                            (option) =>
                              option.value === values.typeOfOperationId
                          )}
                          placeholder="Seleccionar..."
                          onChange={(option) => {
                            if (option.value !== 'Arriendo temporal') {
                              form.setFieldValue('timeAvailable.start', null)
                              form.setFieldValue('timeAvailable.end', null)
                            }

                            form.setFieldValue(field.name, option?.value)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Tipo de inmueble"
                    invalid={
                      errors.typeOfPropertyId && touched.typeOfPropertyId
                    }
                    errorMessage={errors.typeOfPropertyId}
                  >
                    <Field name="typeOfPropertyId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          placeholder="Seleccionar..."
                          field={field}
                          form={form}
                          options={filterTypeOfProperty}
                          value={filterTypeOfProperty?.filter(
                            (option) => option.value === values.typeOfPropertyId
                          )}
                          onChange={(option) => {
                            if (option.value !== 'Parcela') {
                              dispatch(
                                setFormData({
                                  ...formData,
                                  identification: {
                                    ...formData.identification,
                                    characteristics: {
                                      ...formData.identification
                                        .characteristics,
                                      hasHouse: false,
                                    },
                                  },
                                })
                              )
                            }

                            if (option.value !== 'Oficina') {
                              dispatch(
                                setFormData({
                                  ...formData,
                                  identification: {
                                    ...formData.identification,
                                    characteristics: {
                                      ...formData.identification
                                        .characteristics,
                                      numberOfPrivate: '',
                                      numberOfVacantFloors: '',
                                      numberOfMeetingRooms: '',
                                      hasKitchenet: false,
                                    },
                                  },
                                })
                              )
                            }

                            if (option.value !== 'Local Comercial') {
                              dispatch(
                                setFormData({
                                  ...formData,
                                  identification: {
                                    ...formData.identification,
                                    characteristics: {
                                      ...formData.identification
                                        .characteristics,
                                      officeNumber: '',
                                      floorLevelLocation: '',
                                      locatedInGallery: false,
                                      locatedFacingTheStreet: false,
                                      commonExpenses: '',
                                    },
                                  },
                                })
                              )
                            }

                            form.setFieldValue(field.name, option?.value)
                          }}
                        />
                      )}
                    </Field>
                  </FormItem>
                </div>

                {values.typeOfOperationId?.includes('Arriendo temporal') && (
                  <div>
                    <div className="mb-3">
                      <h6>Tiempo de arriendo</h6>
                      <p>Establecer fechas límite de arriendo del inmueble.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3 border p-4 rounded-lg">
                      <FormItem
                        label="Desde"
                        invalid={
                          errors.timeAvailable?.start &&
                          touched.timeAvailable?.start
                        }
                        errorMessage={errors.timeAvailable?.start}
                      >
                        <Field name="timeAvailable.start">
                          {({ field, form }: FieldProps<FormModel>) => (
                            <DatePicker
                              locale="es"
                              placeholder="Selecciona una fecha de inicio"
                              field={field}
                              form={form}
                              value={values?.timeAvailable?.start as Date}
                              onChange={(date) => {
                                form.setFieldValue(field.name, date)
                              }}
                            />
                          )}
                        </Field>
                      </FormItem>
                      <FormItem
                        label="Hasta"
                        invalid={
                          errors.timeAvailable?.end &&
                          touched.timeAvailable?.end
                        }
                        errorMessage={errors.timeAvailable?.end}
                      >
                        <Field name="timeAvailable.end">
                          {({ field, form }: FieldProps<FormModel>) => (
                            <DatePicker
                              locale="es"
                              placeholder="Selecciona una fecha de fin"
                              field={field}
                              form={form}
                              value={values.timeAvailable?.end as Date}
                              onChange={(date) => {
                                form.setFieldValue(field.name, date)
                              }}
                            />
                          )}
                        </Field>
                      </FormItem>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-5 mt-5">
                  <FormItem
                    asterisk
                    label="Moneda"
                    invalid={errors.currencyId && touched.currencyId}
                    errorMessage={errors.currencyId}
                  >
                    <Field name="currencyId">
                      {({ field, form }: FieldProps) => (
                        <Select
                          field={field}
                          form={form}
                          options={filterCurrencyType}
                          value={filterCurrencyType?.filter(
                            (option) => option.value === values.currencyId
                          )}
                          onChange={(option) =>
                            form.setFieldValue(field.name, option?.value)
                          }
                        />
                      )}
                    </Field>
                  </FormItem>

                  <div className="flex items-center w-full gap-4">
                    <div className="w-[100%]">
                      <FormItem
                        asterisk
                        label={
                          values.currencyId === 'M2'
                            ? 'Precio en M2'
                            : values.currencyId === 'UF'
                            ? 'Precio en UF'
                            : values.currencyId === 'CLP'
                            ? 'Precio en CLP'
                            : 'Precio'
                        }
                        invalid={errors.propertyPrice && touched.propertyPrice}
                        errorMessage={errors.propertyPrice}
                      >
                        <Field name="propertyPrice">
                          {({ field, form }: FieldProps<FormModel>) => {
                            return (
                              <>
                                <FormattedNumberInput
                                  field={field}
                                  form={form}
                                  currencyId={values.currencyId}
                                />
                              </>
                            )
                          }}
                        </Field>
                      </FormItem>
                    </div>
                  </div>
                </div>

                <div className="flex justify-start gap-2">
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

export default PersonalInformation
