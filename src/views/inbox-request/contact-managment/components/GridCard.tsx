import { Tooltip } from '@/components/ui'
import { useCopyToClipboard } from '@/utils/hooks/useCopyToClipboard'
import useNotification from '@/utils/hooks/useNotification'
import {
  DEFAULT_TAILWIND_COLORS,
  getRandomBackgroundColor,
} from '@/utils/randomColor'
import { truncateString } from '@/utils/truncateString'
import classNames from 'classnames'
import { useCallback } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { MdMail, MdPhone } from 'react-icons/md'
import { PiChatsFill } from 'react-icons/pi'
import { setSelectedRow, toggleEmailDialog, useAppDispatch } from '../store'

const GridCard = ({ realtor }) => {
  const dispatch = useAppDispatch()
  const { copyToClipboard } = useCopyToClipboard()
  const { showNotification } = useNotification()

  const customColors = [...DEFAULT_TAILWIND_COLORS]
  const randomColor = getRandomBackgroundColor({ colors: customColors })

  const normalizedPhone = realtor?.phone?.replace('+', '') || ''

  const apiNumber = normalizedPhone
    ? `https://api.whatsapp.com/send/?phone=${normalizedPhone}&text&type=phone_number&app_absent=0`
    : ''

  const handleCopyToClipboard = (original) => {
    if (original?.phone) {
      copyToClipboard(original?.phone)
      showNotification('success', 'Copiado', '')
    }
  }

  const onEmailDialogOpen = useCallback(() => {
    dispatch(toggleEmailDialog(true))
    dispatch(setSelectedRow(realtor))
  }, [dispatch, realtor])

  return (
    <div className="rounded-lg relative border bg-white dark:bg-gray-500 dark:border-gray-600 w-full hover:shadow-none flex flex-col mx-auto shadow-sm">
      <div
        className={classNames(
          randomColor,
          'max-h-20 w-full opacity-80 absolute top-0 z-0 bottom-0 rounded-t-lg'
        )}
      />
      <div className="w-full flex m-3 ml-4 text-white">
        <img
          className="w-28 h-28 p-1 bg-white dark:bg-gray-500 rounded-full z-10 object-cover"
          src={
            realtor?.image
              ? realtor?.image
              : 'img/not-found/raeltor-not-found.png'
          }
          alt=""
        />
        <div className="title mt-11 ml-3 font-bold flex flex-col z-20">
          <div className="break-words text-white">
            {realtor?.name && truncateString(realtor.name, 40)}{' '}
            {realtor?.lastName && truncateString(realtor?.lastName, 20)}
          </div>
          <div className="font-semibold text-sm italic dark text-black dark:text-white mt-1.5">
            {realtor?.session?.rol?.name}
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center border-t dark:border-t-gray-600 rounded-b-lg bg-gray-50 dark:bg-gray-800 px-5 py-2">
        <div className="flex items-center gap-4">
          {realtor?.phone && (
            <Tooltip title="Copiar contacto">
              <button
                type="button"
                className="text-gray-500 hover:underline mt-1 hover:text-gray-700 transition duration-150 group-hover:underline"
                onClick={() => handleCopyToClipboard(realtor)}
              >
                <MdPhone className="text-xl" />
              </button>
            </Tooltip>
          )}

          {realtor?.session?.email && (
            <Tooltip title="Enviar un correo">
              <button
                type="button"
                title={`Enviar un correo a ${realtor?.session?.email}`}
                // href={`mailto:${realtor?.session?.email}`}
                className="text-blue-500 hover:underline mt-1 hover:text-blue-700 transition duration-150 group-hover:underline"
                onClick={onEmailDialogOpen}
              >
                <MdMail className="text-xl" />
              </button>
            </Tooltip>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 rounded-full">
          <Tooltip title="Ir a WhatsApp">
            <a
              href={apiNumber}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline hover:text-[#25D366]"
            >
              <FaWhatsapp className="text-xl" />
            </a>
          </Tooltip>

          <Tooltip title="Ir al Chat">
            <span
              className="cursor-pointer p-2 hover:text-yellow-500"
              onClick={() => alert('Acción deshabilitada')}
            >
              <PiChatsFill className="text-xl" />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default GridCard
