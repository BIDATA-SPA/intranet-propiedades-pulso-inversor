// src/components/GridCard.tsx
import { getFormattedPrices } from '@/utils/currency'
import { useUFRate } from '@/utils/hooks/useUFRate'
import { truncateString } from '@/utils/truncateString'
import { useMemo } from 'react'
import { FaBath, FaBed, FaRuler, FaStar } from 'react-icons/fa'
import { FaHouseMedicalCircleCheck } from 'react-icons/fa6'
import { HiMiniBuildingStorefront } from 'react-icons/hi2'
import { MdOutlineKitchen, MdOutlineMeetingRoom } from 'react-icons/md'
import { PiStairsBold } from 'react-icons/pi'
import { RiMapPinFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import ActionColumn from './ActionColumn'

type Property = {
  id: string
  propertyTitle?: string
  typeOfOperationId?: string
  typeOfPropertyId?: string
  currencyId: 'CLP' | 'UF'
  propertyPrice: string
  highlighted?: boolean
  isExchanged?: boolean
  images?: { path: string }[]
  address?: { city?: { name?: string }; state?: { name?: string } }
  characteristics?: any
}

const MainCardProperties = ({
  typeOfProperty,
  property,
}: {
  typeOfProperty?: string
  property: Property
}) => {
  switch (typeOfProperty) {
    case 'Local Comercial':
      return (
        <div className="flex gap-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <HiMiniBuildingStorefront className="text-lg text-gray-500" />
            <div className="flex items-center dark:text-gray-400">
              {property?.characteristics?.locatedInGallery ? (
                <span>En Galería</span>
              ) : (
                <span>No</span>
              )}{' '}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <PiStairsBold className="text-lg text-gray-500" />
            <div className="flex items-center dark:text-gray-400">
              {property?.characteristics?.floorLevelLocation ? (
                <span>{`${property?.characteristics?.floorLevelLocation} piso`}</span>
              ) : (
                <span>-</span>
              )}{' '}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <FaRuler className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.constructedSurface ? (
                <span>
                  {`${property?.characteristics?.constructedSurface} m`}
                  <sup>2</sup>
                </span>
              ) : (
                <span>
                  0 m<sup>2</sup>
                </span>
              )}{' '}
            </span>
          </div>
        </div>
      )

    case 'Oficina':
      return (
        <div className="flex gap-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <MdOutlineMeetingRoom className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.numberOfPrivate ? (
                <span>
                  {truncateString(
                    property?.characteristics?.numberOfPrivate,
                    4
                  )}
                </span>
              ) : (
                <span>0</span>
              )}{' '}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <MdOutlineKitchen className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.kitchenet ? (
                <span>Incluye kitchenette</span>
              ) : (
                <span>Sin kitchenette</span>
              )}{' '}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <FaRuler className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.constructedSurface ? (
                <span>
                  {`${truncateString(
                    property?.characteristics?.constructedSurface,
                    5
                  )} m`}
                  <sup>2</sup>
                </span>
              ) : (
                <span>
                  0 m<sup>2</sup>
                </span>
              )}{' '}
            </span>
          </div>
        </div>
      )

    case 'Parcela':
      return (
        <div className="flex gap-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <FaHouseMedicalCircleCheck className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.hasHouse ? (
                <span>Incluye propiedad</span>
              ) : (
                <span>No incluye propiedad</span>
              )}{' '}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <FaRuler className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.constructedSurface ? (
                <span>
                  {`${property?.characteristics?.constructedSurface} m`}
                  <sup>2</sup>
                </span>
              ) : (
                <span>
                  0 m<sup>2</sup>
                </span>
              )}{' '}
            </span>
          </div>
        </div>
      )

    default:
      return (
        <div className="flex gap-4">
          <div className="flex items-center space-x-2 text-gray-500">
            <FaBed className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.bedrooms
                ? property?.characteristics?.bedrooms
                : '0'}{' '}
              dorm.
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <FaBath className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.bathrooms
                ? property?.characteristics?.bathrooms
                : '0'}{' '}
              baños.
            </span>
          </div>

          <div className="flex items-center space-x-2 text-gray-500">
            <FaRuler className="text-lg text-gray-500" />
            <span className="dark:text-gray-400">
              {property?.characteristics?.constructedSurface ? (
                <span>
                  {`${property?.characteristics?.constructedSurface} m`}
                  <sup>2</sup>
                </span>
              ) : (
                <span>
                  0 m<sup>2</sup>
                </span>
              )}{' '}
            </span>
          </div>
        </div>
      )
  }
}

