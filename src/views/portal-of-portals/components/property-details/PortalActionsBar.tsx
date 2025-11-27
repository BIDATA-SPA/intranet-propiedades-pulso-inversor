/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Tooltip } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import { mapSpcToPortalUpdate } from '@/services/portal/mappers/toPortalPublication'
import type { SpcProperty } from '@/services/portal/types'
import {
  useDeletePortalPublicationByIdMutation,
  useUpdatePortalPublicationByIdMutation,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import React, { useEffect, useMemo, useState } from 'react'
import { FaTrash } from 'react-icons/fa'
// import { MdModeEdit } from 'react-icons/md'
import { PortalPublication } from '@/services/portal/portalPublication'

type Props = {
  /** Propiedad local (SPC) desde la cual mapeamos para PUT (replicar) */
  spc: SpcProperty
  /** UUID de la publicación en el portal (requerido para PUT/DELETE) */
  portalUuid: string
  /** Callback para que el padre haga refetch (ej: find por code) */
  onAfterChange?: () => void
}

const pickList = (res: any) =>
  Array.isArray(res) ? res : res?.items ?? res?.data ?? []

const dedupeByPortal = (items: PortalPublication[]) => {
  const byPortal: Record<string, PortalPublication> = {}
  for (const pub of items) {
    const k = String(pub.portal ?? '')
    if (!k) continue
    const prev = byPortal[k]
    const prevT = prev
      ? new Date(prev.updated_at || prev.created_at || 0).getTime()
      : -1
    const curT = new Date(pub.updated_at || pub.created_at || 0).getTime()
    if (!prev || curT >= prevT) byPortal[k] = pub
  }
  return Object.values(byPortal)
}

/** Limpia objetos quitando null/undefined/'' */
const clean = (obj: Record<string, any>) => {
  const out: Record<string, any> = {}
  Object.entries(obj || {}).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (typeof v === 'string' && v.trim() === '') return
    if (typeof v === 'object' && !Array.isArray(v)) out[k] = clean(v as any)
    else out[k] = v
  })
  return out
}

/** Mensaje legible desde RTK error (402/409/422/5xx) */
const portalErrorMessage = (err: any): string => {
  const status = err?.status ?? err?.originalStatus
  const data = err?.data ?? err
  if (status === 401) return 'No autorizado para operar en el portal.'
  if (status === 404) return 'Publicación no encontrada en el portal.'
  if (status === 409) return 'Conflicto: ya existe una publicación equivalente.'
  if (status === 422) {
    if (data?.detail && Array.isArray(data.detail)) {
      return data.detail
        .map((d: any) => d?.msg || JSON.stringify(d))
        .join(' • ')
    }
    return 'Error de validación (422): revisa los campos obligatorios.'
  }
  if (status >= 500) return 'Error del servidor del portal. Intenta más tarde.'
  if (typeof data === 'string') return data
  try {
    return JSON.stringify(data)
  } catch {
    return String(data || 'Error desconocido')
  }
}

