import { AdaptableCard } from '@/components/shared'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import { useGetSupportCategoriesQuery } from '@/services/RtkQueryService'
import { Field, FieldProps, Form, Formik } from 'formik'
import { InitialData } from '../definitions'
import { validationSchema } from '../schema'

export type FormModel = InitialData

type TServerError = {
  message: string
}

const MainContent = ({ currentRequest, onClose }) => {
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
    error,
    refetch,
  } = useGetSupportCategoriesQuery()
  const editedData = { ...currentRequest }

  const typedError = error as TServerError

  const categoryOptions = categories?.map((category) => ({
    value: category.id,
    label: category.name,
    imgPath: category.image,
  }))

  const onSubmit = () => {
    onClose()
  }

  if (categoriesIsLoading)
    return (
      <div className="w-100 h-100 flex justify-center items-center">
        <Spinner className="mr-4" size="40px" />
      </div>
    )

  if (categoriesIsError || !categories) {
    return (
      <div className="w-100 h-100 flex justify-center items-center">
        <Alert
          showIcon
          type="warning"
          title={`${typedError?.message}` || 'Error de servidor'}
          className="w-screen flex justify-start items-start"
        >
          <span
            role="button"
            className="hover:underline"
            onClick={() => refetch()}
          >
            Reintentar
          </span>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <Formik
        initialValues={{
          categoryId: editedData?.category?.name,
          comment: editedData?.comment,
          id: editedData?.id,
          response: editedData?.response?.response,
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
                    <div className="col-span-1">
                      <FormItem label="Categoría">
                        <Field readOnly name="categoryId">
                          {({ field, form }: FieldProps) => (
                            <Select
                              isDisabled
                              field={field}
                              form={form}
                              options={categoryOptions}
                              value={{
                                value: editedData.category?.id,
                                label: editedData.category?.name,
                              }}
                              onChange={(option) =>
                                form.setFieldValue(field.name, option?.value)
                              }
                            />
                          )}
                        </Field>
                      </FormItem>
                    </div>

                    <FormItem label="Comentario">
                      <Field name="comment">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              disabled
                              textArea
                              field={field}
                              size="md"
                              name="comment"
                              value={values.comment}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                          )
                        }}
                      </Field>
                    </FormItem>

                    {values?.response ? (
                      <FormItem label="Respuesta a solicitud">
                        <Field name="response">
                          {({ field, form }: FieldProps<FormModel>) => {
                            return (
                              <Input
                                disabled
                                textArea
                                field={field}
                                size="md"
                                name="response"
                                value={editedData?.response?.response}
                                onChange={(e) => {
                                  form.setFieldValue(field.name, e.target.value)
                                }}
                              />
                            )
                          }}
                        </Field>
                      </FormItem>
                    ) : (
                      'Tu solicitud aún no ha sido respondida.'
                    )}
                  </AdaptableCard>
                </div>
              </div>

              <div className="text-right mt-6">
                <Button type="button" variant="solid" onClick={onClose}>
                  Cerrar
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
      <h5 className="mb-4">Detalles de solicitud</h5>
      <MainContent currentRequest={currentRequest} onClose={onClose} />
    </Dialog>
  )
}

export default RequestDetails
