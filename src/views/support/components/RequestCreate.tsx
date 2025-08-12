/* eslint-disable react-hooks/exhaustive-deps */
import { AdaptableCard } from '@/components/shared'
import { Tooltip } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import {
  useGetSupportCategoriesQuery,
  useSendSupportRequestMutation,
} from '@/services/RtkQueryService'
import { formatRut } from '@/utils/format-rut'
import useNotification from '@/utils/hooks/useNotification'
import { Field, FieldProps, Form, Formik } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useState } from 'react'
import { FaRegQuestionCircle } from 'react-icons/fa'
import { InitialData } from '../definitions'
import { validationSchema } from '../schema'

type TServerError = {
  message: string
}

export type FormModel = InitialData

const MainContent = ({ onClose }) => {
  const [isQuestionCircleOpen, setIsQuestionCircleOpen] = useState(false)
  const { showNotification } = useNotification()
  const {
    data: categories,
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
    error,
    refetch,
  } = useGetSupportCategoriesQuery()
  const [sendSupportRequest, { data, isLoading, isSuccess, error: sentError }] =
    useSendSupportRequestMutation()

  const typedError = error as TServerError

  const categoryOptions = categories?.map((category) => ({
    value: category.id,
    label: category.name,
    imgPath: category.image,
  }))

  // question circle dialog
  const openQuestionCircleDialog = () => {
    setIsQuestionCircleOpen(true)
  }

  const onQuestionCircleDialogClose = (e) => {
    e.preventDefault()
    setIsQuestionCircleOpen(false)
  }

  const onSubmit = async (values: FormModel, { setSubmitting }) => {
    setSubmitting(true)
    const body = cloneDeep(values)
    await sendSupportRequest({ ...body })
  }

  useEffect(() => {
    if (data || isSuccess) {
      showNotification('success', 'Enviada', 'Solicitud enviada correctamente')
      onClose()
      return
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (error || sentError) {
      showNotification(
        'danger',
        'Error',
        'Ocurrió un error al enviar tu solicitud, por favor intenta más tarde.'
      )
      onClose()
      return
    }
  }, [error, sentError])

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
          categoryId: '',
          rut: '',
          comment: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, touched, errors, setFieldValue }) => {
          return (
            <Form>
              <FormContainer>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto overflow-y-scroll max-h-96 p-3">
                  <div className="lg:col-span-3">
                    <AdaptableCard>
                      <div className="col-span-1">
                        <FormItem
                          label="Categoría"
                          invalid={
                            (errors.categoryId && touched.categoryId) as boolean
                          }
                          errorMessage={errors.categoryId}
                        >
                          <Field name="categoryId">
                            {({ field, form }: FieldProps) => (
                              <Select
                                field={field}
                                form={form}
                                options={categoryOptions}
                                value={categoryOptions?.filter(
                                  (category) =>
                                    category.value === values.categoryId
                                )}
                                onChange={(option) => {
                                  form.setFieldValue(field.name, option?.value)
                                  if (
                                    option?.value !== 6 ||
                                    option?.label ===
                                      'Comportamiento de cliente/a'
                                  ) {
                                    setFieldValue('rut', '')
                                  }
                                }}
                              />
                            )}
                          </Field>
                        </FormItem>
                      </div>
                      {values?.categoryId === 6 && (
                        <div className="flex justify-between">
                          <div className="w-[85%]">
                            <FormItem
                              asterisk
                              label="RUT"
                              invalid={errors.rut && touched.rut}
                              errorMessage={errors.rut}
                            >
                              <Field name="rut">
                                {({ field, form }: FieldProps<FormModel>) => (
                                  <Input
                                    type="text"
                                    field={field}
                                    size="md"
                                    placeholder="00.000.000-0"
                                    value={values.rut}
                                    maxLength={12}
                                    onChange={(e) => {
                                      const formattedValue = formatRut(
                                        e.target.value
                                      )
                                      form.setFieldValue(
                                        field.name,
                                        formattedValue
                                      )
                                    }}
                                  />
                                )}
                              </Field>
                              <small>Con puntos y guion.</small>
                            </FormItem>
                          </div>
                          <div className="w-[12%] flex justify-center items-center mb-6">
                            <Tooltip title="¿Por qué esta información?">
                              <button
                                type="button" // Añadido type="button" para evitar enviar el formulario
                                className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                                onClick={() => openQuestionCircleDialog()}
                              >
                                <i>
                                  <FaRegQuestionCircle className="text-2xl text-blue-500" />
                                </i>
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      )}
                      <FormItem label="Comentario">
                        <Field name="comment">
                          {({ field, form }: FieldProps<FormModel>) => {
                            return (
                              <Input
                                textArea
                                field={field}
                                size="md"
                                name="comment"
                                placeholder="Ingresar comentario..."
                                value={values.comment}
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
          )
        }}
      </Formik>

      {isQuestionCircleOpen && (
        <>
          <Dialog
            isOpen={isQuestionCircleOpen}
            onClose={onQuestionCircleDialogClose}
            onRequestClose={onQuestionCircleDialogClose}
          >
            <h5 className="mb-4">¿Por qué se solicita esta información?</h5>
            <p>
              {`Al ser seleccionada la categoría "Comportamiento de Cliente/a", los corredores pueden solicitar una pequeña amonestación a un cliente en específico. Así podremos identificar a clientes con comportamientos inadecuados o que solo buscan molestar o no se comprometen de forma coherente en la relación cliente/corredor. Esta herramienta permite compartir esta información entre corredores, ayudando a evitar interacciones no deseadas.`}
            </p>
            <div className="text-right mt-6">
              <Button
                type="button"
                variant="solid"
                onClick={onQuestionCircleDialogClose}
              >
                Entendido
              </Button>
            </div>
          </Dialog>
        </>
      )}
    </>
  )
}

const RequestCreate = ({ dialogIsOpen, onClose }) => {
  return (
    <Dialog isOpen={dialogIsOpen} onClose={onClose} onRequestClose={onClose}>
      <h5 className="mb-4">Nueva Solicitud</h5>
      <MainContent onClose={onClose} />
    </Dialog>
  )
}

export default RequestCreate