const PortalActionsBar: React.FC<Props> = ({
  spc,
  portalUuid,
  onAfterChange,
}) => {
  const { showNotification } = useNotification()

  const [doUpdate, { isLoading: updating }] =
    useUpdatePortalPublicationByIdMutation()
  const [doDelete, { isLoading: deleting, isSuccess: deleteOk }] =
    useDeletePortalPublicationByIdMutation()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // payload base (desde tu SPC). Replicar usa esto tal cual.
  const basePayload = useMemo(() => mapSpcToPortalUpdate(spc), [spc])

  // formulario de edición (arranca con el payload base)
  const [form, setForm] = useState<any>(basePayload)

  useEffect(() => {
    setForm(basePayload)
  }, [basePayload])

  const disabledAll = !portalUuid || updating || deleting

  const handleRepublish = async () => {
    if (!portalUuid) {
      showNotification(
        'warning',
        'Falta UUID',
        'No se puede actualizar sin UUID del portal'
      )
      return
    }
    try {
      const payload = clean(basePayload)
      await doUpdate({ id: portalUuid, body: payload }).unwrap()
      //   await doUpdate({ id: portalUuid, body: payload }).unwrap()
      showNotification(
        'success',
        'Publicación actualizada',
        `UUID: ${portalUuid}`
      )
      onAfterChange?.()
    } catch (err) {
      showNotification('danger', 'Error al actualizar', portalErrorMessage(err))
    }
  }

  const handleEditSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault?.()
    if (!portalUuid) {
      showNotification(
        'warning',
        'Falta UUID',
        'No se puede editar sin UUID del portal'
      )
      return
    }
    try {
      const payload = clean(form)
      await doUpdate({ id: portalUuid, body: payload }).unwrap()
      //   await doUpdate({ id: portalUuid, payload }).unwrap()
      showNotification('success', 'Cambios guardados', `UUID: ${portalUuid}`)
      setEditOpen(false)
      onAfterChange?.()
    } catch (err) {
      showNotification('danger', 'No se pudo guardar', portalErrorMessage(err))
    }
  }

  const openDeleteDialog = () => {
    if (!portalUuid) {
      showNotification(
        'warning',
        'Falta UUID',
        'No se puede eliminar sin UUID del portal'
      )
      return
    }
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => setDeleteDialogOpen(false)

  const confirmDelete = async () => {
    try {
      await doDelete(portalUuid).unwrap()
      showNotification(
        'success',
        'Publicación eliminada',
        `UUID: ${portalUuid}`
      )
      setDeleteDialogOpen(false)
      onAfterChange?.()
    } catch (err) {
      showNotification('danger', 'No se pudo eliminar', portalErrorMessage(err))
    }
  }

  const onField = (path: string, value: any) => {
    setForm((prev: any) => {
      const clone = { ...prev }
      const keys = path.split('.')
      let cur = clone
      for (let i = 0; i < keys.length - 1; i++) {
        const k = keys[i]
        cur[k] = cur[k] ?? {}
        cur = cur[k]
      }
      cur[keys[keys.length - 1]] = value
      return clone
    })
  }

  return (
    <div className="mb-4 rounded-lg border p-3 dark:border-gray-700">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {/* REPUBLICAR (PUT con mapper) */}
        <Tooltip title="Al volver a publicar esta propiedad, se considerarán los datos recientes de esta publicación.">
          <Button
            variant="solid"
            disabled={disabledAll}
            loading={updating}
            onClick={handleRepublish}
          >
            {updating ? 'Actualizando…' : 'Republicar'}
          </Button>
        </Tooltip>
        {/* ELIMINAR (DELETE por UUID con Dialog de confirmación) */}
        <Button
          variant="solid"
          color="red-500"
          disabled={!portalUuid || updating}
          icon={<FaTrash />}
          onClick={openDeleteDialog}
        >
          Eliminar
        </Button>
      </div>

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onRequestClose={closeDeleteDialog}
      >
        <h5 className="mb-4">Eliminar publicación</h5>
        <p>
          Esta acción eliminará la publicación del portal de forma permanente.
          <br />
          <span className="text-sm text-slate-500">UUID: {portalUuid}</span>
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            disabled={deleting}
            onClick={closeDeleteDialog}
          >
            Cancelar
          </Button>
          <Button
            variant="solid"
            color="red-500"
            disabled={deleting}
            loading={deleting}
            onClick={confirmDelete}
          >
            Eliminar definitivamente
          </Button>
        </div>
      </Dialog>

      {/* EDIT FORM INLINE */}
      {editOpen && (
        <form
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
          onSubmit={handleEditSubmit}
        >
          {/* Campos más comunes (agrega los que necesites) */}
          <div>
            <label className="block text-xs text-slate-500 mb-1">Título</label>
            <input
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.title ?? ''}
              onChange={(e) => onField('title', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Estado</label>
            <select
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.status ?? 'available'}
              onChange={(e) => onField('status', e.target.value)}
            >
              <option value="available">available</option>
              <option value="inactive">inactive</option>
              <option value="reserved">reserved</option>
              <option value="sold">sold</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Moneda</label>
            <select
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.currency ?? 'CLP'}
              onChange={(e) => onField('currency', e.target.value)}
            >
              <option value="CLP">CLP</option>
              <option value="UF">UF</option>
              <option value="USD">USD</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Precio CLP
            </label>
            <input
              type="number"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.price_clp ?? ''}
              onChange={(e) => onField('price_clp', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Precio UF
            </label>
            <input
              type="number"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.price_uf ?? ''}
              onChange={(e) => onField('price_uf', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Dormitorios
            </label>
            <input
              type="number"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.bedrooms ?? ''}
              onChange={(e) => onField('bedrooms', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Baños</label>
            <input
              type="number"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.bathrooms ?? ''}
              onChange={(e) => onField('bathrooms', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Estacionamientos
            </label>
            <input
              type="number"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.parking ?? ''}
              onChange={(e) => onField('parking', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Útil (m²)
            </label>
            <input
              type="number"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.area_useful ?? ''}
              onChange={(e) => onField('area_useful', Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">
              Total (m²)
            </label>
            <input
              type="number"
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              value={form.area_total ?? ''}
              onChange={(e) => onField('area_total', Number(e.target.value))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-slate-500 mb-1">
              Descripción
            </label>
            <textarea
              className="w-full rounded-md border px-2 py-1.5 text-sm"
              rows={4}
              value={form.description ?? ''}
              onChange={(e) => onField('description', e.target.value)}
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-2 pt-1">
            <Button
              type="submit"
              variant="solid"
              disabled={updating}
              loading={updating}
            >
              Guardar cambios
            </Button>
            <Button
              type="button"
              variant="default"
              disabled={updating}
              onClick={() => setEditOpen(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

export default PortalActionsBar
