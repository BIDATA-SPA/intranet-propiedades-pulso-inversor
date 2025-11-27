import Tooltip from '@/components/ui/Tooltip'
import { FaWhatsapp } from 'react-icons/fa'

// Normaliza un número chileno a E.164 (sin +)
// - Quita caracteres no numéricos
// - Si ya viene con 56, lo respeta
// - Si tiene 9 dígitos y empieza con 9 => móvil: 56 + número
// - Si tiene 8 dígitos => asume falta el 9 móvil: 569 + número
const toE164Chile = (raw: string) => {
  const digits = String(raw).replace(/\D/g, '').replace(/^0+/, '')
  if (digits.startsWith('56')) return digits
  if (digits.length === 9 && digits[0] === '9') return `56${digits}`
  if (digits.length === 8) return `569${digits}`
  // fallback: prefija 56
  return `56${digits}`
}

const WhatsAppChat = () => {
  // Puede venir "993043913", "9 9304 3913", "0993043913", etc.
  const phoneNumberLocal = '994355075'
  const phoneE164 = toE164Chile(phoneNumberLocal)

  const defaultMessage = 'Soy Corredor/a, necesito ayuda - Pulso Propiedades'
  const waLink = `https://wa.me/${phoneE164}?text=${encodeURIComponent(
    defaultMessage
  )}`

  return (
    <div className="z-50 fixed bottom-24 right-7 md:bottom-7 md:right-24">
      <Tooltip title="Contáctenos vía WhatsApp" placement="left">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chatear por WhatsApp"
        >
          <button
            type="button"
            className="inline-block rounded-full bg-[#25D366] hover:bg-[#20bd5a] p-3.5 md:p-4 text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none"
          >
            <FaWhatsapp className="text-4xl md:text-3xl" />
          </button>
        </a>
      </Tooltip>
    </div>
  )
}

export default WhatsAppChat

// import Tooltip from '@/components/ui/Tooltip'
// import { FaWhatsapp } from 'react-icons/fa'

// const WhatsAppChat = () => {
//   const phoneNumber = '993043913'

//   return (
//     <div className="z-50 fixed bottom-24 right-7 md:bottom-7 md:right-24">
//       {/* z-50 fixed bottom-24 right-7 md:bottom-26 md:right-7 */}
//       <Tooltip title="Contáctenos vía WhatsApp" placement="left">
//         <a
//           href={`https://api.whatsapp.com/send/?phone=${phoneNumber}&text&type=phone_number&app_absent=0`}
//           target="_blank"
//           rel="noreferrer"
//         >
//           <button
//             data-twe-ripple-init
//             type="button"
//             data-twe-ripple-color="light"
//             className="inline-block rounded-full bg-[#25D366] hover:bg-[#20bd5a] p-3.5 md:p-4 font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg"
//           >
//             <FaWhatsapp className="text-4xl md:text-3xl" />
//           </button>
//         </a>
//       </Tooltip>
//     </div>
//   )
// }

// export default WhatsAppChat
