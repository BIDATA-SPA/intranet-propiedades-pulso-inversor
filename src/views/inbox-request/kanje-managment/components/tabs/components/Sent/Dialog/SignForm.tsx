import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { useRequestApplicantSignatureMutation } from '@/services/RtkQueryService'
import { formatDate } from '@/utils/formatDate'
import useNotification from '@/utils/hooks/useNotification'
import { truncateString } from '@/utils/truncateString'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { FaFileSignature } from 'react-icons/fa6'
import * as Yup from 'yup'
import { formateEmmitedDate } from '../../Inbox/ContractForm/ContentForm'
import ContentForm from './ContentForm'

type FormModel = {
  isSigned: boolean
}

const validationSchema = Yup.object().shape({
  isSigned: Yup.boolean().oneOf(
    [true],
    'Debe firmar el contrato para hacer valida este acuerdo'
  ),
})

const NewProjectForm = ({
  onClose,
  currentEmail,
}: {
  onClose: () => void
  currentEmail: any
}) => {
  const [formValues, setFormValues] = useState({
    ...currentEmail,
    ownerAmount: currentEmail?.contract?.[0]?.ownerAmount ?? 0,
    applicantAmount: currentEmail?.contract?.[0]?.applicantAmount ?? 0,
  })

  const { showNotification } = useNotification()
  const [
    requestApplicantSignature,
    { data, isLoading, isError, error, isSuccess },
  ] = useRequestApplicantSignatureMutation()

  const latestContract =
    formValues?.contract?.[formValues?.contract?.length - 1]

  const onSubmit = async (
    formValue: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(true)

    await requestApplicantSignature({
      kanjeoRequestId: Number(currentEmail?.id),
    })
  }

  useEffect(() => {
    if (data || isSuccess) {
      showNotification('success', 'Firmado', 'Acuerdo firmado exitosamente')
      onClose()
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return
    }
  }, [data, isSuccess])

  useEffect(() => {
    if (error || isError) {
      showNotification(
        'danger',
        'Error',
        'Ocurrió un error al firmar el acuerdo, por favor intenta más tarde.'
      )
      onClose()
      return
    }
  }, [error, isError])

  return (
    <Formik
      initialValues={{
        ...formValues,
        isSigned: false,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values, setSubmitting)
      }}
    >
      {({ values, touched, errors, isValid, dirty }) => (
        <Form className="p-6 relative border dark:border-gray-700 flex flex-col w-full h-[520px] overflow-y-scroll">
          <FormContainer>
            <div className="mb-10">
              <img
                src="/img/logo/logo-light-full.png"
                className="w-auto object-cover h-8 md:h-12"
              />
            </div>
            <h1 className="text-lg font-semibold mb-4 w-full text-center uppercase">
              Orden de Canje
            </h1>

            <ContentForm values={formValues} />

            <FormItem
              invalid={Boolean(errors.isSigned && touched.isSigned)}
              errorMessage={errors.isSigned as any}
            >
              <label className="text-lg flex items-center cursor-pointer">
                <Field type="checkbox" name="isSigned" className="mr-2" />
                <FaFileSignature
                  className={`text-xl mx-2 ${
                    values.isSigned
                      ? 'text-green-500'
                      : 'text-gray-500 dark:text-white'
                  }`}
                />
                <span className="text-xl">
                  {values.isSigned ? 'Firmado' : 'Firmar contrato'}
                </span>
              </label>
            </FormItem>

            <div className="w-[100%] md:w-[80%] mx-auto flex justify-between items-center">
              {latestContract?.ownerSignature && (
                <div className="w-[45%] text-center">
                  <div className="flex flex-col justify-center items-center border-b-2 w-[100%] py-2 dark:border-gray-700">
                    <img
                      src="/img/contracts/check.png"
                      alt="signature"
                      className="w-auto h-14"
                    />
                    <h3 className="text-sm mt-3">Firmado</h3>
                  </div>
                  <div className="w-[100%] tex-center pt-2">
                    {truncateString(
                      `${formValues?.realtorOwner?.name || ''} ${
                        formValues?.realtorOwner?.lastName || 'No definido'
                      }`,
                      35
                    )}{' '}
                    {formValues?.realtorOwner?.rut &&
                      `- ${formValues?.realtorOwner?.rut}`}
                  </div>
                  <small className="text-[12px] text-gray-500/80">
                    {formatDate(latestContract?.ownerSignatureDate)}
                  </small>
                </div>
              )}

              {values.isSigned && (
                <div className="w-[45%] text-center">
                  <div className="flex flex-col justify-center items-center text-center border-b-2 py-2 dark:border-gray-700">
                    <img
                      src="/img/contracts/check.png"
                      alt="signature"
                      className="w-auto h-14"
                    />
                    <h3 className="text-sm mt-3 text-center">Firmado</h3>
                  </div>
                  <div className="w-[100%] tex-center pt-2">
                    {truncateString(
                      `${formValues?.requestingRealtor?.name || ''} ${
                        formValues?.requestingRealtor?.lastName || 'No definido'
                      }`,
                      35
                    )}{' '}
                    {formValues?.requestingRealtor?.rut &&
                      `- ${formValues?.requestingRealtor?.rut}`}
                  </div>
                  <small className="text-[12px] text-gray-500/80">
                    {formateEmmitedDate(new Date())}
                  </small>
                </div>
              )}
            </div>

            <div className="mt-10">
              <Button
                block
                variant="solid"
                type="submit"
                disabled={!isValid || !dirty || !values.isSigned}
                loading={isLoading}
              >
                Enviar
              </Button>
            </div>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
}

export default NewProjectForm
