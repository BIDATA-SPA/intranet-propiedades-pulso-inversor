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
import { FaHandshake, FaRegStar, FaStar } from 'react-icons/fa'
import { FaBuildingUser, FaHouseCircleCheck } from 'react-icons/fa6'
import { HiOutlineEye, HiTrash } from 'react-icons/hi'
import { MdFileUpload } from 'react-icons/md'
import { useNavigate } from 'react-router'
import UpdateExchangeForm from './dialog/UpdateExchangeForm'
import UpdateStatusForm from './dialog/UpdateStatusForm'
import { WEB_URL_PROPERTIES } from '@/constants/web.constant'
import { TbWorld } from "react-icons/tb";
import { FaRegFilePdf } from "react-icons/fa";

type TDialogState = {
  updateExchange?: boolean
  updateStatus?: boolean
  deleteProperty?: boolean
}

const ProcanjeRealtorIcon = ({ row }) => {
  const { data: userInfo } = useGetMyInfoQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )

  if (
    userInfo?.session?.type?.name === 'corredor' &&
    userInfo?.session?.email === 'procanje@procanje.com'
  ) {
    return (
      <div>
        <Tooltip
          title={
            <div>
              <strong className="text-sky-400">Publicante:</strong>
              {row?.customer && (
                <ul>
                  <li>{`${row?.customer?.name} ${row?.customer?.lastName}`}</li>
                </ul>
              )}
            </div>
          }
        >
          <span className="cursor-pointer p-2 hover:text-blue-500  bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 rounded-full">
            <FaBuildingUser className="text-lg lg:text-xl" />
          </span>
        </Tooltip>
      </div>
    )
  }
}

