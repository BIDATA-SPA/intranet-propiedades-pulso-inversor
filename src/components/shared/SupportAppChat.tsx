import Tooltip from '@/components/ui/Tooltip'
import { FcOnlineSupport } from 'react-icons/fc'

const SupportAppChat = () => {
  return (
    <div className="z-50 fixed bottom-[164px] right-7 md:bottom-7 md:right-[165px]">
      {/* z-50 fixed bottom-[164px] right-7 md:bottom-26 md:right-7 */}
      <Tooltip title="Contáctenos vía E-mail" placement="left">
        <a
          href={`mailto:contacto@pulsopropiedades.cl`}
          target="_blank"
          rel="noreferrer"
        >
          <button
            data-twe-ripple-init
            type="button"
            data-twe-ripple-color="light"
            className="inline-block rounded-full bg-amber-500 hover:bg-amber-600 p-3.5 md:p-4 font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
          >
            <FcOnlineSupport className="text-4xl md:text-3xl" />
          </button>
        </a>
      </Tooltip>
    </div>
  )
}

export default SupportAppChat
