import Card from '@/components/ui/Card'
import Dialog from '@/components/ui/Dialog'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import type { SkeletonProps } from '@/components/ui/Skeleton'
import Tooltip from '@/components/ui/Tooltip'
import { Property } from '@/services/properties/types/property.type'
import { useUpdatePropertyMutation } from '@/services/RtkQueryService'
import { formatThousands } from '@/utils/formatCurrency'
import useNotification from '@/utils/hooks/useNotification'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { stripHtml } from '@/utils/stripHTML'
import UpdateStatusForm from '@/views/my-properties/components/dialog/UpdateStatusForm'
import { DialogState, useDialog } from '@/views/my-properties/hooks/use-dialog'
import type { ColumnDef, ColumnSort } from '@tanstack/react-table'
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { FaBath, FaBed, FaRegStar, FaRuler, FaStar } from 'react-icons/fa'
import { FaHouseCircleCheck } from 'react-icons/fa6'
import { HiOutlineEye } from 'react-icons/hi'
import { RiMapPinFill } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import Loading from './Loading'

export type OnSortParam = { order: 'asc' | 'desc' | ''; key: string | number }

type DataTableCanvasProps<T> = {
  columns: ColumnDef<T>[]
  data?: T[]
  loading?: boolean
  onPaginationChange?: (page: number) => void
  onSelectChange?: (num: number) => void
  pageSizes?: number[]
  skeletonAvatarProps?: SkeletonProps
  pagingData?: {
    total: number
    pageIndex: number
    pageSize: number
  }
}

const initialState: DialogState = {
  updateExchange: false,
  updateStatus: false,
}

export type DataTableResetHandle = {
  resetSorting: () => void
}

