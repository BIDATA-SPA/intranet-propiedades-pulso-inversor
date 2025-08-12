import { Alert, Checkbox } from '@/components/ui'
import Button from '@/components/ui/Button'
import { truncateString } from '@/utils/truncateString'
import { formatDate } from '@fullcalendar/core'
import React, { useEffect, useState } from 'react'
import { FaFileSignature } from 'react-icons/fa6'
import { RiShareLine } from 'react-icons/ri'
import ContentForm from './ContentForm'

type ContractFormProps = {
  currentEmail: any
  onClose: () => void
  isContractSigned: boolean
  setIsContractSigned: (value: boolean) => void
  ownerAmount: string | number
  setOwnerAmount: (value: string | number) => void
  applicantAmount: string | number
  setApplicantAmount: (value: string | number) => void
  isShareable: boolean
  setIsShareable: (value: boolean) => void
}

const ContractForm: React.FC<ContractFormProps> = ({
  currentEmail,
  onClose,
  isContractSigned,
  setIsContractSigned,
  ownerAmount,
  setOwnerAmount,
  applicantAmount,
  setApplicantAmount,
  isShareable,
  setIsShareable,
}) => {
  const [formValues, setFormValues] = useState({
    ...currentEmail,
    date: formatDate(new Date()),
    isOwnerSignature: false,
  })

  const onCheck = (value: boolean) => {
    setIsContractSigned(value)
  }

  const onCheckShareable = (value: boolean) => {
    setIsShareable(value)
  }

  const onCancel = () => {
    setIsContractSigned(false)
    onClose()
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    onClose()
  }

  const handleOwnerAmountChange = (e) => {
    setOwnerAmount(e.target.value)
  }

  const handleApplicantAmountChange = (e) => {
    setApplicantAmount(e.target.value)
  }

  // Uncheck is shareable input if it not document signed
  useEffect(() => {
    if (!isContractSigned) {
      setIsShareable(false)
    }
  }, [isContractSigned, isShareable])

  return (
    <>
      <form
        className="p-6 relative border dark:border-gray-700"
        onSubmit={handleSubmit}
      >
        <div className="mb-10">
          <img
            src="/img/logo/logo-light-full.png"
            className="w-auto object-cover h-8 md:h-12"
          />
        </div>
        <h1 className="text-lg font-semibold mb-4 w-full text-center uppercase">
          Orden de Canje
        </h1>
        <ContentForm
          values={formValues}
          ownerAmount={ownerAmount}
          applicantAmount={applicantAmount}
          onOwnerAmountChange={handleOwnerAmountChange}
          onApplicantAmountChange={handleApplicantAmountChange}
        />

        <div className="flex items-center">
          <Checkbox
            defaultChecked={isContractSigned}
            className="flex items-center hover:underline flex-row"
            onChange={onCheck}
          >
            <div className="flex items-center hover:underline flex-row  dark:text-white">
              <FaFileSignature
                className={`text-xl mx-2 ${
                  isContractSigned
                    ? 'text-green-500'
                    : 'text-gray-500  dark:text-white'
                }`}
              />
              <span className="text-xl">
                {isContractSigned ? 'Firmado' : 'Firmar contrato'}
              </span>
            </div>
          </Checkbox>
        </div>

        <Checkbox
          checked={isShareable}
          className="flex items-center hover:underline flex-row my-4"
          onChange={onCheckShareable}
          disabled={!isContractSigned}
        >
          <div className="flex items-center hover:underline flex-row  dark:text-white">
            <RiShareLine
              className={`text-xl mx-2 ${
                isShareable
                  ? 'text-green-500'
                  : 'text-gray-500  dark:text-white'
              }`}
            />
            <span className="text-xl">
              {isShareable
                ? 'Permiso Aprobado'
                : 'Conceder permiso de publicación'}
            </span>
          </div>
        </Checkbox>

        {isShareable && (
          <Alert showIcon className="mb-4" type="info">
            Al conceder el permiso de publicación de esta propiedad, el corredor
            solicitante contará con el total derecho a publicar esta propiedad
            en los diferentes medios digitales como: Portales de propiedades,
            páginas web y redes sociales.
          </Alert>
        )}

        {isContractSigned && (
          <div className="text-center">
            <div className="flex flex-col justify-center items-center border-b-2 w-[50%] py-5 dark:border-gray-700">
              <img
                src="/img/contracts/check.png"
                alt="signature"
                className="w-auto h-14"
              />
              <h3 className="text-sm mt-3">Firmado</h3>
            </div>
            <div className="w-[50%] tex-center pt-2">
              {truncateString(
                `${formValues?.realtorOwner?.name || ''} ${
                  formValues?.realtorOwner?.lastName || 'No definido'
                }`,
                35
              )}{' '}
              {formValues?.realtorOwner?.rut &&
                `- ${formValues?.realtorOwner?.rut}`}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 right-0 left-0 p-2 rounded-lg pr-16 mt-10 bg-white dark:bg-gray-800 w-full flex justify-end">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button variant="solid" onClick={onClose}>
            Guardar firma
          </Button>
        </div>
        <div className="mt-20 mb-14 w-full bg-sky-100 dark:bg-gray-700 text-center font-semibold border-t-2 border-t-gray-500">
          <span className="text-black dark:text-white">Página 1 de 1</span>
          <p className="bg-white dark:bg-gray-800">
            <a
              href="https://procanje.com/"
              target="_blank"
              className="hover:underline"
              rel="noreferrer"
            >
              www.procanje.com
            </a>
          </p>
        </div>
      </form>
    </>
  )
}

export default ContractForm
