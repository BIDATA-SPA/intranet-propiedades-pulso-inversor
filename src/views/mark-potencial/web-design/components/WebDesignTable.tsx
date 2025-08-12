/* eslint-disable react-hooks/exhaustive-deps */
import { ConfirmDialog } from '@/components/shared'
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Dialog } from '@/components/ui'
import Tooltip from '@/components/ui/Tooltip'
import { ServiceRequestRow } from '@/services/marketing/brand/types'
import {
  useDeleteServiceRequestBrandMutation,
  useGetServiceRequestBrandWebDesignQuery,
} from '@/services/RtkQueryService'
import { formatDateTime } from '@/utils/formatDateTime'
import useNotification from '@/utils/hooks/useNotification'
import { formatDate } from '@fullcalendar/core'
import classNames from 'classnames'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { BiLogoZoom } from 'react-icons/bi'
import { BsMicrosoftTeams } from 'react-icons/bs'
import { FaDiscord, FaPhone } from 'react-icons/fa'
import { HiTrash, HiVideoCamera } from 'react-icons/hi'
import { IoMdVideocam } from 'react-icons/io'
import { MdCalendarMonth, MdMail } from 'react-icons/md'
import { SiGooglemeet } from 'react-icons/si'
import { ModalState, useModal } from '../hooks/use-modal'
import { useAppDispatch, useAppSelector } from '../store'
import {
  setLoading,
  setPageIndex,
  setPageSize,
  setTotalItems,
  setWebDesigns,
} from '../store/webDesignListSlice'
import CheckRequestForm from './dialog/CheckRequestForm'
import Details from './dialog/Details'

export interface ColumnSort {
  id: string
  desc: boolean
}

const initialState: ModalState = {
  checkRequest: false,
  details: false,
}

const PropertyColumn = ({ row }: { row: ServiceRequestRow }) => {
  return <span className="font-semibold">#{row.id}</span>
}

const BrandAvatarColumn = ({ row }) => {
  return (
    <>
      <div
        role="button"
        className="flex rounded w-full flex-col justify-start items-start"
      >
        <span className="flex items-center font-semibold">
          <MdMail className="mr-1" /> {row?.user?.session?.email}
        </span>

        <small className="flex items-center">
          <FaPhone className="mr-1" /> {row?.user?.phone}
        </small>
      </div>
    </>
  )
}

