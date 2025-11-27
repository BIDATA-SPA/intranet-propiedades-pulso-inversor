/* eslint-disable react-hooks/exhaustive-deps */
import { ConfirmDialog } from '@/components/shared'
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import EmblaCarousel from '@/components/shared/embla/EmblaCarousel'
import { Avatar } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import Tooltip from '@/components/ui/Tooltip'
import {
  useDeletePropertyMutation,
  useGetAllPropertiesQuery,
  useUpdatePropertyMutation,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { switchPrice } from '@/utils/switch-price'
import { truncateString } from '@/utils/truncateString'
import { formatDate } from '@fullcalendar/core'
import classNames from 'classnames'
import { EmblaOptionsType } from 'embla-carousel'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FaHandshake, FaRegStar, FaStar } from 'react-icons/fa'
import { FaHouseCircleCheck } from 'react-icons/fa6'
import { HiOutlineEye, HiTrash } from 'react-icons/hi'
import { IoHomeSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { DialogState, useDialog } from '../hooks/use-dialog'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setLoading,
  setPageIndex,
  setPageSize,
  setProperties,
  setTotalItems,
} from '../store/propertyListSlice'
import { Property } from '../store/types'
import UpdateExchangeForm from './dialog/UpdateExchangeForm'
import UpdateStatusForm from './dialog/UpdateStatusForm'

export interface ColumnSort {
  id: string
  desc: boolean
}

const initialState: DialogState = {
  updateExchange: false,
  updateStatus: false,
}

const PropertyColumn = ({ row }: { row: Property }) => {
  const { textTheme } = useThemeClass()
  const navigate = useNavigate()

  const onView = useCallback(() => {
    navigate(`/mis-propiedades/${row.id}`)
  }, [navigate, row])

  return (
    <Tooltip title="Ver detalles">
      <span
        className={`cursor-pointer select-none font-semibold hover:${textTheme}`}
        onClick={onView}
      >
        #{row.id}
      </span>
    </Tooltip>
  )
}

const PropertyAvatarColumn = ({ row }) => {
  const [emblaIsOpen, setIsOpen] = useState(false)
  const slideCount = row?.images?.length
  const options: EmblaOptionsType = {}
  const slides = Array?.from(Array(slideCount)?.keys())

  const sortedImages = row?.images
    ? [...row.images].sort((a, b) => Number(a.number) - Number(b.number))
    : []

  const renderedImages =
    sortedImages?.[0]?.path ??
    sortedImages?.[1]?.path ??
    sortedImages?.[2]?.path

  const avatar =
    renderedImages?.length > 0 ? (
      <Avatar src={renderedImages} className="w-[40px] max-w-[40px]" />
    ) : (
      <Avatar icon={<IoHomeSharp className="w-[40px] max-w-[40px]" />} />
    )

  const openDialog = () => {
    setIsOpen(true)
  }

  const onDialogClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div
        role="button"
        className="flex items-center rounded w-full cursor-pointer hover:underline"
        onClick={openDialog}
      >
        <div className="w-[30%]">{avatar}</div>
        <span className={`ml-2 rtl:mr-2 font-semibold w-[70%]`}>
          {row?.propertyTitle}
        </span>
      </div>

      <Dialog
        noBackground
        isOpen={emblaIsOpen}
        width={1000}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <EmblaCarousel
          slides={slides}
          options={options}
          images={sortedImages}
          onClose={onDialogClose}
        />
      </Dialog>
    </>
  )
}

