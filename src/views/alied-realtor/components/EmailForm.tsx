/* eslint-disable react/display-name */
import { Input } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { useCreateContactEmailAliedRealtorMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { forwardRef, useEffect } from 'react'
import { FaPaperPlane } from 'react-icons/fa'
import { RiMailSendLine } from 'react-icons/ri'
import * as Yup from 'yup'
import {
  setSelectedRow,
  toggleEmailDialog,
  useAppDispatch,
  useAppSelector,
} from '../store'

type FormikRef = FormikProps<any>

const validationSchema = Yup.object().shape({
  receiverId: Yup.number().optional(),
  message: Yup.string().optional(),
  openAt: Yup.string().optional(),
  emailTo: Yup.string().optional(),
  subject: Yup.string().optional(),
})

const EmailForm = forwardRef<FormikRef>((props, ref) => {
  const dispatch = useAppDispatch()
  const [createContactEmailAliedRealtor, { isError, isLoading, isSuccess }] =
    useCreateContactEmailAliedRealtorMutation()
  const { showNotification } = useNotification()

  const realtor = useAppSelector(
    (state) => state.aliedRealtorList.data.selectedRow
  )

  const onDialogClose = () => {
    dispatch(toggleEmailDialog(false))
    setTimeout(() => {
      dispatch(setSelectedRow({}))
    }, 500)
  }

  const onFormSubmit = async (values, { setSubmitting, resetForm }) => {
    const { receiverId, message, openAt } = values

    const data = cloneDeep({
      receiverId: Number(receiverId),
      message,
      openAt: openAt || new Date().toISOString(),
    })

    createContactEmailAliedRealtor(data)
    resetForm()
    setSubmitting(false)
    onDialogClose()
    showNotification(
      'success',
      'Enviada',
      'Solicitud de contacto enviada exitosamente.'
    )
  }

  useEffect(() => {
    if (isError) {
      showNotification('danger', 'Error', 'Ha ocurrido al enviar la solicitud.')
    }
  }, [isError])

  useEffect(() => {
    if (isSuccess) {
      showNotification(
        'success',
        'Enviada',
        'Solicitud de contacto enviada exitosamente.'
      )
    }
  }, [isSuccess])

  return (
    <>
      <Formik
        innerRef={ref}
        initialValues={{
          receiverId: realtor.id,
          emailTo: `${realtor.session.email}`,
          subject: 'Solicitud de Contacto a corredor/a',
          message: '',
          openAt: new Date().toISOString(),
        }}
        validationSchema={validationSchema}
        onSubmit={onFormSubmit}
      >
        {({ values }) => (
          <Form>
            <FormContainer>
              <div className="grid grid-cols-1 gap-0">
                <FormItem label="Corredor/a destinatario/a">
                  <Field name="emailTo">
                    {({ field, form }: FieldProps) => {
                      return (
                        <Input
                          readOnly
                          disabled
                          type="text"
                          field={field}
                          prefix={<FaPaperPlane className="text-lg" />}
                          size="md"
                          placeholder="Para"
                          value={values?.emailTo}
                          onChange={(e) => {
                            form.setFieldValue(field.name, e.target.value)
                          }}
                        />
                      )
                    }}
                  </Field>
                </FormItem>

                <FormItem label="Asunto">
                  <Field name="subject">
                    {({ field, form }: FieldProps) => {
                      return (
                        <Input
                          readOnly
                          disabled
                          type="text"
                          field={field}
                          size="md"
                          placeholder="Para"
                          value={values?.subject}
                          onChange={(e) => {
                            form.setFieldValue(field.name, e.target.value)
                          }}
                        />
                      )
                    }}
                  </Field>
                </FormItem>

                <FormItem label="Mensaje">
                  <Field name="message">
                    {({ field, form }: FieldProps) => {
                      return (
                        <Input
                          textArea
                          field={field}
                          size="md"
                          placeholder="Ingrese un mensaje de solicitud..."
                          value={values?.message}
                          onChange={(e) => {
                            form.setFieldValue(field.name, e.target.value)
                          }}
                        />
                      )
                    }}
                  </Field>
                </FormItem>
              </div>

              <div className="-mx-8 px-8 flex items-center justify-end py-4">
                <div className="md:flex items-center">
                  <Button
                    size="sm"
                    className="ltr:mr-3 rtl:ml-3"
                    type="button"
                    onClick={onDialogClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    variant="solid"
                    loading={isLoading}
                    icon={<RiMailSendLine />}
                    type="submit"
                  >
                    Enviar
                  </Button>
                </div>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
})

export default EmailForm