function _DataTableCanvas<T>(
  props: DataTableCanvasProps<T>,
  ref: React.ForwardedRef<DataTableResetHandle>
) {
  const {
    columns = [],
    data = [],
    loading = false,
    onPaginationChange,
    onSelectChange,
    pageSizes = [5, 10, 20],
    pagingData = {
      total: 0,
      pageIndex: 1,
      pageSize: 5,
    },
  } = props
  const { textTheme } = useThemeClass()
  const { pageSize, pageIndex, total } = pagingData
  const [_, setSorting] = useState<ColumnSort[] | null>(null)
  const { dialogState, openDialog, closeDialog } = useDialog(initialState)
  const [updateProperty] = useUpdatePropertyMutation()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState<Property | null>()

  // Card actions
  const onHighlight = async (item) => {
    const id = item?.id
    const body = {
      step2: {
        highlighted: !item?.highlighted,
      },
    }
    try {
      await updateProperty({ id, ...body }).unwrap()
      if (item?.highlighted) {
        showNotification('success', 'Eliminada de destacadas', '')
      } else {
        showNotification('success', 'Guardada como destacada', '')
      }
    } catch (error) {
      showNotification('danger', 'Error', `Error: ${error?.message}`)
      throw new Error(error.message)
    }
  }

  const onUpdateExchangeOpen = (property: Property) => {
    openDialog('updateExchange')
    setSelectedItem(property)
  }

  const closeUpdateExchangeDialog = () => {
    closeDialog('updateExchange')
    setSelectedItem(null)
  }

  const onUpdateStatusOpen = (property: Property) => {
    openDialog('updateStatus')
    setSelectedItem(property)
  }

  const closeUpdateStatusDialog = () => {
    closeDialog('updateStatus')
    setSelectedItem(null)
  }

  const pageSizeOption = useMemo(
    () =>
      pageSizes.map((number) => ({
        value: number,
        label: `${number} / page`,
      })),
    [pageSizes]
  )

  const handlePaginationChange = (page: number) => {
    if (!loading) {
      onPaginationChange?.(page)
    }
  }

  const handleSelectChange = (value?: number) => {
    if (!loading) {
      onSelectChange?.(Number(value))
    }
  }

  useImperativeHandle(ref, () => ({
    resetSorting: () => setSorting(null),
  }))

  return (
    <>
      <Loading loading={loading && data?.length !== 0} type="cover">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data?.length > 0 ? (
            data.map((property) => {
              return (
                <div key={property?.id}>
                  <Card className="relative mx-auto w-full p-1 rounded-lg shadow-sm hover:shadow-lg transition-transform transform duration-300 ease-in-out hover:-translate-y-2">
                    <div className="relative flex justify-center h-52 overflow-hidden rounded-lg bg-gray-200">
                      <Link to={`/mis-propiedades/${property?.id}`}>
                        <img
                          src={
                            property.images?.[0]?.path ||
                            'img/not-found/not-found-image.png'
                          }
                          alt={property.propertyTitle}
                          className="absolute hover:cursor-pointer inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                        />
                      </Link>
                      <span className="absolute top-0 right-2 mt-3 mr-3 inline-flex bg-blue-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                        {property.typeOfPropertyId}
                      </span>
                      {property.highlighted && (
                        <span className="absolute top-0 left-2 mt-3 ml-3 inline-flex rounded-full bg-yellow-500 text-white px-2 py-1 text-xs font-semibold">
                          Destacada
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-start">
                        <RiMapPinFill className="text-[15px] text-red-600" />
                        <p className="ml-1 text-gray-600 dark:text-gray-400 line-clamp-1">
                          {property.address?.city &&
                            property.address?.city?.name}
                          ,{' '}
                          {property.address?.state &&
                            property.address?.state?.name}
                        </p>
                      </div>

                      <h3
                        className="font-medium text-lg text-gray-600 line-clamp-1 mt-2"
                        title={property.propertyTitle}
                      >
                        {property.propertyTitle}
                      </h3>

                      <p className="mt-2 text-primary font-semibold text-xl text-gray-700 dark:text-white">
                        {property.currencyId}{' '}
                        {formatThousands(property.propertyPrice)}
                      </p>

                      <p className="mt-2 text-gray-500 dark:text-gray-400 line-clamp-2">
                        {stripHtml(property.propertyDescription)}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-start gap-4 items-center text-sm text-gray-800">
                      <div className="flex items-center space-x-2 text-gray-500 ">
                        <FaBed className="text-xl text-cyan-500" />
                        <span className="dark:text-gray-400">
                          {property.characteristics.bedrooms} Dorm.
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <FaBath className="text-xl text-cyan-500" />
                        <span className="dark:text-gray-400">
                          {property.characteristics.bathrooms} Baños
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-500">
                        <FaRuler className="text-xl text-cyan-500" />
                        <span className="dark:text-gray-400">
                          {property.characteristics.constructedSurface || '0'}{' '}
                          m²
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end items-center border-t gap-4 dark:border-t-gray-700">
                      <div className="flex space-x-2 mt-4">
                        <Tooltip title="Estado de Propiedad">
                          <button
                            type="button"
                            className="cursor-pointer p-2 hover:text-blue-500"
                            onClick={() => onUpdateStatusOpen(property)}
                          >
                            <FaHouseCircleCheck className="text-xl" />
                          </button>
                        </Tooltip>

                        <Tooltip
                          title={
                            property?.highlighted
                              ? 'Quitar destacada'
                              : 'Destacar'
                          }
                        >
                          <button
                            type="button"
                            className="cursor-pointer p-2 hover:text-yellow-500"
                            onClick={() => onHighlight(property)}
                          >
                            {property?.highlighted ? (
                              <FaStar className="text-yellow-500 text-xl" />
                            ) : (
                              <FaRegStar className="text-xl" />
                            )}
                          </button>
                        </Tooltip>

                        <Tooltip title="Ver detalles">
                          <button
                            className={`cursor-pointer p-2 hover:${textTheme}`}
                            onClick={() =>
                              navigate(`/mis-propiedades/${property?.id}`)
                            }
                          >
                            <HiOutlineEye className="text-xl" />
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })
          ) : (
            <p className="col-span-full text-center text-gray-600">
              No existen propiedades publicadas.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Pagination
            pageSize={pageSize}
            currentPage={pageIndex}
            total={total}
            onChange={handlePaginationChange}
          />
          <Select
            size="sm"
            isSearchable={false}
            value={pageSizeOption.filter((option) => option.value === pageSize)}
            options={pageSizeOption}
            onChange={(option) => handleSelectChange(option?.value)}
          />
        </div>
      </Loading>

      <Dialog
        isOpen={dialogState.updateStatus}
        onClose={closeUpdateStatusDialog}
        onRequestClose={closeUpdateStatusDialog}
      >
        <h5 className="mb-4">Actualizar Estado de Propiedad</h5>
        <UpdateStatusForm
          property={selectedItem}
          onClose={closeUpdateStatusDialog}
        />
      </Dialog>
    </>
  )
}

const DataTableCanvas = forwardRef(_DataTableCanvas) as <T>(
  props: DataTableCanvasProps<T> & {
    ref?: React.ForwardedRef<DataTableResetHandle>
  }
) => ReturnType<typeof _DataTableCanvas>

export type { ColumnDef }
export default DataTableCanvas