const PropertiesTable: React.FC = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const { textTheme } = useThemeClass()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.propertiesList)

  const {
    data: properties,
    isLoading,
    refetch,
  } = useGetAllPropertiesQuery({
    page: data.data.page,
    limit: data.data.limit,
    ...data?.data?.filters,
  })
  const [
    deleteProperty,
    { isLoading: isDeletePropertyLoading, isError: isDeletePropertyError },
  ] = useDeletePropertyMutation()
  const [updateProperty] = useUpdatePropertyMutation()
  const [selectedItem, setSelectedItem] = useState<Property | null>()
  const { showNotification } = useNotification()
  const { dialogState, openDialog, closeDialog } = useDialog(initialState)

  useEffect(() => {
    if (properties) {
      dispatch(setProperties(properties.data))
      dispatch(setTotalItems(properties.meta.totalItems))
    }
    dispatch(setLoading(isLoading))
  }, [properties, isLoading, dispatch])

  useEffect(() => {
    if (isDeletePropertyError) {
      showNotification(
        'danger',
        'Error',
        'Ha ocurrido un error al eliminar esta propiedad'
      )
    }
  }, [isDeletePropertyError])

  const handlePageChange = (newPageIndex: number) => {
    dispatch(setPageIndex(newPageIndex))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize))
  }

  // HIGTLIGHT SUBMITTING ACTION
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
      refetch()
    } catch (error) {
      showNotification('danger', 'Error', `Error: ${error?.message}`)
      throw new Error(error.message)
    }
  }

  // SWITCH TO EXCAHNGE PROPERTY SUBMITTING ACTION
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

  const columns: ColumnDef<Property>[] = useMemo(
    () => [
      {
        header: 'Id',
        accessorKey: 'id',
        cell: (props) => {
          const row = props.row.original
          return <PropertyColumn row={row} />
        },
      },
      {
        header: 'Propiedad',
        accessorKey: 'propertyTitle',
        cell: (props) => {
          const row = props.row.original
          return <PropertyAvatarColumn row={row} />
        },
      },
      {
        header: 'Operación',
        accessorKey: 'typeOfOperationId',
        cell: (cellProps) => {
          const { typeOfOperationId, typeOfPropertyId } = cellProps.row.original
          return (
            <div className="flex items-center justify-start">
              <span>
                {typeOfOperationId || '-'} de {typeOfPropertyId || '-'}
              </span>
            </div>
          )
        },
      },
      {
        header: 'Precio',
        accessorKey: 'propertyPrice',
        cell: (cellProps) => {
          const { currencyId } = cellProps.row.original

          return (
            <div className="flex items-center justify-start">
              <span>{switchPrice(currencyId, cellProps.row.original)}</span>
            </div>
          )
        },
      },
      {
        header: 'Ubicación',
        accessorKey: 'address',
        cell: (cellProps) => {
          const { isActive, address } = cellProps.row.original
          const _country = address?.country && `, ${address?.country?.name}`
          const _state = address?.state ? `, ${address?.state?.name}` : ''
          const _city = address?.city ? `${address?.city?.name}.` : ''

          return (
            <div className="flex items-center justify-start">
              <span>
                {!isActive ? (
                  truncateString(`${_city}${_state}${_country}`, 35)
                ) : (
                  <Tooltip title={`${_city}${_state}${_country}`}>
                    {truncateString(`${_city}${_state}${_country}`, 35)}
                  </Tooltip>
                )}
              </span>
            </div>
          )
        },
      },
      {
        header: 'Estado de Propiedad',
        accessorKey: 'statusProperty',
        cell: (cellProps) => {
          const { propertyStatus } = cellProps.row.original
          return (
            <div className="flex items-center justify-start">
              <span
                className={classNames(
                  'badge-dot',
                  propertyStatus?.name === 'Activa' && 'bg-emerald-500',
                  propertyStatus?.name === 'Vendida' && 'bg-emerald-500',
                  propertyStatus?.name === 'Dada de baja' && 'bg-yellow-500',
                  propertyStatus?.name === 'Deshabilitada' && 'bg-red-500',
                  propertyStatus === null && 'bg-gray-500'
                )}
              ></span>
              <span
                className={classNames(
                  'ml-2 rtl:mr-2 capitalize font-semibold',
                  propertyStatus?.name === 'Activa' && 'text-emerald-500',
                  propertyStatus?.name === 'Vendida' && 'text-emerald-500',
                  propertyStatus?.name === 'Dada de baja' && 'text-yellow-500',
                  propertyStatus?.name === 'Deshabilitada' && 'text-red-500',
                  propertyStatus === null && 'text-gray-500'
                )}
              >
                {propertyStatus?.name ?? 'No definido'}
              </span>
            </div>
          )
        },
      },
      {
        header: 'Creada',
        accessorKey: 'createdAt',
        cell: (cellProps) => {
          const { createdAt } = cellProps.row.original
          return (
            <div className="flex items-center justify-start">
              <span>{formatDate(createdAt) || '-'}</span>
            </div>
          )
        },
      },
      {
        header: 'Actualizada',
        accessorKey: 'updatedAt',
        cell: (cellProps) => {
          const { updatedAt } = cellProps.row.original
          return (
            <div className="flex items-center justify-start">
              <span>{formatDate(updatedAt) || '-'}</span>
            </div>
          )
        },
      },
      {
        header: 'Acciones',
        id: 'actions',
        cell: (props) => (
          <ActionColumn
            row={props.row.original}
            onHighlight={onHighlight}
            onUpdateExchange={() => onUpdateExchangeOpen(props.row.original)}
            onUpdateStatus={() => onUpdateStatusOpen(props.row.original)}
          />
        ),
      },
    ],
    []
  )

  const ActionColumn = ({
    row,
    onHighlight,
    onUpdateExchange,
    onUpdateStatus,
  }: {
    row: Property
    onHighlight: (item: Property) => void
    onUpdateExchange: () => void
    onUpdateStatus: () => void
  }) => {
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)

    const {
      id,
      highlighted,
      isExchanged,
      propertyStatus: { name },
    } = row

    // El boton se habilita si la propiedad no se encuentra en canje o se encuentra "Activa o Dada de baja"
    const enabledToRemoveBtn = !isExchanged && name === 'Activa'

    const onView = useCallback(() => {
      navigate(`/mis-propiedades/${row.id}`)
    }, [navigate, row])

    // Funciones para abrir y cerrar el diálogo de confirmación
    const onConfirmDialogDeleteOpen = () => {
      setDialogDeleteOpen(true)
    }

    const onConfirmDialogDeleteClose = () => {
      setDialogDeleteOpen(false)
    }

    // Función para manejar la confirmación de eliminación
    const handleConfirm = () => {
      if (enabledToRemoveBtn) {
        deleteProperty(id)
        onConfirmDialogDeleteClose()
        showNotification('success', 'Eliminada exitosamente', '')
      }
      return
    }

    const onDelete = () => {
      onConfirmDialogDeleteOpen()
    }

    return (
      <>
        <div className="flex justify-end text-lg">
          <Tooltip title="Estado de Propiedad">
            <span
              className="cursor-pointer p-2 hover:text-blue-500"
              onClick={onUpdateStatus}
            >
              <FaHouseCircleCheck className="text-2xl" />
            </span>
          </Tooltip>

          {/* If property isn't in exchange, it will show action */}
          {!isExchanged && (
            <Tooltip title="Habilitar para Canje">
              <span
                className="cursor-pointer p-2 hover:text-blue-500"
                onClick={onUpdateExchange}
              >
                <FaHandshake className="text-2xl" />
              </span>
            </Tooltip>
          )}
          <Tooltip title={highlighted ? 'Quitar destacada' : 'Destacar'}>
            <span
              className="cursor-pointer p-2 hover:text-yellow-500"
              onClick={() => onHighlight(row)}
            >
              {highlighted ? (
                <FaStar className="text-yellow-500 text-2xl" />
              ) : (
                <FaRegStar className="text-2xl" />
              )}
            </span>
          </Tooltip>
          <Tooltip title="Ver detalles">
            <span
              className={`cursor-pointer p-2 hover:${textTheme}`}
              onClick={onView}
            >
              <HiOutlineEye className="text-2xl" />
            </span>
          </Tooltip>

          {enabledToRemoveBtn && (
            <Tooltip title="Eliminar">
              <span
                className={`cursor-pointer p-2 hover:text-red-500`}
                onClick={onDelete}
              >
                <HiTrash className="text-2xl" />
              </span>
            </Tooltip>
          )}
        </div>

        {/* Confirmación de eliminación */}
        <ConfirmDialog
          isOpen={dialogDeleteOpen}
          type="danger"
          title="Eliminar Propiedad"
          confirmButtonColor="red-600"
          isLoading={isDeletePropertyLoading}
          onClose={onConfirmDialogDeleteClose}
          onRequestClose={onConfirmDialogDeleteClose}
          onCancel={onConfirmDialogDeleteClose}
          onConfirm={handleConfirm} // Aquí se llama a la función de confirmación cuando el usuario hace clic en "Confirmar"
        >
          <p>
            ¿Está seguro de que desea eliminar esta propiedad? Todos los
            registros relacionados con esta propiedad también se eliminarán.
            Esta acción no se puede deshacer.
          </p>
        </ConfirmDialog>
      </>
    )
  }

  // console.log('LIST', data?.data?.properties)

  return (
    <>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={data?.data?.properties}
        loading={data?.data?.loading}
        pagingData={{
          total: data?.data?.totalItems,
          pageIndex: data?.data?.page,
          pageSize: data?.data?.limit,
        }}
        onPaginationChange={handlePageChange}
        onSelectChange={handlePageSizeChange}
      />

      <Dialog
        width={700}
        isOpen={dialogState.updateExchange}
        onClose={closeUpdateExchangeDialog}
        onRequestClose={closeUpdateExchangeDialog}
      >
        <h5 className="mb-4">Habilitar para canje</h5>
        <UpdateExchangeForm
          property={selectedItem}
          onClose={closeUpdateExchangeDialog}
        />
      </Dialog>

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

export default PropertiesTable