const ActionColumn = ({ row, className }) => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const { data: userInfo } = useGetMyInfoQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )
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
  const [selectedItem, setSelectedItem] = useState(null)
  const [dialogState, setDialogState] = useState<TDialogState>({
    updateStatus: false,
    updateExchange: false,
    deleteProperty: false,
  })

  const handleUpdateStatus = (item) => {
    setSelectedItem(item)
    setDialogState({
      updateStatus: true,
      updateExchange: false,
      deleteProperty: false,
    })
  }

  const handleHighlight = async (row) => {
    const id = row?.id
    const body = {
      step2: {
        highlighted: !row?.highlighted,
      },
    }
    try {
      await updateProperty({ id, ...body }).unwrap()
      if (row?.highlighted) {
        showNotification('success', 'Eliminada de destacadas', '')
      } else {
        showNotification('success', 'Guardada como destacada', '')
      }
    } catch (error) {
      showNotification('danger', 'Error', `Error: ${error?.message}`)
      throw new Error(error.message)
    }
  }

  const handleView = () => navigate(`/mis-propiedades/${row.id}`)

  const handleUpdateExchange = (item) => {
    setSelectedItem(item)
    setDialogState({
      updateStatus: false,
      updateExchange: true,
      deleteProperty: false,
    })
  }

  const handleDelete = () => {
    setDialogState({
      updateStatus: false,
      updateExchange: false,
      deleteProperty: true,
    })
  }

  const handleConfirm = async () => {
    try {
      await deleteProperty(row?.id).unwrap()
      setDialogState({
        updateStatus: false,
        updateExchange: false,
        deleteProperty: false,
      })
      showNotification('success', 'Eliminada exitosamente', '')
    } catch (error) {
      setDialogState({
        updateStatus: false,
        updateExchange: false,
        deleteProperty: false,
      })
      showNotification(
        'danger',
        'Error',
        `Ha ocurrido un error al eliminar esta propiedad: ${
          error?.message || 'Error desconocido'
        }`
      )
    }
  }

  const handleCloseDialog = () => {
    setSelectedItem(null)
    setDialogState({
      updateStatus: false,
      updateExchange: false,
    })
  }

  const onUpload = () => {
    navigate(`/mis-propiedades/${row.id}/#scroll-target`)
    const target = document.getElementById('scroll-target')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const onCreatePdf = () => {
    navigate(`/mis-propiedades/visit/${row.id}/#scroll-target`)
    const target = document.getElementById('scroll-target')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (isDeletePropertyError) {
      showNotification(
        'danger',
        'Error',
        `Ha ocurrido un error al eliminar esta propiedad: ${
          deletePropertyError?.data?.message || 'Error desconocido'
        }`
      )
    }
  }, [isDeletePropertyError, deletePropertyError])

  return (
    <div className="flex items-center flex-row justify-around">
      <ProcanjeRealtorIcon row={row} />

      <div
        className={classNames(
          className,
          'relative flex justify-end items-center gap-2'
        )}
      >
        <Tooltip title="Cargar Imágenes">
          <span
            className="cursor-pointer p-2 hover:text-green-500  bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 rounded-full"
            onClick={onUpload}
          >
            <MdFileUpload className="text-lg lg:text-xl" />
          </span>
        </Tooltip>

        <Tooltip title="Estado de Propiedad">
          <span
            className="cursor-pointer p-2 hover:text-blue-500  bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 rounded-full"
            onClick={() => handleUpdateStatus(row)}
          >
            <FaHouseCircleCheck className="text-lg lg:text-xl" />
          </span>
        </Tooltip>

        <Tooltip title="Generar Visita">
          <span
            className="cursor-pointer p-2 hover:text-green-500  bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800 rounded-full"
            onClick={onCreatePdf}
          >
            <FaRegFilePdf  className="text-lg lg:text-xl" />
          </span>
        </Tooltip>

        {/* <Tooltip title="Ver Web">
          <span
            className="cursor-pointer p-2 hover:text-blue-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
            onClick={() => window.open(`${WEB_URL_PROPERTIES}${row.id}`, '_blank')}
          >
            <TbWorld className="text-lg lg:text-xl" />
          </span>
        </Tooltip> */}

        <Tooltip title="Ver detalle">
          <span
            className="cursor-pointer p-2 hover:text-blue-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
            onClick={handleView}
          >
            <HiOutlineEye className="text-lg lg:text-xl" />
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

        {/* {!row?.isExchanged && (
          <Tooltip title="Habilitar para Canje">
            <span
              className="cursor-pointer p-2 hover:text-blue-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
              onClick={handleUpdateExchange}
            >
              <FaHandshake className="text-lg lg:text-xl" />
            </span>
          </Tooltip>
        )} */}

        <Tooltip title="Eliminar">
          <span
            className={`cursor-pointer p-2 hover:text-red-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800`}
            onClick={handleDelete}
          >
            <HiTrash className="text-lg lg:text-xl" />
          </span>
        </Tooltip>
      </div>

      {/* Update status dialog */}
      <Dialog
        isOpen={dialogState.updateStatus}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
      >
        <h5 className="mb-4">Actualizar Estado de Propiedad</h5>
        <UpdateStatusForm property={selectedItem} onClose={handleCloseDialog} />
      </Dialog>

      {/* Update exchange dialog */}
      <Dialog
        width={700}
        isOpen={dialogState.updateExchange}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
      >
        <h5 className="mb-4">Habilitar para canje</h5>
        <UpdateExchangeForm
          property={selectedItem}
          onClose={handleCloseDialog}
        />
      </Dialog>

      {/* Delete dialog */}
      <ConfirmDialog
        isOpen={dialogState.deleteProperty}
        type="danger"
        title="Eliminar Propiedad"
        confirmButtonColor="red-600"
        isLoading={isDeletePropertyLoading}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        onCancel={handleCloseDialog}
        onConfirm={handleConfirm}
      >
        <p>
          ¿Está seguro de que desea eliminar esta propiedad? Todos los registros
          relacionados con esta propiedad también se eliminarán. Esta acción no
          se puede deshacer.
        </p>
      </ConfirmDialog>
    </div>
  )
}

export default ActionColumn
