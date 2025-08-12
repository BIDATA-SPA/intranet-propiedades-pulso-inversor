/* eslint-disable react-hooks/exhaustive-deps */
import { AdaptableCard } from '@/components/shared'
import { Input, Select, Spinner, Switcher } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import {
  useGetMyInfoQuery,
  useGetServiceRequestDatesQuery,
  useGetServiceRequestPricesQuery,
  useGetServiceRequestTypesQuery,
  useSendServiceRequestBrandMutation,
  useUpdateUserMutation,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { TSelect } from '@/utils/types/new-property/selects'
import { Field, FieldProps, Form, Formik } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { _emailRequestBrandData } from '../constants'
import { validationSchema } from '../schema'
import BenefitItems from './dialog/BenefitItems'

const { to, subject, message, cc } = _emailRequestBrandData

const ContactArea = () => {
  const { data } = useGetMyInfoQuery({}, { refetchOnMountOrArgChange: true })
  const { showNotification } = useNotification()
  const [updateUser, { isSuccess, isLoading, isError }] =
    useUpdateUserMutation()
  const [updatePhone, setUpdatePhone] = useState(data?.phone)
  const [enabledUpdateBtn, setEnabledUpdateBtn] = useState<boolean>(true)

  const handleUpdatePhone = (e) => {
    if (e) {
      setEnabledUpdateBtn(false)
      setUpdatePhone(e.target.value)
    }
  }

  const onUpdateSubmit = async (event) => {
    event.preventDefault()

    const body = {
      phone: updatePhone,
    }

    await updateUser({ id: data?.id, ...body }).unwrap()
  }

  useEffect(() => {
    setUpdatePhone(data?.phone)
  }, [data?.phone])

  useEffect(() => {
    if (isSuccess) {
      showNotification(
        'success',
        'Información actualizada',
        'Teléfono/Celular actualizado exitosamente'
      )
      setEnabledUpdateBtn(false)
    }
    if (isError) {
      showNotification(
        'warning',
        'Error',
        'Ocurrió un error al actualizar tus datos, por favor intenta más tarde'
      )
      setEnabledUpdateBtn(false)
    }
  }, [isSuccess, isError, isLoading])

  return (
    <div>
      <div className="mb-3">
        <h5>Información de contacto</h5>
        <p>
          Tu información de contacto nos ayudará a comunicarte de forma más
          dinámica.
        </p>
      </div>
      <div className="border p-3 rounded-lg dark:border-gray-700">
        <FormItem label="Email de contacto">
          <Field name="requestingRealtorEmail">
            {({ field }: FieldProps) => {
              return (
                <Input
                  disabled
                  readOnly
                  prefix={<MdEmail className="text-xl" />}
                  field={field}
                  type="text"
                  size="md"
                  value={data?.session?.email}
                />
              )
            }}
          </Field>
        </FormItem>
        <div className="w-full">
          <div>
            <FormItem label="Telefono/Celular">
              <Field name="phone">
                {({ field }: FieldProps) => {
                  return (
                    <Input
                      prefix={<MdEmail className="text-xl" />}
                      field={field}
                      type="text"
                      size="md"
                      className="mb-2 border-sky-500/60 border-[3px] rounded-lg"
                      value={updatePhone}
                      onChange={handleUpdatePhone}
                    />
                  )
                }}
              </Field>
              <span>
                Si este campo no está completo o no es correcto, puedes
                actualizarlo.
              </span>
            </FormItem>
          </div>
          <div className="flex justify-start items-center">
            <Button
              type="button"
              variant="solid"
              size="sm"
              loading={isLoading}
              disabled={enabledUpdateBtn}
              onClick={onUpdateSubmit}
            >
              Actualizar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

const MainContent = ({ onClose }) => {
  const { data } = useGetMyInfoQuery({}, { refetchOnMountOrArgChange: true })

  const [isQuestionCircleOpen, setIsQuestionCircleOpen] = useState(false)
  const { showNotification } = useNotification()
  const {
    data: rangePriceOptions,
    isFetching: isFetchingRangePrices,
    isError: isErrorRangePrices,
  } = useGetServiceRequestPricesQuery(null)
  const {
    data: startDateOptions,
    isFetching: isFetchingStartDate,
    isError: isErrorStartDate,
  } = useGetServiceRequestDatesQuery(null)
  const {
    data: serviceTypesOptions,
    isFetching: isFetchingServiceTypes,
    isError: isErrorServiceTypes,
  } = useGetServiceRequestTypesQuery(null)
  const [
    sendServiceRequestBrand,
    {
      isLoading: isLoadingServiceRequest,
      isSuccess: isSuccessServiceRequest,
      isError: isErrorServiceRequest,
    },
  ] = useSendServiceRequestBrandMutation()
  const [showInfoDialog, setShowInfoDialog] = useState<boolean>(false)

  const handleOpenInfo = () => setShowInfoDialog(true)
  const handleCloseInfo = () => setShowInfoDialog(false)

  const onQuestionCircleDialogClose = (e) => {
    e.preventDefault()
    setIsQuestionCircleOpen(false)
  }

  const onSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    const body = cloneDeep(values)
    await sendServiceRequestBrand({ ...body })
    onClose()
  }

  useEffect(() => {
    if (isErrorRangePrices) {
      showNotification(
        'warning',
        'Error',
        'Ocurrió un error al cargar las opciones del formulario del formulario (Rango de precios), por favor intenta más tarde'
      )
    }
  }, [isErrorRangePrices])

  useEffect(() => {
    if (isErrorStartDate) {
      showNotification(
        'warning',
        'Error',
        'Ocurrió un error al cargar las opciones del formulario del formulario (Fecha de inicio), por favor intenta más tarde'
      )
    }
  }, [isErrorStartDate])

  useEffect(() => {
    if (isErrorServiceTypes) {
      showNotification(
        'warning',
        'Error',
        'Ocurrió un error al cargar las opciones del formulario del formulario (Servicios), por favor intenta más tarde'
      )
    }
  }, [isErrorServiceTypes])

  useEffect(() => {
    if (isSuccessServiceRequest) {
      showNotification(
        'success',
        'Exito',
        'Solicitud enviada exitosamente Te contactaremos pronto.'
      )
    }
  }, [isSuccessServiceRequest])

  useEffect(() => {
    if (isErrorServiceRequest) {
      showNotification(
        'danger',
        'Error',
        'Ha habido un error al crear la solicitud, por favor intenta más tarde.'
      )
    }
  }, [isErrorServiceRequest])

  return (
    <>
      <Formik
        initialValues={{
          startCampaign: true,
          priceRangeId: null,
          startDateRangeId: null,
          toBeContacted: true,
          serviceTypeId: 3,
          emailToSend: {
            to,
            realtorFrom: data?.session?.email,
            subject,
            message,
            cc: [...cc, data?.session?.email],
            requestingRealtorEmail: data?.session?.email,
          },
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors }) => {
          return (
            <Form>
              <FormContainer className="h-[450px] mx-h-[450px] overflow-y-scroll p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto  p-3">
                  <div className="lg:col-span-3">
                    <AdaptableCard>
                      <div className="relative w-full flex justify-center items-center">
                        <FormItem
                          className="relative w-full"
                          label="¿Te gustaría iniciar una campaña de marketing con nosotros y mejorar la imagen de tu página web?"
                        >
                          <div className="w-full flex justify-center items-center my-2">
                            <button
                              type="button"
                              className="flex items-center hover:underline hover:text-cyan-500"
                              onClick={handleOpenInfo}
                            >
                              <FaInfoCircle className="mr-1" />
                              ¿De qué se trata?
                            </button>
                          </div>

                          <Field name="startCampaign">
                            {({ field, form }: FieldProps) => {
                              return (
                                <div className="w-full flex justify-center">
                                  <Switcher
                                    checked={values.startCampaign}
                                    className="mt-4"
                                    onChange={() => {
                                      form.setFieldValue(
                                        field.name,
                                        !values.startCampaign
                                      )
                                    }}
                                  />
                                </div>
                              )
                            }}
                          </Field>
                          <span className="flex relative justify-center my-2">
                            No/Sí
                          </span>
                        </FormItem>
                      </div>

                      {isFetchingServiceTypes ? (
                        <Spinner />
                      ) : (
                        <div className="grid grid-cols-1 gap-0 md:gap-5">
                          <FormItem
                            asterisk
                            label="Servicio"
                            invalid={
                              (errors.serviceTypeId &&
                                errors.serviceTypeId) as boolean
                            }
                            errorMessage={errors.serviceTypeId}
                          >
                            <Field name="serviceTypeId">
                              {({ field, form }: FieldProps) => (
                                <Select
                                  isDisabled
                                  isClearable
                                  field={field}
                                  form={form}
                                  placeholder="Seleccionar..."
                                  options={serviceTypesOptions}
                                  value={serviceTypesOptions?.filter(
                                    (option: TSelect) =>
                                      option.value === '3' ||
                                      option.label === 'Diseña tu web'
                                  )}
                                  onChange={(option) =>
                                    form.setFieldValue(
                                      field.name,
                                      Number(option?.value)
                                    )
                                  }
                                />
                              )}
                            </Field>
                          </FormItem>
                        </div>
                      )}

                      {isFetchingRangePrices ? (
                        <Spinner />
                      ) : (
                        <div className="grid grid-cols-1 gap-0 md:gap-5">
                          <FormItem
                            asterisk
                            label="¿Cuánto es su presupuesto para su nueva campaña?"
                            invalid={
                              (errors.priceRangeId &&
                                errors.priceRangeId) as boolean
                            }
                            errorMessage={errors.priceRangeId}
                          >
                            <Field name="priceRangeId">
                              {({ field, form }: FieldProps) => (
                                <Select
                                  isClearable
                                  field={field}
                                  form={form}
                                  placeholder="Seleccionar..."
                                  options={rangePriceOptions}
                                  value={rangePriceOptions?.filter(
                                    (option: TSelect) =>
                                      option.value === values.priceRangeId
                                  )}
                                  onChange={(option) =>
                                    form.setFieldValue(
                                      field.name,
                                      option?.value
                                    )
                                  }
                                />
                              )}
                            </Field>
                          </FormItem>
                        </div>
                      )}

                      {isFetchingStartDate ? (
                        <Spinner />
                      ) : (
                        <div className="grid grid-cols-1 gap-0 md:gap-5">
                          <FormItem
                            asterisk
                            label="¿Cuándo quiere comenzar con su compaña?"
                            invalid={
                              (errors.startDateRangeId &&
                                errors.startDateRangeId) as boolean
                            }
                            errorMessage={errors.startDateRangeId}
                          >
                            <Field name="startDateRangeId">
                              {({ field, form }: FieldProps) => (
                                <Select
                                  isClearable
                                  field={field}
                                  form={form}
                                  placeholder="Seleccionar..."
                                  options={startDateOptions}
                                  value={startDateOptions?.filter(
                                    (option: TSelect) =>
                                      option.value === values.startDateRangeId
                                  )}
                                  onChange={(option) =>
                                    form.setFieldValue(
                                      field.name,
                                      option?.value
                                    )
                                  }
                                />
                              )}
                            </Field>
                          </FormItem>
                        </div>
                      )}

                      <FormItem label="¿Desea que nos contactemos con usted?">
                        <Field name="toBeContacted">
                          {({ field, form }: FieldProps) => {
                            return (
                              <Switcher
                                checked={values.toBeContacted}
                                className="mt-4"
                                onChange={() => {
                                  form.setFieldValue(
                                    field.name,
                                    !values.toBeContacted
                                  )
                                }}
                              />
                            )
                          }}
                        </Field>
                        <span className="h-[20px] mt-10 my-10 absolute top-1.5 ml-2">
                          No/Sí
                        </span>
                      </FormItem>

                      {values?.toBeContacted && <ContactArea />}
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
                  <Button
                    type="submit"
                    variant="solid"
                    loading={isLoadingServiceRequest}
                  >
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

      {showInfoDialog && (
        <Dialog
          isOpen={showInfoDialog}
          height={550}
          onClose={handleCloseInfo}
          onRequestClose={handleCloseInfo}
        >
          <h5 className="mb-4">Beneficios - Diseña tu marca</h5>
          <BenefitItems />
          <div className="text-right mt-6">
            <Button variant="solid" onClick={handleCloseInfo}>
              Entendido
            </Button>
          </div>
        </Dialog>
      )}
    </>
  )
}

const RequestCreate = ({ dialogIsOpen, onClose }) => {
  return (
    <Dialog
      isOpen={dialogIsOpen}
      width={600}
      onClose={onClose}
      onRequestClose={onClose}
    >
      <h5 className="mb-4">Nueva Solicitud</h5>
      <MainContent onClose={onClose} />
    </Dialog>
  )
}

export default RequestCreate