const WebDesignTable: React.FC = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const dispatch = useAppDispatch()
  const data = useAppSelector((state) => state.webDesignsList)
  const { data: webPages, isLoading } = useGetServiceRequestBrandWebDesignQuery(
    {
      page: data.page,
      limit: data.limit,
    }
  )
  const [
    deleteServiceRequestBrand,
    { isLoading: isDeletePropertyLoading, isError: isDeletePropertyError },
  ] = useDeleteServiceRequestBrandMutation()
  const { showNotification } = useNotification()
  const [selectedItem, setSelectedItem] = useState<ServiceRequestRow | null>()
  const { modalState, openModal, closeModal } = useModal(initialState)

  useEffect(() => {
    if (webPages) {
      dispatch(setWebDesigns(webPages?.data))
      dispatch(setTotalItems(webPages?.meta?.totalItems))
    }
    dispatch(setLoading(isLoading))
  }, [webPages, isLoading, dispatch])

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

  const onCheckRequestOpen = (brand: ServiceRequestRow) => {
    openModal('checkRequest')
    setSelectedItem(brand)
  }

  const onDetailsOpen = (brand: ServiceRequestRow) => {
    openModal('details')
    setSelectedItem(brand)
  }

  const closeCheckRequestModal = () => {
    closeModal('checkRequest')
    setSelectedItem(null)
  }

  const closeDetailsModal = () => {
    closeModal('details')
    setSelectedItem(null)
  }

  const columns: ColumnDef<ServiceRequestRow>[] = useMemo(
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
        header: 'Contacto',
        accessorKey: 'contact',
        cell: (props) => {
          const row = props.row.original
          return <BrandAvatarColumn row={row} />
        },
      },
      {
        header: 'Servicio',
        accessorKey: 'serviceType',
        cell: (cellProps) => {
          const { serviceType } = cellProps.row.original
          return (
            <div className="flex items-center justify-start font-bold">
              <span>{serviceType?.name}</span>
            </div>
          )
        },
      },
      {
        header: 'Estado de Solicitud',
        accessorKey: 'status',
        cell: (cellProps) => {
          const { status } = cellProps.row.original

          return (
            <div className="flex items-center justify-start">
              <span
                className={classNames(
                  'badge-dot',
                  status?.name === 'Aprobado' && 'bg-emerald-500',
                  status?.name === 'Pendiente' && 'bg-yellow-500',
                  status?.name === 'Rechazado' && 'bg-red-500',
                  status === null && 'bg-gray-500'
                )}
              ></span>
              <span
                className={classNames(
                  'ml-2 rtl:mr-2 capitalize font-semibold',
                  status?.name === 'Aprobado' && 'text-emerald-500',
                  status?.name === 'Pendiente' && 'text-yellow-500',
                  status?.name === 'Rechazado' && 'text-red-500',
                  status === null && 'text-gray-500'
                )}
              >
                {status?.name ?? 'No definido'}
              </span>
            </div>
          )
        },
      },
      {
        header: 'Plataforma',
        accessorKey: 'meetingOption',
        cell: (cellProps) => {
          const { meetingOption } = cellProps.row.original

          const switchMeetingOption = (option: string) => {
            switch (option) {
              case 'Google Meet':
                return (
                  <span className="flex items-center font-semibold text-[#34A853]">
                    <SiGooglemeet className="text-xl mr-1.5" />
                    Google Meet
                  </span>
                )
              case 'Microsoft Teams':
                return (
                  <span className="flex items-center font-semibold text-[#7B84EC]">
                    <BsMicrosoftTeams className="text-xl mr-1.5" />
                    Microsoft Teams
                  </span>
                )
              case 'Zoom':
                return (
                  <span className="flex items-center font-semibold text-[#008DFF]">
                    <BiLogoZoom className="text-xl mr-1.5" />
                    Zoom
                  </span>
                )
              case 'Discord':
                return (
                  <span className="flex items-center font-semibold text-[#5662F7]">
                    <FaDiscord className="text-xl mr-1.5" />
                    Discord
                  </span>
                )
              default:
                return (
                  <span className="flex items-center font-semibold">
                    <IoMdVideocam className="text-xl mr-1.5" />
                    Sin Plataforma
                  </span>
                )
            }
          }

          return (
            <div className="flex items-center justify-start font-bold">
              {switchMeetingOption(meetingOption)}
            </div>
          )
        },
      },
      {
        header: 'Fecha videllamada',
        accessorKey: 'meeting',
        cell: (cellProps) => {
          const { meeting } = cellProps.row.original
          return (
            <div
              className={`${
                meeting
                  ? 'flex items-center justify-start underline'
                  : 'no-underline'
              }`}
            >
              <div className="flex items-center">
                <MdCalendarMonth className="text-lg mr-1 text-red-400" />
                <span>{formatDateTime(meeting) || 'No establecida'}</span>
              </div>
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
        header: 'Acciones',
        accessorKey: 'actions',
        cell: (cellProps) => {
          return (
            <div className="flex items-center justify-start font-bold">
              <ActionColumn
                row={cellProps.row.original}
                onCheckRequest={() =>
                  onCheckRequestOpen(cellProps.row.original)
                }
                onDetails={() => onDetailsOpen(cellProps.row.original)}
              />
            </div>
          )
        },
      },
    ],
    []
  )

  const ActionColumn = ({
    row,
    onCheckRequest,
    onDetails,
  }: {
    row: ServiceRequestRow
    onCheckRequest: (brand: ServiceRequestRow) => void
    onDetails: (brand: ServiceRequestRow) => void
  }) => {
    const [dialogDeleteOpen, setDialogDeleteOpen] = useState(false)
    const { id } = row
    const enabledToRemoveBtn = true

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
        deleteServiceRequestBrand(id)
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
          <Tooltip title="Enlace videollamada">
            <span
              className="cursor-pointer p-2 hover:text-blue-500"
              onClick={() => onDetails(row)}
            >
              <HiVideoCamera className="text-xl" />
            </span>
          </Tooltip>

          {enabledToRemoveBtn && (
            <Tooltip title="Eliminar">
              <span
                className={`cursor-pointer p-2 hover:text-red-500`}
                onClick={onDelete}
              >
                <HiTrash />
              </span>
            </Tooltip>
          )}
        </div>

        {/* Confirmación de eliminación */}
        <ConfirmDialog
          isOpen={dialogDeleteOpen}
          type="danger"
          title="Eliminar Solicitud"
          confirmButtonColor="red-600"
          isLoading={isDeletePropertyLoading}
          onClose={onConfirmDialogDeleteClose}
          onRequestClose={onConfirmDialogDeleteClose}
          onCancel={onConfirmDialogDeleteClose}
          onConfirm={handleConfirm}
        >
          <p>
            ¿Está seguro de que desea eliminar esta solicitud? Todos los
            registros relacionados con esta solicitud también se eliminarán.
            Esta acción no se puede deshacer.
          </p>
        </ConfirmDialog>
      </>
    )
  }

  return (
    <>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={data?.webDesigns}
        loading={data?.loading}
        pagingData={{
          total: data?.totalItems,
          pageIndex: data?.page,
          pageSize: data?.limit,
        }}
        onPaginationChange={handlePageChange}
        onSelectChange={handlePageSizeChange}
      />

      {/*  */}
      <Dialog
        width={700}
        isOpen={modalState.checkRequest}
        onClose={closeCheckRequestModal}
        onRequestClose={closeCheckRequestModal}
      >
        <h5 className="mb-4">Estado de solicitud</h5>
        <CheckRequestForm
          brand={selectedItem}
          onClose={closeCheckRequestModal}
        />
      </Dialog>

      {/* DETAILS */}
      <Dialog
        width={700}
        isOpen={modalState.details}
        onClose={closeDetailsModal}
        onRequestClose={closeDetailsModal}
      >
        <h5 className="mb-4">Detalles de Videollamada</h5>
        <Details brand={selectedItem} onClose={closeDetailsModal} />
      </Dialog>
    </>
  )
}

export default WebDesignTable
