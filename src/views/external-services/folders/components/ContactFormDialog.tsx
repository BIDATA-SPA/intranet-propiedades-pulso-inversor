/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import { RichTextEditor } from '@/components/shared'
import type { RichTextEditorRef } from '@/components/shared/RichTextEditor'
import { Select } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import {
  useGetAllCustomersQuery,
  useGetMyInfoQuery,
  useSendExternalServicesEmailRequestMutation,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { formatDate } from '@fullcalendar/core'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { FormModel, ServerError } from '../lib/definitions'
import { validationSchema } from '../lib/schema'

const ContactFormDialog = ({ selectedService }) => {
  const { showNotification } = useNotification()
  const editorRef = useRef<RichTextEditorRef>(null)
  const { data: user } = useGetMyInfoQuery({
    refetchOnMountOrArgChange: true,
  })
  const [
    sendExternalServicesEmailRequest,
    { data, isLoading, isSuccess, isError, error },
  ] = useSendExternalServicesEmailRequestMutation()
  const { data: filterAllCustomers } = useGetAllCustomersQuery(
    {
      page: 1,
      limit: 10,
      search: '',
      paginated: false,
      transformToSelectOptions: true,
    },
    { refetchOnMountOrArgChange: true }
  )

  const onSubmit = async (
    formValue: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(true)
    const { to, customerId, externalServiceId, realtorFrom, subject, message } =
      formValue
    const body = {
      to,
      customerId,
      externalServiceId,
      realtorFrom,
      subject,
      message,
    }
    try {
      await sendExternalServicesEmailRequest({ ...body }).unwrap()
      setSubmitting(false)
    } catch (err) {
      setSubmitting(false)
    }
  }

  // Show success toast if api return data or request is success.
  const onSendSuccess = () => {
    if (data || isSuccess) {
      showNotification('success', 'Éxito', 'Solicitud enviada exitosamente')
      return
    }
  }

  // Show error toast if api not return data or request is an error.
  const onSendError = () => {
    if (isError) {
      const errorMsg = error as ServerError
      const defaultErrorMsg =
        'Error al enviar tu solicitud, inténtalo más tarde'
      showNotification('danger', 'Error', `${errorMsg || defaultErrorMsg} `)
    }
  }

  useEffect(() => {
    onSendSuccess()
  }, [data, isSuccess])

  useEffect(() => {
    onSendError()
  }, [isError])

  return (
    <Formik
      initialValues={{
        to: `${selectedService?.owner?.ownerEmail}`,
        customerId: null,
        externalServiceId: selectedService?.id,
        realtorFrom: `${user?.session?.email}`,
        subject: 'Solicitud de Servicios - Empresa asociada',
        message: `Estimado/a ${selectedService?.owner?.ownerName} ${
          selectedService?.owner?.ownerName
        }, 
        Espero que este mensaje le encuentre bien. Soy Corredor ${user?.name} ${
          user?.lastName
        }, 
        y me pongo en contacto con usted para solicitar de sus servicios: 
        Nombre: ${user?.name} ${user?.lastName}, 
        E-mail: ${user?.email}, 
        Teléfono/celular: ${user?.phone},
        Fecha de Hoy: ${formatDate(new Date())}
        `,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values, setSubmitting)
      }}
    >
      {({ values, touched, errors }) => (
        <Form className="overflow-y-scroll h-[500px]">
          <FormContainer>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormItem
                asterisk
                label="Desde (Usuario corredor/a)"
                invalid={errors.realtorFrom && touched.realtorFrom}
                errorMessage={errors.realtorFrom}
              >
                <Field
                  readOnly
                  type="text"
                  autoComplete="off"
                  name="realtorFrom"
                  placeholder="usuario.corredor@procanje.cl"
                  component={Input}
                />
              </FormItem>
              <FormItem
                asterisk
                label="Email Empresa destinataria"
                invalid={errors.to && touched.to}
                errorMessage={errors.to as any}
              >
                <Field
                  readOnly
                  type="text"
                  autoComplete="off"
                  name="to"
                  placeholder="email-encargado-epresa@email.com"
                  component={Input}
                />
              </FormItem>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <FormItem
                asterisk
                label="Seleccionar Cliente"
                invalid={errors.customerId && (touched.customerId as any)}
                errorMessage={errors.customerId as any}
              >
                <Field name="customerId">
                  {({ field, form }: FieldProps<FormModel>) => {
                    return (
                      <Select
                        isClearable
                        isSearchable
                        field={field}
                        form={form}
                        options={filterAllCustomers as SelectType[]}
                        value={(filterAllCustomers as SelectType[])?.filter(
                          (category) =>
                            String(category.value) === String(values.customerId)
                        )}
                        placeholder="Seleccionar"
                        noOptionsMessage={() => (
                          <div>
                            No hay clientes creados.{' '}
                            <Link
                              to="/clientes/crear"
                              className="text-sky-500 hover:underline"
                            >
                              Crear cliente
                            </Link>
                          </div>
                        )}
                        onChange={(option) =>
                          form.setFieldValue(field.name, option?.value)
                        }
                      />
                    )
                  }}
                </Field>
              </FormItem>
            </div>

            <div className="max-h-[400px] overflow-y-auto px-1 pb-10">
              <FormItem
                asterisk
                label="Asunto"
                invalid={errors.subject && touched.subject}
                errorMessage={errors.subject as any}
              >
                <Field
                  readOnly
                  type="text"
                  autoComplete="off"
                  name="subject"
                  placeholder="emai-encargado-epresa@email.com"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Mensaje"
                className="mb-0"
                labelClass="!justify-start"
                invalid={errors.subject && touched.subject}
                errorMessage={errors.subject}
              >
                {
                  values.message && (
                    <Field name="message">
                    {({ field, form }: FieldProps) => (
                      <RichTextEditor
                        ref={editorRef}
                        value={field.value}
                        onChange={(val) => form.setFieldValue(field.name, val)}
                      />
                    )}
                  </Field>
                  )
                }
        
              </FormItem>
            </div>
            <Button block variant="solid" type="submit" loading={isLoading}>
              Enviar
            </Button>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
}

export default ContactFormDialog
