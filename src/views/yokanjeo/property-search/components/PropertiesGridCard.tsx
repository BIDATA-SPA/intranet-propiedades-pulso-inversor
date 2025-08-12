import Card from '@/components/ui/Card'
import Tooltip from '@/components/ui/Tooltip'
import { useGetAllPropertiesSearchQuery } from '@/services/RtkQueryService'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
import { truncateString } from '@/utils/truncateString'
import { useState } from 'react'
import { FaCheck, FaStar } from 'react-icons/fa'
import { ImHome } from 'react-icons/im'
import { useSearchParams, Link } from 'react-router-dom'
import PaginationBottom from './PaginationBottom'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { RiMapPinFill } from 'react-icons/ri'

const PropertiesGridCard = ({
  setCustomerSearchMatches,
  setCurrentProperty,
  onDrawerOpen,
}) => {
  const [searchParams] = useSearchParams()
  const [search] = useState(searchParams.get('search') || '')
  const [pageSize, setPageSize] = useState(10)
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const { data: properties, isFetching } = useGetAllPropertiesSearchQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search }),
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const onPaginationChange = (page: number) => {
    setCurrentPage(page)
  }

  const onPageSelect = ({ value }: { value: number }) => {
    setPageSize(value)
  }

  if (isFetching) {
    return <TableRowSkeleton columns={1} rows={8} />
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {properties?.data?.map((property) => {
          const address = `${property.address?.city?.name || ''}, ${property.address?.state?.name || ''
            }, ${property.address?.country?.name || ''}`

          return (
            <div
              key={property.id}
              className="relative w-full border dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-transform transform duration-300 ease-in-out hover:-translate-y-1"
            >

              <div className="relative flex justify-center h-40 overflow-hidden border-b rounded-t-lg bg-gray-200 dark:bg-gray-700">
                <Link to={`/mis-propiedades/${property?.id}`}>
                  <img
                    src={property?.images?.[0]?.path || '/img/not-found/not-found-image.png'}
                    alt={property?.propertyTitle}
                    className="absolute hover:cursor-pointer inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                  />
                </Link>


                {property.highlighted && (
                  <span className="absolute top-2 right-2 inline-flex rounded-full bg-yellow-500 text-white p-1 text-xs font-semibold">
                    <FaStar />
                  </span>
                )}


                <span className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                  {property.typeOfPropertyId}
                </span>
              </div>




              <div className="p-4">
                <h5 className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                  {property.typeOfOperationId} de {property.typeOfPropertyId}
                </h5>

                <div className="flex items-center mt-1">
                  <RiMapPinFill className="text-red-500 text-sm" />
                  <Tooltip title={address}>
                    <p className="text-sm ml-1 text-gray-400 dark:text-gray-400 font-semibold">
                      {truncateString(address, 50)}
                    </p>
                  </Tooltip>
                </div>

                <div className="mt-2">
                  <small className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                    Precio
                  </small>
                  <p className="text-primary font-semibold text-lg lg:text-xl text-gray-700 dark:text-white">
                    {formatCurrency(property.propertyPrice, {
                      currency: 'CLP',
                    })}
                  </p>
                </div>

                <Tooltip title={property.propertyTitle}>
                  <h3 className="break-words font-medium text-base mt-2 text-gray-600 dark:text-white">
                    {truncateString(property.propertyTitle, 60)}
                  </h3>
                </Tooltip>
              </div>


              <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                <div className="text-xs text-gray-500 dark:text-white/60">
                  Última actualización: {formatDate(property.updatedAt)}
                </div>
                {property.customer_search_matches?.length > 0 ? (
                  <Tooltip
                    title={`${property.customer_search_matches.length > 1
                        ? `Ver ${property.customer_search_matches.length} Clientes buscando propiedades similares`
                        : `Ver ${property.customer_search_matches.length} Cliente buscando propiedad similar`
                      }`}
                  >
                    <div
                      className="text-green-500 flex items-center text-sm font-semibold bg-green-500/10 hover:bg-green-400/20 p-2 rounded-lg cursor-pointer"
                      onClick={() => {
                        onDrawerOpen(property)
                      }}
                    >
                      {property.customer_search_matches.length}
                      <FaCheck className="ml-1" />
                    </div>
                  </Tooltip>
                ) : (
                  <span className="text-gray-400 text-sm">Sin coincidencias</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center mt-5">
        <PaginationBottom
          currentPage={+properties?.meta?.page}
          total={properties?.meta?.totalItems}
          pageSize={pageSize}
          onChange={onPaginationChange}
          onPageSelect={onPageSelect}
        />
      </div>
    </>
  )
}

export default PropertiesGridCard
