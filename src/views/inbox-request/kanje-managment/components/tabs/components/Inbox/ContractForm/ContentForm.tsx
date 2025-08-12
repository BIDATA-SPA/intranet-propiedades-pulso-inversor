import { formatDate } from '@/utils/formatDate'
import { stripHtml } from '@/utils/stripHTML'

export const formateEmmitedDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

const ContentForm = ({
  values,
  ownerAmount,
  applicantAmount,
  onOwnerAmountChange,
  onApplicantAmountChange,
}) => {
  const { realtorOwner, requestingRealtor, property } = values
  const notFoundText = '(No definido)'
  const txt = {
    emittedDate: formateEmmitedDate(new Date()),
    realtors: {
      owner: {
        name: `${realtorOwner?.name} ${realtorOwner?.lastName}`,
        rut: !realtorOwner?.rut ? notFoundText : realtorOwner?.rut,
        address: {
          country: realtorOwner?.address?.country?.name,
          state: realtorOwner?.address?.internalDbState?.name,
          city: realtorOwner?.address?.internalDbCity?.name,
        },
      },
      requester: {
        name: `${requestingRealtor?.name} ${requestingRealtor?.lastName}`,
        rut: !requestingRealtor?.rut ? notFoundText : requestingRealtor?.rut,
        address: {
          country: !requestingRealtor?.address?.country?.name
            ? notFoundText
            : requestingRealtor?.address?.country?.name,

          state: !requestingRealtor?.address?.internalDbState?.name
            ? notFoundText
            : requestingRealtor?.address?.internalDbState?.name,

          city: !requestingRealtor?.address?.internalDbCity?.name
            ? notFoundText
            : requestingRealtor?.address?.internalDbCity?.name,
        },
      },
    },
    property: {
      title: property?.propertyTitle,
      description: stripHtml(property?.propertyDescription),
    },
    exchange: {
      start: formatDate(property?.timeInExchangeStart),
      end: formatDate(property?.timeInExchangeEnd),
    },
  }

  return (
    <div className="w-full">
      <div>
        <p className="text-left">
          {`${'En Santiago'}, a ${txt.emittedDate}, entre ${
            txt.realtors.owner.name
          }, cédula de identidad Nº ${
            txt.realtors.owner.rut
          }, con domicilio en ${txt.realtors.owner.address.country}, ${
            txt.realtors.owner.address.state
          }, comuna de ${txt.realtors.owner.address.city}, en adelante
        denominado "Propietario de Canje", y por otra parte, ${
          txt.realtors.requester.name
        }, cédula de identidad N° ${
            txt.realtors.requester.rut
          }, con domicilio en
        ${txt.realtors.requester.address.country}, ${
            txt.realtors.requester.address.state
          }, comuna de ${txt.realtors.requester.address.city},
        denominado en adelante "Solicitante de Canje".`}
        </p>
      </div>

      <div className="my-5">
        <ul className="flex flex-col justify-start items-center gap-3">
          <li>
            <strong className="uppercase">Primera:</strong>{' '}
            {`Las
            partes acuerdan realizar el canje del corretaje de la(s)
            siguiente(s) propiedad(es):
            Propiedad ubicada en:${txt.property.title}, ${txt.property.description}`}
          </li>
          <li>
            <strong className="uppercase">Segunda:</strong> El Corredor declara
            que posee las órdenes de venta de o la/s propiedades mencionadas
            anteriormente.
          </li>
          <li>
            <strong className="uppercase">Tercera:</strong> El Solicitante,
            mediante el Corredor propietario de canje, se compromete a visitar
            las propiedades y a realizar todas las negociaciones y suscripción
            de contratos pertinentes a través de su intermedio.
          </li>
          <li>
            <strong className="uppercase">Cuarta:</strong> : El plazo de esta
            orden de canje será a partir del {txt.exchange.start} hasta{' '}
            {txt.exchange.end}, contando desde la fecha de emisión de esta
            orden.
          </li>
          {/* Preguntar a jose */}
          <li>
            <strong className="uppercase">Quinta:</strong> En caso de que el
            canje entre las partes se realice con éxito, los honorarios de
            corretaje se establecerán de la siguiente manera: El Corredor
            Captador establecerá una comisión según lo acordado con su cliente,
            sobre el valor final de la transacción, mientras que el Corredor
            Vendedor acordará una comisión según lo acordado con su cliente,
            sobre el valor final de la transacción.{' '}
            <input
              type="text"
              name="ownerAmount"
              value={ownerAmount}
              className="border-b-2 border-sky-300 outline-none bg-transparent text-center w-[150px]"
              placeholder="Ej: $113.000 o 3UF"
              onChange={onOwnerAmountChange}
            />{' '}
            sobre el valor final de la transacción, mientras que el Corredor
            Solicitante acordará una comisión de{' '}
            <input
              type="text"
              name="applicantAmount"
              value={applicantAmount}
              className="border-b-2 border-sky-300 outline-none bg-transparent text-center w-[150px]"
              placeholder="Ej: $113.000 o 3UF"
              onChange={onApplicantAmountChange}
            />
            . Ambas comisiones se calcularán basándose en el valor final de la
            propiedad objeto del canje y serán pagaderas al cierre de la
            transacción.
          </li>
          <li>
            Este acuerdo asegura una distribución equitativa de los beneficios
            derivados del éxito del canje, reflejando el valor y el esfuerzo
            aportado por cada corredor en el proceso.
          </li>
        </ul>
      </div>
    </div>
  )
}

export default ContentForm
