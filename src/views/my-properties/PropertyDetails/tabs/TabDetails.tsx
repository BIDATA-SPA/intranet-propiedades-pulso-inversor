import { formatCurrency, formatThousands } from '@/utils/formatCurrency'
import { formatDateTime } from '@/utils/formatDateTime'
import { truncateString } from '@/utils/truncateString'
import classNames from 'classnames'
import { FaExternalLinkAlt, FaSearch, FaUser } from 'react-icons/fa'
import { IoHome } from 'react-icons/io5'
import { MdOutlineAttachMoney } from 'react-icons/md'
import { TbWorld } from 'react-icons/tb'
import TabMainDescription from './TabMainDescription'

const TabCarousel = ({ property }) => {
  const srcImage =
    property?.images[0].path ??
    property?.images[1].path ??
    property?.images[2].path

  const status = property?.propertyStatus?.name

  return (
    <div className="relative">
      <img
        src={srcImage}
        alt="Imagen de propiedad"
        className="max-w-full h-auto object-cover p-1.5 bg-gray-100 rounded-md border"
      />
      <span
        className={classNames(
          'absolute top-0 text-white m-2 p-2 font-semibold rounded-md shadow-sm',
          status === 'Activa' && 'bg-green-500',
          status === 'Dada de baja' && 'bg-yellow-500',
          status === 'Deshabilitada' && 'bg-red-500',
          status === 'Vendida' && 'bg-green-600'
        )}
      >
        {status}
      </span>
    </div>
  )
}

const TabShared = ({ property }) => {
  return <div></div>
}

const TabMain = ({ property }) => {
  const address = `${
    property?.address?.country?.name
      ? `- ${property?.address?.country?.name}`
      : ''
  } ${
    property?.address?.state?.name ? `, ${property?.address?.state?.name}` : ''
  } ${
    property?.address?.city?.name ? `, ${property?.address?.city?.name}` : ''
  } ${property?.address?.address ? `, ${property?.address?.address}` : ''}`

  const createdAt = formatDateTime(property?.createdAt)

  return (
    <div className="w-full px-4">
      <div className="flex justify-start flex-wrap text-md">
        <h1 className="flex font-semibold text-[17px]">
          {`${truncateString(property?.propertyTitle || '', 55)} `}
        </h1>
      </div>
      <div className="w-full flex items-center my-2 text-md">
        <span className="w-[7%] flex justify-center">
          <FaSearch className="text-gray-400 text-md" />
        </span>
        <p className="w-[90%] uppercase font-bold">ID: {property?.id}</p>
      </div>
      <div className="w-full flex items-center my-2 text-md">
        <span className="w-[7%] flex justify-center">
          <IoHome className="text-gray-400 text-md" />
        </span>
        <p className="w-[90%] uppercase font-normal">{`${property?.typeOfOperationId} de ${property?.typeOfPropertyId} ${address}.`}</p>
      </div>
      <div className="w-full flex items-center my-2 text-md">
        <span className="w-[7%] flex justify-center">
          <MdOutlineAttachMoney className="text-gray-400 text-xl" />
        </span>
        <p className="w-[90%] uppercase font-normal">
          {`${property?.currencyId}`}{' '}
          <strong>
            {property?.currencyId === 'UF'
              ? formatThousands(property?.propertyPrice)
              : property?.currencyId === 'CLP'
              ? formatCurrency(property?.propertyPrice, {
                  currency: 'CLP',
                })
              : '-'}{' '}
            {property?.characteristics?.surfaceUnit && (
              <span className="lowercase font-normal">
                el m<sup>2</sup>
              </span>
            )}
          </strong>
        </p>
      </div>
      <div className="w-full flex items-center my-2 text-md">
        <span className="w-[7%] flex justify-center">
          <FaUser className="text-gray-400 text-md" />
        </span>
        <p className="w-[90%] font-normal">{`Creada por ${property?.user?.name} ${property?.user?.lastName} ${createdAt}.`}</p>
      </div>
      {property?.externalLink && (
        <div className="w-full flex items-center my-2 text-md">
          <span className="w-[7%] flex justify-center">
            <TbWorld className="text-gray-400 text-md" />
          </span>
          <p className="w-[90%] font-normal flex items-center">
            {`Link de esta publicación: `}{' '}
            <a
              href={property?.externalLink}
              target="_blank"
              rel="noreferrer"
              className="no-underline ml-1 hover:underline text-sky-400 flex items-center"
            >
              Ver
              <FaExternalLinkAlt className="text-md ml-1 text-sky-400" />
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

const TabDetails = ({ property }) => {
  const hasImage = property?.images?.length > 0

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex w-full flex-col xl:flex-row">
        <div className="w-full xl:w-[35%]">
          {hasImage ? (
            <TabCarousel property={property} />
          ) : (
            <img
              src={'/img/not-found/not-found-image.png'}
              alt="Imagen no encontrada"
              className="max-w-full h-auto xl:h-[200px] xl:max-h-[200px] object-cover p-1.5 bg-gray-100 rounded-md border"
            />
          )}
          <TabShared property={property} />
        </div>

        <div className="w-full xl:w-[65%] h-full">
          <TabMain property={property} />
        </div>
      </div>

      <TabMainDescription property={property} />
    </div>
  )
}

export default TabDetails
