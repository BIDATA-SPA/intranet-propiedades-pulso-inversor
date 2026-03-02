import { ConfirmDialog } from '@/components/shared'
import { Dialog, Tooltip } from '@/components/ui'
import {
  useDeletePropertyMutation,
  useGetMyInfoQuery,
  useUpdatePropertyMutation,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import useNotification from '@/utils/hooks/useNotification'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { FaRegFilePdf, FaRegStar, FaStar } from 'react-icons/fa'
import { FaHouseCircleCheck } from 'react-icons/fa6'
import { HiOutlineEye, HiTrash } from 'react-icons/hi'
import { MdFileUpload } from 'react-icons/md'
import { useNavigate } from 'react-router'
import UpdateStatusForm from './dialog/UpdateStatusForm'

type TDialogState = {
  updateStatus?: boolean
  deleteProperty?: boolean
}

const PulsoRealtorIcon = ({ row }: { row: any }) => {
  useGetMyInfoQuery(undefined, { refetchOnMountOrArgChange: true })
  return null
}

const ActionColumn = ({ row, className }: { row: any; className?: string }) => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  useGetMyInfoQuery(undefined, { refetchOnMountOrArgChange: true })

  const navigate = useNavigate()
  const [updateProperty] = useUpdatePropertyMutation()

  const [
    deleteProperty,
    {
      isLoading: isDeletePropertyLoading,
      isError: isDeletePropertyError,
      error: deletePropertyError,
    },
  ] = useDeletePropertyMutation()

  const { showNotification } = useNotification()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [dialogState, setDialogState] = useState<TDialogState>({
    updateStatus: false,
    deleteProperty: false,
  })

  const handleUpdateStatus = (item: any) => {
    setSelectedItem(item)
    setDialogState({
      updateStatus: true,
      deleteProperty: false,
    })
  }

  const handleHighlight = async (item: any) => {
    const id = item?.id
    const body = {
      step2: {
        highlighted: !item?.highlighted,
      },
    }

    try {
      await updateProperty({ id, ...body }).unwrap()
      showNotification(
        'success',
        item?.highlighted
          ? 'Eliminada de destacadas'
          : 'Guardada como destacada',
        ''
      )
    } catch (error: any) {
      showNotification('danger', 'Error', `Error: ${error?.message}`)
    }
  }

  const handleView = () => navigate(`/mis-propiedades/${row.id}`)

  const handleGenerateVisit = () => {
    const propertyId = row?.id
    navigate(`/mis-propiedades/visit/${propertyId}`)
  }

  const handleDelete = () => {
    setDialogState({
      updateStatus: false,
      deleteProperty: true,
    })
  }

  // ✅ Pulso ONLY delete + manejo de error 400
  const handleConfirmDelete = async () => {
    try {
      await deleteProperty(row?.id).unwrap()

      showNotification(
        'success',
        'Eliminación completada',
        'Propiedad eliminada correctamente.'
      )

      setDialogState({
        updateStatus: false,
        deleteProperty: false,
      })
    } catch (error: any) {
      const apiMessage =
        error?.data?.message ||
        error?.message ||
        'Ocurrió un error al eliminar la propiedad.'

      // backend:
      // { message, error: "Bad Request", statusCode: 400 }
      if (error?.status === 400 || error?.data?.statusCode === 400) {
        showNotification('warning', 'No se puede eliminar', apiMessage)
      } else {
        showNotification('danger', 'Error', apiMessage)
      }

      setDialogState({
        updateStatus: false,
        deleteProperty: false,
      })
    }
  }

  const handleCloseDialog = () => {
    setSelectedItem(null)
    setDialogState({
      updateStatus: false,
      deleteProperty: false,
    })
  }

  const onUpload = () => {
    navigate(`/mis-propiedades/${row.id}/#scroll-target`)
    const target = document.getElementById('scroll-target')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Red de seguridad por si alguien usa el error del hook
  useEffect(() => {
    if (!isDeletePropertyError) return
    const apiError = deletePropertyError as any

    const apiMessage =
      apiError?.data?.message ||
      apiError?.message ||
      'Error desconocido al eliminar.'

    if (apiError?.status === 400 || apiError?.data?.statusCode === 400) {
      showNotification('warning', 'No se puede eliminar', apiMessage)
    } else {
      showNotification('danger', 'Error', apiMessage)
    }
  }, [isDeletePropertyError, deletePropertyError, showNotification])

  return (
    <div className="flex items-center flex-row justify-around">
      <PulsoRealtorIcon row={row} />

      <div
        className={classNames(
          className,
          'relative flex justify-end items-center gap-2'
        )}
      >
        <Tooltip title="Cargar Imágenes">
          <span
            className="cursor-pointer p-2 hover:text-green-500 bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 rounded-full"
            onClick={onUpload}
          >
            <MdFileUpload className="text-lg lg:text-xl" />
          </span>
        </Tooltip>

        <Tooltip title="Estado de Propiedad">
          <span
            className="cursor-pointer p-2 hover:text-blue-500 bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 rounded-full"
            onClick={() => handleUpdateStatus(row)}
          >
            <FaHouseCircleCheck className="text-lg lg:text-xl" />
          </span>
        </Tooltip>

        <Tooltip title="Ver detalle">
          <span
            className="cursor-pointer p-2 hover:text-blue-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
            onClick={handleView}
          >
            <HiOutlineEye className="text-lg lg:text-xl" />
          </span>
        </Tooltip>

        <Tooltip title="Generar Visita">
          <span
            className="cursor-pointer p-2 hover:text-green-500 bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 rounded-full"
            onClick={handleGenerateVisit}
          >
            <FaRegFilePdf className="text-lg lg:text-xl" />
          </span>
        </Tooltip>

        {userAuthority === 2 ? (
          <Tooltip title={row?.highlighted ? 'Quitar destacada' : 'Destacar'}>
            <span
              className="cursor-pointer p-2 hover:text-yellow-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
              onClick={() => handleHighlight(row)}
            >
              {row?.highlighted ? (
                <FaStar className="text-yellow-500 text-lg lg:text-xl" />
              ) : (
                <FaRegStar className="text-lg lg:text-xl" />
              )}
            </span>
          </Tooltip>
        ) : null}

        <Tooltip title="Eliminar">
          <span
            className={classNames(
              'cursor-pointer p-2 hover:text-red-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800',
              isDeletePropertyLoading && 'opacity-60 pointer-events-none'
            )}
            onClick={handleDelete}
          >
            <HiTrash className="text-lg lg:text-xl" />
          </span>
        </Tooltip>
      </div>

      {/* Update status dialog */}
      <Dialog
        isOpen={Boolean(dialogState.updateStatus)}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
      >
        <h5 className="mb-4">Actualizar Estado de Propiedad</h5>
        <UpdateStatusForm property={selectedItem} onClose={handleCloseDialog} />
      </Dialog>

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={Boolean(dialogState.deleteProperty)}
        type="danger"
        title="Eliminar Propiedad"
        confirmButtonColor="red-600"
        isLoading={isDeletePropertyLoading}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        onCancel={handleCloseDialog}
        onConfirm={handleConfirmDelete}
      >
        <p className="text-sm">
          Esta acción eliminará la propiedad seleccionada.
          <br />
          No se puede deshacer.
        </p>
      </ConfirmDialog>
    </div>
  )
}

export default ActionColumn
