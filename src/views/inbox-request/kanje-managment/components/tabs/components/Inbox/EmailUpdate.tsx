/* eslint-disable react-hooks/exhaustive-deps */
import { AdaptableCard } from '@/components/shared'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import {
  useGetAllStatusesQuery,
  useUpdateKanjeoRequestsStatusMutation,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Form, Formik } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect, useState } from 'react'
import { InitialData } from '../../../../definitions'
import { validationSchema } from '../../../../schema'
import CustomSelect from './CustomSelect'
import ApprovedRequest from './RequestDialog/ApprovedRequest'
import RejectedRequest from './RequestDialog/RejectedRequest'

export type FormModel = InitialData

type TStatusValue = {
  value: number
  label: string
}

const intialStatusValue: TStatusValue = {
  value: 1,
  label: 'Pendiente',
}

const MainContent = ({ currentEmail, onClose }) => {
  const { showNotification } = useNotification()
  const { data: statuses, error } = useGetAllStatusesQuery({
    transformToSelectOptions: true,
  })
  const [
    updateKanjeoRequestsStatus,
    {
      isLoading: isStatusLoading,
      isSuccess: isStatusSucces,
      error: statusError,
    },
  ] = useUpdateKanjeoRequestsStatusMutation()
  const [requestStatus, setRequestStatus] = useState(intialStatusValue)
  const [isContractSigned, setIsContractSigned] = useState(false)
  const [isShareable, setIsShareable] = useState(false)
  const [ownerAmount, setOwnerAmount] = useState('')
  const [applicantAmount, setApplicantAmount] = useState('')
  const defaultStatusesSelect = currentEmail?.status && {
    value: currentEmail?.status?.id,
    label: currentEmail?.status?.name,
  }

  const onSubmit = async (values: FormModel, { setSubmitting }) => {
    setSubmitting(true)
    const formData = cloneDeep({
      ...values,
      ownerAmount: ownerAmount,
      applicantAmount: applicantAmount,
      isShareable: isShareable,
    })

    await updateKanjeoRequestsStatus(formData)
    setSubmitting(false)
    onClose()
    setTimeout(() => {
      window.location.reload()
    }, 800)
  }

  useEffect(() => {
    if (isStatusSucces) {
      showNotification('success', 'Éxito', 'Solicitud actualizada exitosamente')
    }
  }, [isStatusSucces])

  useEffect(() => {
    if (statusError) {
      showNotification(
        'danger',
        'Error',
        'Error al actualizar el estado de solicitud, inténtalo más tarde'
      )
    }
  }, [statusError])

  const [subDialogIsOpen, setSubDialogIsOpen] = useState({
    approveContract: false,
    rejectContract: false,
  })

  const onApproveContractOpen = () => {
    setSubDialogIsOpen({
      approveContract: true,
      rejectContract: false,
    })
  }

  const onDialogClose = () => {
    setSubDialogIsOpen({
      approveContract: false,
      rejectContract: false,
    })
  }

  const handleSelectStatus = (option: { value: number; label: string }) => {
    if (
      !Object.values(option).includes(2) ||
      !Object.values(option).includes('Aprobada')
    ) {
      setIsContractSigned(false)
      setOwnerAmount('')
      setApplicantAmount('')
      setIsShareable(false)
    }
    setRequestStatus(option)
  }

  // Disable submit button (if option is approbed and contract is not signed)
  const disableSubmitBtn = (option) => {
    return (
      (option.label === 'Aprobada' && !isContractSigned) ||
      defaultStatusesSelect?.label === 'Aprobada'
    )
  }

  return (
    <>
      <Formik
        initialValues={{
          requestId: Number(currentEmail?.id),
          statusId: Number(currentEmail?.status?.id),
          ownerAmount: ownerAmount,
          applicantAmount: applicantAmount,
          isShareable: isShareable,
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            {error && <p>Error al obtener los estados</p>}
            <FormContainer>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto p-3">
                <div className="lg:col-span-3">
                  <AdaptableCard>
                    <div className="col-span-1">
                      <FormItem label="Actualizar estado de solicitud">
                        <CustomSelect
                          isDisabled={
                            defaultStatusesSelect?.value === 2 ||
                            defaultStatusesSelect?.label === 'Aprobada'
                          }
                          options={statuses}
                          defaultValue={defaultStatusesSelect}
                          onChange={(selectedOption) => {
                            setFieldValue('statusId', selectedOption.value)
                            handleSelectStatus(selectedOption)
                          }}
                        />
                      </FormItem>
                    </div>

                    {requestStatus.value === 1 ||
                      (requestStatus.label === 'Aprobada' && (
                        <Alert
                          showIcon
                          className=""
                          type={isContractSigned ? 'success' : 'info'}
                        >
                          {isContractSigned
                            ? 'Contrato firmado, ahora haz clic en "Envia" para hacer saber a tu contraparte.'
                            : 'Para poder aprobar esta solicitud de canje, debes firmar el siguiente contrato'}{' '}
                          {isContractSigned ? null : (
                            <button
                              role="button"
                              type="button"
                              className="underline hover:text-blue-600"
                              onClick={() => onApproveContractOpen()}
                            >
                              Firmar
                            </button>
                          )}
                        </Alert>
                      ))}
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
                  disabled={disableSubmitBtn(requestStatus)}
                  type="submit"
                  variant="solid"
                  loading={isStatusLoading}
                >
                  Enviar
                </Button>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>

      {/* Approved request modal */}
      {subDialogIsOpen.approveContract && requestStatus?.value === 2 && (
        <ApprovedRequest
          currentEmail={currentEmail}
          isOpen={subDialogIsOpen.approveContract}
          isContractSigned={isContractSigned}
          setIsContractSigned={setIsContractSigned}
          ownerAmount={ownerAmount}
          setOwnerAmount={setOwnerAmount}
          applicantAmount={applicantAmount}
          isShareable={isShareable}
          setIsShareable={setIsShareable}
          setApplicantAmount={setApplicantAmount}
          onClose={onDialogClose}
        />
      )}

      {/* Rejected request modal */}
      {subDialogIsOpen.rejectContract && requestStatus?.value === 3 && (
        <RejectedRequest
          currentEmail={currentEmail}
          isOpen={subDialogIsOpen.rejectContract}
          onClose={onDialogClose}
        />
      )}
    </>
  )
}

const EmailUpdate = ({ dialogIsOpen, currentEmail, onClose }) => {
  return (
    <>
      <Dialog isOpen={dialogIsOpen} onClose={onClose} onRequestClose={onClose}>
        <h5 className="mb-4">Actualizar estado</h5>
        <MainContent currentEmail={currentEmail} onClose={onClose} />
      </Dialog>
    </>
  )
}

export default EmailUpdate
