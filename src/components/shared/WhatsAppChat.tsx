import Tooltip from '@/components/ui/Tooltip'
import { FaWhatsapp } from 'react-icons/fa'

const WhatsAppChat = () => {
  const phoneNumber = '958579339'

  return (
    <div className="z-50 fixed bottom-7 right-7 md:bottom-7 md:right-7">
      <Tooltip title="Contáctenos vía WhatsApp" placement="left">
        <a
          href={`https://api.whatsapp.com/send/?phone=${phoneNumber}&text&type=phone_number&app_absent=0`}
          target="_blank"
          rel="noreferrer"
        >
          <button
            data-twe-ripple-init
            type="button"
            data-twe-ripple-color="light"
            className="inline-block rounded-full bg-[#25D366] hover:bg-[#20bd5a] p-3.5 md:p-4 font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
          >
            <FaWhatsapp className="text-4xl md:text-3xl" />
          </button>
        </a>
      </Tooltip>
    </div>
  )
}

export default WhatsAppChat
