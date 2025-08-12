import type { AvatarProps } from '@/components/ui/Avatar'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Timeline from '@/components/ui/Timeline'
import { formatDate } from '@/utils/formatDate'
import { useState } from 'react'
import { MdEmail, MdKeyboardArrowDown } from 'react-icons/md'

type TimelineAvatarProps = AvatarProps

const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
  return (
    <Avatar {...rest} size={25} shape="circle">
      {children}
    </Avatar>
  )
}

const TimeLineComponent = ({ email, currentEmail }) => {
  const [isOpenEmailDetails, setIsOpenEmailDetails] = useState<boolean>(false)

  const handleShowDetails = () => {
    setIsOpenEmailDetails(!isOpenEmailDetails)
  }

  return (
    <>
      <Timeline.Item
        media={
          <TimelineAvatar className={'bg-gray-500'}>
            <MdEmail />
          </TimelineAvatar>
        }
      >
        <div className="flex flex-col">
          <span className={`${'text-gray-800 dark:text-gray-300 font-bold'}`}>
            {`${currentEmail?.user?.name || '-'} ${
              currentEmail?.user?.lastName || '-'
            }`}{' '}
            <span className="text-gray-500/90 dark:text-gray-400 text-xs font-normal">
              {`<${email?.realtorEmail}>`}
            </span>
          </span>
          <span className="text-gray-500/90 dark:text-gray-400 text-xs">
            Para:{' '}
            {`${currentEmail?.externalService?.companyName || '-'} ${
              currentEmail?.externalService?.name || '-'
            }`}
          </span>
        </div>

        <div
          role="button"
          className="text-gray-600/90 text-xs mt-1 dark:text-gray-300 hover:text-gray-900 w-block w-28 text-center"
          onClick={handleShowDetails}
        >
          {isOpenEmailDetails ? (
            <span className="flex items-center">
              Ocultar detalles <MdKeyboardArrowDown className="rotate-180" />
            </span>
          ) : (
            <span className="flex items-center">
              Mostrar detalles <MdKeyboardArrowDown />
            </span>
          )}
        </div>

        {isOpenEmailDetails && (
          <div className="flex flex-col border rounded-md p-2 shadow-sm w-[97%]">
            <div className="flex flex-col">
              <div className="w-100 flex flex-row my-0.5">
                <span className="text-gray-500/90 dark:text-gray-400 text-xs w-[12%]">
                  de:
                </span>
                <span className="text-gray-700/90 dark:text-gray-300 text-xs w-[88%]">
                  {`${currentEmail?.user?.name || '-'} ${
                    currentEmail?.user?.lastName || '-'
                  }`}{' '}
                </span>
              </div>

              <div className="w-100 flex flex-row my-0.5">
                <span className="text-gray-500/90 dark:text-gray-400 text-xs w-[12%]">
                  para:
                </span>
                <span className="text-gray-700/90 dark:text-gray-300 text-xs w-[88%]">
                  {`${currentEmail?.externalService?.email || '-'}`}
                </span>
              </div>

              <div className="w-100 flex flex-row my-0.5">
                <span className="text-gray-500/90 dark:text-gray-400 text-xs w-[12%]">
                  cc:
                </span>
                <span className="text-gray-700/90 dark:text-gray-300 text-xs w-[88%]">
                  {`${email?.cc?.map((ccItem) => `<${ccItem}>`)}`}
                </span>
              </div>

              <div className="w-100 flex flex-row my-0.5">
                <span className="text-gray-500/90 dark:text-gray-400 text-xs w-[12%]">
                  fecha:
                </span>
                <span className="text-gray-700/90 dark:text-gray-300 text-xs w-[88%]">
                  {`${formatDate(email?.datetime)}`}
                </span>
              </div>

              <div className="w-100 flex flex-row my-0.5">
                <span className="text-gray-500/90 dark:text-gray-400 text-xs w-[12%]">
                  asunto:
                </span>
                <span className="text-gray-700/90 dark:text-gray-300 text-xs w-[88%]">
                  Solicitud de Servicio
                </span>
              </div>
            </div>
          </div>
        )}
      </Timeline.Item>
    </>
  )
}

const MainContent = ({ currentEmail }) => {
  const sentEmails =
    currentEmail && currentEmail?.emailSent.length > 0 ? (
      currentEmail.emailSent.map((email, index) => (
        <TimeLineComponent
          key={index}
          email={email}
          currentEmail={currentEmail}
        />
      ))
    ) : (
      <p className="w-full text-center flex justify-center items-center">
        Aún no se registran solicitudes.
      </p>
    )

  return (
    <>
      <div className="h-auto overflow-y-scroll max-h-64">
        <div className="w-[97%] mt-2" />
        <div className="">
          <Timeline>{sentEmails}</Timeline>
        </div>
      </div>
    </>
  )
}

const EmailDetails = ({ dialogIsOpen, currentEmail, onClose }) => {
  return (
    <Dialog isOpen={dialogIsOpen} onClose={onClose} onRequestClose={onClose}>
      <h5 className="mb-4">Detalles</h5>

      {/* Main dialog content */}
      <MainContent currentEmail={currentEmail} />

      <div className="text-right mt-6">
        <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onClose}>
          Cerrar
        </Button>
        <Button variant="solid" onClick={onClose}>
          Entendido
        </Button>
      </div>
    </Dialog>
  )
}

export default EmailDetails
