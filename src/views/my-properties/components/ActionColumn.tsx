import { ConfirmDialog } from '@/components/shared'
import { Dialog, Tooltip } from '@/components/ui'
import {
  useDeletePropertyMutation,
  useGetMyInfoQuery,
  useLazyFindPortalPublicationsQuery,
  useUpdatePropertyMutation,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import useNotification from '@/utils/hooks/useNotification'
import { usePdpSecureActions } from '@/utils/hooks/usePdpSecureActions'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { FaHandshake, FaRegStar, FaStar, FaRegFilePdf } from 'react-icons/fa'
import { FaBuildingUser, FaHouseCircleCheck } from 'react-icons/fa6'
import { HiOutlineEye, HiTrash } from 'react-icons/hi'
import { MdFileUpload } from 'react-icons/md'
import { useNavigate } from 'react-router'
import UpdateExchangeForm from './dialog/UpdateExchangeForm'
import UpdateStatusForm from './dialog/UpdateStatusForm'

type TDialogState = {
  updateExchange?: boolean
  updateStatus?: boolean
  deleteProperty?: boolean
}

const ProcanjeRealtorIcon = ({ row }) => {
  const { data: userInfo } = useGetMyInfoQuery(
    undefined,
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

  return null
}

const ActionColumn = ({ row, className }) => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const { data: userInfo } = useGetMyInfoQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  )
  const navigate = useNavigate()
  const [updateProperty] = useUpdatePropertyMutation()

  // Procanje (propiedad)
  const [
    deleteProperty,
    {
      isLoading: isDeletePropertyLoading,
      isError: isDeletePropertyError,
      error: deletePropertyError,
    },
  ] = useDeletePropertyMutation()

  // Portal de Portales
  const [findPortalByCode] = useLazyFindPortalPublicationsQuery()

  // 🔐 hook seguro PDP
  const { ensureToken, secureDelete } = usePdpSecureActions()

  const { showNotification } = useNotification()
  const [selectedItem, setSelectedItem] = useState(null)
  const [dialogState, setDialogState] = useState<TDialogState>({
    updateStatus: false,
    updateExchange: false,
    deleteProperty: false,
  })

  // loading local para la cascada
  const [isCascadeDeleting, setIsCascadeDeleting] = useState(false)

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
    } catch (error: any) {
      showNotification('danger', 'Error', `Error: ${error?.message}`)
      throw new Error(error.message)
    }
  }

  const handleView = () => navigate(`/mis-propiedades/${row.id}`)

  const handleGenerateVisit = () => {
    const propertyId = row?.id
    navigate(`/mis-propiedades/visit/${propertyId}`)
  }

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

  // 🔥 Eliminación en cascada con token PDP
  const handleConfirm = async () => {
    const code = String(row?.id) // en tu mapeo, el "code" del portal es el id local
    setIsCascadeDeleting(true)
    try {
      // 1) conseguir token PDP válido
      const pdpToken = await ensureToken()

      // 2) buscar en portal por code usando ese token
      let uuids: string[] = []
      try {
        const found = await findPortalByCode({
          code,
          page: 1,
          page_size: 100,
          pdpToken,
        }).unwrap()

        const items: any[] = Array.isArray(found)
          ? found
          : found?.items ?? []

        uuids = items
          .filter(
            (i) =>
              String(i?.portal ?? '')
                .trim()
                .toLowerCase() === 'pulsopropiedades' &&
              typeof i?.uuid === 'string'
          )
          .map((i) => i.uuid as string)
      } catch (e) {
        // si falla la búsqueda en portal, igual intentamos borrar en pulsoPropiedades
      }

      // 3) borrar en portal de portales (si hay)
      if (uuids.length > 0) {
        const results = await Promise.allSettled(
          uuids.map((uuid) => secureDelete(uuid))
        )
        const ok = results.filter((r) => r.status === 'fulfilled').length
        const fail = uuids.length - ok
        if (ok > 0) {
          showNotification(
            'success',
            'Portal de Portales',
            `Eliminadas ${ok}/${uuids.length} publicaciones en Portal.`
          )
        }
        if (fail > 0) {
          showNotification(
            'warning',
            'Portal de Portales',
            `No se pudieron eliminar ${fail}/${uuids.length} publicaciones en Portal.`
          )
        }
      }

      // 4) borrar en Procanje
      await deleteProperty(row?.id).unwrap()

      showNotification(
        'success',
        'Eliminación completada',
        'Propiedad eliminada en Procanje y sincronizada con Portal de Portales.'
      )

      setDialogState({
        updateStatus: false,
        updateExchange: false,
        deleteProperty: false,
      })
    } catch (error: any) {
      showNotification(
        'danger',
        'Error',
        `Ocurrió un error al eliminar: ${error?.message || 'Error desconocido'}`
      )
      setDialogState({
        updateStatus: false,
        updateExchange: false,
        deleteProperty: false,
      })
    } finally {
      setIsCascadeDeleting(false)
    }
  }

  const handleCloseDialog = () => {
    setSelectedItem(null)
    setDialogState({
      updateStatus: false,
      updateExchange: false,
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

  useEffect(() => {
    if (isDeletePropertyError) {
      const apiError = deletePropertyError as any
      showNotification(
        'danger',
        'Error',
        `Ha ocurrido un error al eliminar esta propiedad: ${
          apiError?.data?.message || 'Error desconocido'
        }`
      )
    }
  }, [isDeletePropertyError, deletePropertyError, showNotification])

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

        {!row?.isExchanged && (
          <Tooltip title="Habilitar para Canje">
            <span
              className="cursor-pointer p-2 hover:text-blue-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
              onClick={() => handleUpdateExchange(row)}
            >
              <FaHandshake className="text-lg lg:text-xl" />
            </span>
          </Tooltip>
        )}

        <Tooltip title="Eliminar (Pulso Propiedades + Portal de Portales)">
          <span
            className={classNames(
              'cursor-pointer p-2 hover:text-red-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800',
              (isDeletePropertyLoading || isCascadeDeleting) &&
                'opacity-60 pointer-events-none'
            )}
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

      {/* Delete dialog (cascada) */}
      <ConfirmDialog
        isOpen={dialogState.deleteProperty}
        type="danger"
        title="Eliminar Propiedad"
        confirmButtonColor="red-600"
        isLoading={isDeletePropertyLoading || isCascadeDeleting}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        onCancel={handleCloseDialog}
        onConfirm={handleConfirm}
      >
        <p className="text-sm">
          Esta acción eliminará la propiedad en <b>Procanje</b> y también
          intentará eliminar sus publicaciones vinculadas en
          <b> Portal de Portales</b> (búsqueda por <code>code</code>).
          <br />
          No se puede deshacer.
        </p>
      </ConfirmDialog>
    </div>
  )
}

export default ActionColumn
