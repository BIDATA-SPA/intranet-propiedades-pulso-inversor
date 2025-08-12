/* eslint-disable react-hooks/exhaustive-deps */
import { AdaptableCard } from '@/components/shared'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useSendRealtorIdeaMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Field, FieldProps, Form, Formik } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect } from 'react'
import { InitialData } from '../definitions'
import { validationSchema } from '../schema'

export type FormModel = InitialData

const MainContent = ({ onClose }) => {
  const { showNotification } = useNotification()
  const [sendRealtorIdea, { data, isLoading, isSuccess, error }] =
    useSendRealtorIdeaMutation()

  const onSubmit = async (values: FormModel, { setSubmitting }) => {
    setSubmitting(true)
    const body = cloneDeep(values)
    await sendRealtorIdea({ ...body })
  }

  useEffect(() => {
    if (data || isSuccess) {
      showNotification('success', 'Enviada', 'Idea enviada correctamente')
      onClose()
      return
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (error) {
      showNotification(
        'danger',
        'Error',
        'Ocurrió un error al enviar tu idea, por favor intentalo más tarde.'
      )
      onClose()
      return
    }
  }, [error])

  return (
    <>
      <Formik
        initialValues={{
          title: '',
          description: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values }) => (
          <Form>
            <FormContainer>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto overflow-y-scroll max-h-96 p-3">
                <div className="lg:col-span-3">
                  <AdaptableCard>
                    <FormItem label="Ingresa tu idea">
                      <Field name="title">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              field={field}
                              size="md"
                              name="title"
                              placeholder="Ej: Chat en tiempo real para corredores"
                              value={values.title}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <FormItem label="Describe tu idea">
                      <Field name="description">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              textArea
                              field={field}
                              size="md"
                              name="description"
                              placeholder="Ej: Un chat en tiempo real para la interaccion directa entre corredores, envio de documentos y registro de conversaciones..."
                              value={values.description}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                  </AdaptableCard>
                </div>
              </div>

              <div className="text-right mt-6">
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  variant="plain"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
                <Button type="submit" variant="solid" loading={isLoading}>
                  Enviar
                </Button>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
}

const RequestCreate = ({ dialogIsOpen, onClose }) => {
  return (
    <Dialog isOpen={dialogIsOpen} onClose={onClose} onRequestClose={onClose}>
      <h5 className="mb-4">Envíanos tu idea</h5>
      <MainContent onClose={onClose} />
    </Dialog>
  )
}

export default RequestCreate
