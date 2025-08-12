/* eslint-disable react-hooks/exhaustive-deps */
import { AdaptableCard } from '@/components/shared'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useUpdateRealtorIdeaMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useEffect } from 'react'
import { InitialData } from '../definitions'
import { validationSchema } from '../schema'

export type FormModel = InitialData

const MainContent = ({ currentRequest, onClose }) => {
  const [updateRealtorIdea, { data, isLoading, isError, isSuccess }] =
    useUpdateRealtorIdeaMutation()
  const { showNotification } = useNotification()
  const editedData = { ...currentRequest }

  const onSubmit = async (values: { title: string; description?: string }) => {
    const ideaId = Number(editedData?.id)

    try {
      await updateRealtorIdea({
        id: ideaId,
        ...values,
      }).unwrap()
      onClose()
    } catch (error) {
      onClose()
    }
  }

  useEffect(() => {
    if (data || isSuccess) {
      showNotification(
        'success',
        'Idea actualizada',
        'Idea actualizada exitosamente'
      )
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (isError) {
      showNotification(
        'warning',
        'Error',
        'Ocurrió un error al actualizar tu idea, por favor intentalo más tarde'
      )
    }
  }, [isError])

  return (
    <>
      <Formik
        initialValues={{
          title: editedData?.title,
          description: editedData?.description,
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
                    <FormItem label="Tu idea enviada">
                      <Field name="title">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              field={field}
                              size="md"
                              name="title"
                              value={values.title}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <FormItem label="Actualizar descripción">
                      <Field name="description">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              textArea
                              field={field}
                              size="md"
                              name="description"
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

              <div className="text-right mt-6 flex gap-4 justify-end">
                <Button
                  type="button"
                  variant="solid"
                  color="gray"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
                <Button type="submit" variant="solid" loading={isLoading}>
                  Actualizar
                </Button>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </>
  )
}

const RequestDetails = ({ currentRequest, dialogIsOpen, onClose }) => {
  return (
    <Dialog isOpen={dialogIsOpen} onClose={onClose} onRequestClose={onClose}>
      <h5 className="mb-4">Actualizar</h5>
      <MainContent currentRequest={currentRequest} onClose={onClose} />
    </Dialog>
  )
}

export default RequestDetails