const GridCard = ({ property }: { property: Property }) => {
  const { uf, loading, error } = useUFRate()

  const formatted = useMemo(() => {
    // Si la UF aún no está lista o hay error, devolvemos placeholders
    return getFormattedPrices(property?.propertyPrice, property?.currencyId, uf)
  }, [property?.propertyPrice, property?.currencyId, uf])

  return (
    <div
      key={property?.id}
      className="relative mx-auto w-full border dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-transform transform duration-300 ease-in-out hover:-translate-y-2"
    >
      {/* Image Section */}
      <div className="relative flex justify-center h-60 overflow-hidden border-b rounded-t-lg">
        <Link to={`/mis-propiedades/${property?.id}`}>
          <img
            src={
              property?.images?.[0]?.path || 'img/not-found/not-found-image.png'
            }
            alt={property?.propertyTitle || 'Propiedad'}
            className="absolute hover:cursor-pointer inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
          />
        </Link>

        {property?.highlighted && (
          <span className="absolute top-0 right-2 mt-3 ml-3 inline-flex rounded-full bg-yellow-500 text-white p-1.5 text-xs font-semibold">
            <FaStar className="text-xl" />
          </span>
        )}

        <span className="absolute top-0 left-2 mt-3 mr-3 inline-flex bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
          {property?.typeOfPropertyId}
        </span>
      </div>

      {/* Content Section */}
      <div className="mt-4 p-4">
        {/* Operation Type */}
        <div className="flex items-center justify-start">
          <h5 className="text-xs text-gray-500 dark:text-gray-400 font-normal">
            {property?.typeOfOperationId}{' '}
            {property?.typeOfPropertyId && `de ${property?.typeOfPropertyId}`}
          </h5>
        </div>

        {/* Address */}
        <div className="flex items-center justify-start my-1">
          <RiMapPinFill className="text-[15px] text-red-600" />
          <p className="text-sm ml-1 text-gray-400 dark:text-gray-400 font-semibold">
            {property?.address?.city?.name}, {property?.address?.state?.name}
          </p>
        </div>

        {/* Price */}
        <div className="flex flex-col justify-start my-4">
          <div className="flex items-end gap-3">
            <div className="w-full">
              <small className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                Precio en UF
              </small>
              <p className="text-primary font-semibold text-xl lg:text-2xl text-gray-700 dark:text-white">
                {formatted.priceInUF}
              </p>

              {formatted.priceInCLP !== '-' && (
                <small className="font-normal text-sm w-full">
                  {formatted.priceInCLP}
                </small>
              )}

              {/* Estado de carga/errores de UF (opcional visual) */}
              {loading && (
                <small className="block text-xs text-gray-400 mt-1">
                  Actualizando UF...
                </small>
              )}
              {error && (
                <small className="block text-xs text-red-500 mt-1">
                  Sin UF del día
                </small>
              )}
            </div>
          </div>
        </div>

        {/* Property Title */}
        <div className="mt-2">
          {property?.propertyTitle ? (
            <h3
              className="break-words font-medium text-lg text-gray-600 mt-2"
              title={property?.propertyTitle}
            >
              {truncateString(property?.propertyTitle, 70)}
            </h3>
          ) : (
            'Propiedad sin descripción'
          )}
        </div>
      </div>

      {/* Characteristics */}
      <div className="p-4 flex justify-start items-center text-gray-8 00">
        <MainCardProperties
          typeOfProperty={property?.typeOfPropertyId}
          property={property}
        />
      </div>

      {/* Actions */}
      <ActionColumn
        row={property}
        className="w-full rounded-b-lg bg-gray-50 dark:bg-gray-700 p-4 absolute bottom-0 border-t dark:border-t-gray-700 border-b-xl"
      />
    </div>
  )
}

export default GridCard
