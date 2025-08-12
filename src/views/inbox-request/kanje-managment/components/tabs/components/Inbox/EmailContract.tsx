import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { formatDate } from '@/utils/formatDate'
import { truncateString } from '@/utils/truncateString'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { FaFileDownload } from 'react-icons/fa'
import ContentForm from './ContentForm'
import PDFDocument from './PDFDocument'

const MainContent = ({ currentEmail }) => {
  const emailInfo = { ...currentEmail }
  const latestContract = emailInfo?.contract?.[emailInfo?.contract?.length - 1]

  return (
    <div className="container-pdf">
      <div className="p-6 relative border dark:border-gray-700 flex flex-col w-full h-[400px] overflow-y-scroll">
        <div className="w-[97%] mt-2" />
        <div>
          <div className="mb-6">
            <img
              src="/img/logo/logo-light-full.png"
              className="w-auto object-cover h-8 md:h-12"
            />
          </div>
          <h1 className="text-lg font-semibold mb-4 w-full text-center uppercase">
            Orden de Canje
          </h1>

          <ContentForm values={emailInfo} />

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
                    `${emailInfo?.realtorOwner?.name || ''} ${
                      emailInfo?.realtorOwner?.lastName || 'No definido'
                    }`,
                    35
                  )}{' '}
                  {emailInfo?.realtorOwner?.rut &&
                    `- ${emailInfo?.realtorOwner?.rut}`}
                </div>
                <small className="text-[12px] text-gray-500/80">
                  {formatDate(latestContract?.ownerSignatureDate)}
                </small>
              </div>
            )}

            {latestContract?.applicantSignature && (
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
                    `${emailInfo?.requestingRealtor?.name || ''} ${
                      emailInfo?.requestingRealtor?.lastName || 'No definido'
                    }`,
                    35
                  )}{' '}
                  {emailInfo?.requestingRealtor?.rut &&
                    `- ${emailInfo?.requestingRealtor?.rut}`}
                </div>
                <small className="text-[12px] text-gray-500/80">
                  {formatDate(latestContract?.applicantSignatureDate)}
                </small>
              </div>
            )}
          </div>
          <div className="mt-4 w-full text-center font-normal dark:text-white flex justify-center flex-col">
            <small className="text-[13px]">Fecha de acuerdo</small>
            {formatDate(latestContract?.applicantSignatureDate)}
          </div>
          <div className="mt-6 w-full bg-sky-100 dark:bg-gray-700 text-center font-semibold border-t-2 border-t-gray-500">
            <span>Página 1 de 1</span>
            <p className="bg-white dark:bg-gray-800">
              <a href="https://procanje.com" target='_blank' rel='noreferrer' className="hover:underline">
                www.procanje.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const EmailContract = ({ dialogIsOpen, currentEmail, onClose }) => {
  return (
    <Dialog
      isOpen={dialogIsOpen}
      width={800}
      id="container-pdf"
      onClose={onClose}
      onRequestClose={onClose}
    >
      {/* Main dialog content */}
      <MainContent currentEmail={currentEmail} />

      <div className="text-right mt-6 gap-2 flex justify-end">
        <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="solid" onClick={onClose}>
          Entendido
        </Button>
        <PDFDownloadLink
          document={<PDFDocument emailInfo={currentEmail} />}
          fileName="Orden_de_canje.pdf"
        >
          {({ loading }) =>
            loading ? (
              'Preparando documento...'
            ) : (
              <Button
                variant="solid"
                color="gray"
                className="flex items-center"
              >
                <FaFileDownload className="text-lg mr-2" />
                Descargar
              </Button>
            )
          }
        </PDFDownloadLink>
      </div>
    </Dialog>
  )
}

export default EmailContract
