import { RichTextEditor } from '@/components/shared'
import type { RichTextEditorRef } from '@/components/shared/RichTextEditor'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import {
  useGetMyInfoQuery,
  useSendExchangeEmailRequestMutation,
} from '@/services/RtkQueryService'
import { formatDate } from '@/utils/formatDate'
import useNotification from '@/utils/hooks/useNotification'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect, useRef } from 'react'
import { validationSchema } from '../../schema'
import { values } from 'lodash'

type FormModel = {
  name: string
  lastName: string
  to: string
  typeId: number
  propertyId: string | number
  phone: string
  realtorFrom: string
  subject: string
  message: string
}

const ContactFormDialog = ({ propertyData, onClose }) => {
  const editorRef = useRef<RichTextEditorRef>(null)
  const { showNotification } = useNotification()
  const { data: user } = useGetMyInfoQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )
  const [sendExchangeEmailRequest, { data, isLoading, isSuccess, isError }] =
    useSendExchangeEmailRequestMutation()

  const onSubmit = async (
    formValue: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(true)
    const { name, lastName, phone, to, realtorFrom, subject, message } =
      formValue

    const body = {
      name: name,
      lastName: lastName,
      to: to,
      typeId: 2,
      propertyId: propertyData?.id,
      phone: phone ?? '',
      realtorFrom: realtorFrom,
      subject: subject,
      message: message,
    }

    try {
      await sendExchangeEmailRequest({ ...body }).unwrap()
      setSubmitting(false)
      onClose()
    } catch (err) {
      showNotification('danger', 'Error', `${err?.message}`)
      setSubmitting(false)
      onClose()
    }
  }

  useEffect(() => {
    if (data || isSuccess) {
      showNotification('success', 'Éxito', 'Solicitud enviada exitosamente')
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (isError) {
      showNotification(
        'danger',
        'Error',
        'Error al enviar tu solicitud, inténtalo más tarde'
      )
    }
  }, [isError])

  return (
    <Formik
      initialValues={{
        name: `${user?.name}`,
        lastName: `${user?.lastName}`,
        to: `${propertyData?.user?.session?.email}`, // ⚠️ undefined propertyData?.user?.email `${'e.nava@email.com'}`
        propertyId: propertyData?.id,
        phone: `${!user?.phone ? '' : user?.phone}`, // ⚠️
        realtorFrom: `${user?.session?.email}`,
        subject: 'Solicitud de Contacto - Propiedad en Canje',
        message: `Estimado/a ${propertyData?.user?.name} ${
          propertyData?.user?.lastName
        }, 
        Espero que este mensaje le encuentre bien. Soy Corredor ${user?.name} ${
          user?.lastName
        }, 
        y me pongo en contacto con usted para solicitar más información sobre una propiedad 
        que me ha interesado en Canje. He visto el listado en línea y me gustaría conocer más detalles, 
        incluyendo disponibilidad, precio y posibles fechas para una visita. Adjunto mi información de contacto 
        para su conveniencia: 
        Nombre: ${user?.name} ${user?.lastName}, 
        E-mail: ${user?.session?.email}, 
        Telefono/celular: ${!user?.phone ? 'No definido' : user?.phone},
        Fecha de Hoy: ${formatDate(new Date())}
        `,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values, setSubmitting)
      }}
    >
      {({ touched, errors }) => (
        <Form className="overflow-y-scroll h-[500px]">
          <FormContainer>
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormItem
                asterisk
                label="Nombre"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="name"
                  placeholder="Ingresa tu nombre"
                  component={Input}
                  readOnly={true}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Apellido"
                invalid={errors.lastName && touched.lastName}
                errorMessage={errors.lastName}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="lastName"
                  placeholder="Ingresa tu Apellido"
                  component={Input}
                  readOnly={true}
                />
              </FormItem>

              <FormItem
                asterisk
                label="E-mail"
                invalid={errors.realtorFrom && touched.realtorFrom}
                errorMessage={errors.realtorFrom}
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="realtorFrom"
                  placeholder="Ingresa tu e-mail"
                  component={Input}
                  readOnly={true}
                />
              </FormItem>

              <FormItem
                asterisk
                label="Teléfono (fijo o móvil)"
                invalid={errors.phone && touched.phone}
                errorMessage={errors.phone}
              >
                <Field
                  type="tel"
                  autoComplete="off"
                  name="phone"
                  placeholder="Ingresa tu teléfono"
                  component={Input}
                />
                <small>Ingresa código de área + número.</small>
              </FormItem>
            </div> */}

            <div className="grid grid-cols-1 gap-5">
              <FormItem
                asterisk
                label="Para"
                invalid={errors.to && touched.to}
                errorMessage={errors.to} // importar correo
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="to"
                  placeholder="E-mail corredor destinatario"
                  component={Input}
                  readOnly={true}
                />
              </FormItem>
            </div>

            <FormItem
              asterisk
              label="Asunto"
              invalid={errors.subject && touched.subject}
              errorMessage={errors.subject}
            >
              <Field
                type="text"
                autoComplete="off"
                name="subject"
                placeholder="Ingresa asunto"
                component={Input}
                readOnly={true}
              />
            </FormItem>

            <div className="max-h-[400px] overflow-y-auto px-1 pb-10">
              <FormItem
                label="Mensaje o Asunto"
                className="mb-0"
                labelClass="!justify-start"
                invalid={errors.message && touched.message}
                errorMessage={errors.message}
              >
                <Field name="message">
                  {({ field, form }: FieldProps) => (
                    <RichTextEditor
                      ref={editorRef}
                      value={field.value}
                      onChange={(val) => form.setFieldValue(field.name, val)}
                    />
                  )}
                </Field>
              </FormItem>
            </div>

            <Button block variant="solid" type="submit" loading={isLoading}>
              Contactar
            </Button>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
}

export default ContactFormDialog
