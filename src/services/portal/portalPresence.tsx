/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Select, Spinner } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import ApiService from '@/services/ApiService'
import {
  useFindPortalPublicationsQuery,
  useUpdatePropertyMutation,
} from '@/services/RtkQueryService'
import type { PortalPublication } from '@/services/portal/portalPublication'
import { PORTAL_OPTIONS } from '@/services/portal/portalPublication'
import { useAppSelector } from '@/store'
import useNotification from '@/utils/hooks/useNotification'
import { usePdpSecureActions } from '@/utils/hooks/usePdpSecureActions'
import { portalErrorToToast } from '@/views/portal-of-portals/utils/error-utils'
import React, { useMemo, useState } from 'react'

type StatusValue = 'available' | 'reserved' | 'sold'

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendida' },
]

const getPortalLabel = (p: string) =>
  PORTAL_OPTIONS.find((o) => o.value === p)?.label ?? p

const pickList = (res: any) =>
  Array.isArray(res) ? res : res?.items ?? res?.data ?? []

const fmt = (iso?: string) => {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

type Props = {
  code: string
  pageSize?: number
  className?: string
  actionable?: boolean
  onChanged?: () => void | Promise<void>
  buildPDPBody?: () => Record<string, any> | Promise<Record<string, any>>
  buildUpdateBody?: () => Record<string, any>
}

const PortalPresence: React.FC<Props> = ({
  code,
  pageSize = 100,
  className,
  actionable = true,
  onChanged,
  buildPDPBody,
  buildUpdateBody,
}) => {
  const { showNotification } = useNotification()

  // 🔐 token PDP guardado en redux en el login
  const pdpToken = useAppSelector((s) => s.pdpAuth.token)
  const pdpTokentEST = useAppSelector((s) => s.pdpAuth)

  console.log(pdpTokentEST)

  // 🔐 acciones seguras (usan ensureToken internamente)
  const { secureUpdate, secureDelete } = usePdpSecureActions()

  // query de listado (solo si tengo code y token)
  const { data, isFetching, isError, error, refetch } =
    useFindPortalPublicationsQuery(
      { code, page: 1, page_size: pageSize, pdpToken }
      //   {
      //     skip: !code || !pdpToken,
      //   }
    )

  // mutation (PDP)
  const [updateProperty, { isLoading: isUpdatingPDP }] =
    useUpdatePropertyMutation()

  // estados locales
  const [repubUuid, setRepubUuid] = useState<string | null>(null)
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null)
  const [statusBusyUuid, setStatusBusyUuid] = useState<string | null>(null)
  const [isDeletingPortal, setIsDeletingPortal] = useState(false)

  const items: PortalPublication[] = pickList(data)

  // Dedupe por portal (escoge la más reciente por portal)
  const perPortal = useMemo(() => {
    const byPortal: Record<string, PortalPublication> = {}

    for (const pub of items) {
      const key = String(pub.portal ?? '').trim()
      if (!key) continue

      const prev = byPortal[key]
      const prevTime = prev
        ? new Date(prev.updated_at || prev.created_at || 0).getTime()
        : -1
      const curTime = new Date(pub.updated_at || pub.created_at || 0).getTime()

      if (!prev || curTime >= prevTime) {
        byPortal[key] = pub
      }
    }

    return Object.values(byPortal)
  }, [items])

  const refreshAll = async () => {
    await refetch()
    if (onChanged) {
      await Promise.resolve(onChanged())
    }
  }

  // ===================== helpers =====================

  // Fallback: construye body completo PDP desde el GET /properties/:code
  const buildPDPBodyFallback = async (): Promise<Record<string, any>> => {
    const res = await ApiService.fetchData<any, any>({
      url: `properties/${code}`,
      method: 'get',
    })

    const p = res?.data ?? {}

    const toStr = (v: any) => (v == null ? '' : String(v))
    const toNum = (v: any) => (v == null || v === '' ? 0 : Number(v))
    const toBool = (v: any) => Boolean(v)
    const toISOOrNull = (v: any) =>
      v ? new Date(v as any).toISOString() : null

    const portalsArr = Array.isArray(p?.property_portales)
      ? p.property_portales
          .map((x: any) => ({
            id: String(x?.portalName ?? '')
              .trim()
              .toLowerCase(),
            name: String(x?.portalName ?? '').trim(),
          }))
          .filter((x: any) => x.name)
      : []

    return {
      step1: {
        customerId: toNum(p?.customer?.id),
        typeOfOperationId: toStr(p?.typeOfOperationId),
        timeAvailable: {
          start: toISOOrNull(p?.timeAvailableStart),
          end: toISOOrNull(p?.timeAvailableEnd),
        },
        typeOfPropertyId: toStr(p?.typeOfPropertyId),
        currencyId: toStr(p?.currencyId),
        propertyPrice: toNum(p?.propertyPrice),
      },
      step2: {
        highlighted: toBool(p?.highlighted),
        disableReason: p?.disableReason ?? null,
        observations: p?.observations ?? null,
        characteristics: {
          numberOfPrivate: toStr(p?.characteristics?.numberOfPrivate),
          officeNumber: toStr(p?.characteristics?.officeNumber),
          numberOfVacantFloors: toStr(p?.characteristics?.numberOfVacantFloors),
          numberOfMeetingRooms: toStr(p?.characteristics?.numberOfMeetingRooms),
          hasKitchenet: toBool(p?.characteristics?.hasKitchenet),
          locatedInGallery: toBool(p?.characteristics?.locatedInGallery),
          locatedFacingTheStreet: toBool(
            p?.characteristics?.locatedFacingTheStreet
          ),
          floorLevelLocation: toStr(p?.characteristics?.floorLevelLocation),
          commonExpenses: toStr(p?.characteristics?.commonExpenses),
          hasHouse: toBool(p?.characteristics?.hasHouse),
          surface: toStr(p?.characteristics?.surface),
          constructedSurface: toStr(p?.characteristics?.constructedSurface),
          floors: toStr(p?.characteristics?.floors),
          terraces: toStr(p?.characteristics?.terraces),
          terraceM2: toStr(p?.characteristics?.terraceM2),
          numberOfFloors: toStr(p?.characteristics?.numberOfFloors),
          bathrooms: toStr(p?.characteristics?.bathrooms),
          surfaceUnit: p?.characteristics?.surfaceUnit ?? null,
          bedrooms: toStr(p?.characteristics?.bedrooms),
          hasKitchen: toBool(p?.characteristics?.hasKitchen),
          typeOfKitchen: p?.characteristics?.typeOfKitchen ?? null,
          hasHeating: toBool(p?.characteristics?.hasHeating),
          typeOfHeating: p?.characteristics?.typeOfHeating ?? null,
          hasAirConditioning: toBool(p?.characteristics?.hasAirConditioning),
          hasParking: toBool(p?.characteristics?.hasParking),
          hasGarage: toBool(p?.characteristics?.hasGarage),
          numberOfParkingSpaces:
            p?.characteristics?.numberOfParkingSpaces ?? null,
          hasElevator: toBool(p?.characteristics?.hasElevator),
          hasGym: toBool(p?.characteristics?.hasGym),
          hasSwimmingPool: toBool(p?.characteristics?.hasSwimmingPool),
          hasSecurity: toBool(p?.characteristics?.hasSecurity),
          typeOfSecurity: Array.isArray(p?.characteristics?.typeOfSecurity)
            ? p.characteristics.typeOfSecurity
            : [],
          locatedInCondominium: toBool(
            p?.characteristics?.locatedInCondominium
          ),
          isFurnished: toBool(p?.characteristics?.isFurnished),
          hasBarbecueArea: toBool(p?.characteristics?.hasBarbecueArea),
          propertyTitle: toStr(p?.propertyTitle),
          propertyDescription: toStr(p?.propertyDescription),
        },
        externalLink: p?.externalLink ?? null,
      },
      step3: {
        countryId: toNum(p?.address?.country?.id),
        stateId: toNum(p?.address?.state?.id),
        cityId: toNum(p?.address?.city?.id),
        letter: toStr(p?.address?.letter),
        number: toStr(p?.address?.number),
        references: toStr(p?.address?.references),
        address: toStr(p?.address?.address),
        addressPublic: toStr(p?.address?.addressPublic),
      },
      step4: {
        isExchanged: toBool(p?.isExchanged),
        timeInExchange: {
          start: toISOOrNull(p?.timeInExchangeStart),
          end: toISOOrNull(p?.timeInExchangeEnd),
        },
        propertyDescriptionInExchange: p?.propertyDescriptionInExchange ?? null,
      },
      step5: {
        portals: portalsArr,
      },
    }
  }

  // ===================== acciones =====================

  const handleRepublish = async (pub: PortalPublication) => {
    if (!pub.uuid) {
      showNotification('warning', 'Sin UUID', 'No se puede actualizar sin UUID')
      return
    }

    setRepubUuid(pub.uuid)

    try {
      const fallback = { status: (pub.status as StatusValue) ?? 'available' }

      const body =
        typeof buildUpdateBody === 'function'
          ? { ...buildUpdateBody(), ...fallback }
          : fallback

      await secureUpdate(pub.uuid, body)

      showNotification(
        'success',
        'Publicación actualizada',
        `${getPortalLabel(String(pub.portal))} • UUID: ${pub.uuid}`
      )

      await refreshAll()
    } catch (err: any) {
      const t = portalErrorToToast(err)
      showNotification(t.type, t.title, t.text)
    } finally {
      setRepubUuid(null)
    }
  }

  const handleStatusChange = async (
    pub: PortalPublication,
    next: StatusValue
  ) => {
    if (!pub.uuid) {
      showNotification('warning', 'Sin UUID', 'No se puede actualizar sin UUID')
      return
    }

    const uuid = pub.uuid
    setStatusBusyUuid(uuid)

    try {
      const minimalBody = { status: next }

      const body =
        typeof buildUpdateBody === 'function'
          ? { ...buildUpdateBody(), status: next }
          : minimalBody

      await secureUpdate(uuid, body)

      showNotification(
        'success',
        'Estado actualizado',
        `${getPortalLabel(String(pub.portal))} → ${next}`
      )

      await refreshAll()
    } catch (err: any) {
      const t = portalErrorToToast(err)
      showNotification(t.type, t.title, t.text)
    } finally {
      setStatusBusyUuid(null)
    }
  }

  const openDeleteDialog = (uuid: string) => setDeleteUuid(uuid)
  const closeDeleteDialog = () => setDeleteUuid(null)

  // Eliminar (DELETE en portal + PATCH completo en PDP con step5: [])
  const confirmDelete = async () => {
    if (!deleteUuid) return

    setIsDeletingPortal(true)

    try {
      // 1) Eliminar en Portal de Portales (PDP) con token seguro
      await secureDelete(deleteUuid)

      // 2) Body completo PDP
      let fullBody: Record<string, any> | null = null

      if (typeof buildPDPBody === 'function') {
        // por si algún día alguien hace buildPDPBody async
        fullBody = await Promise.resolve(buildPDPBody())
      } else {
        fullBody = await buildPDPBodyFallback()
      }

      // Forzar step5.portals a []
      fullBody = {
        ...fullBody,
        step5: {
          ...(fullBody.step5 ?? {}),
          portals: [],
        },
      }

      // 3) PATCH completo en PDP
      await updateProperty({ id: code, ...fullBody } as any).unwrap()

      showNotification(
        'success',
        'Publicación eliminada',
        'Se eliminó del Portal de Portales y se actualizó Pulso Propiedades.'
      )

      setDeleteUuid(null)
      await refreshAll()

      // Si realmente necesitas recargar toda la página:
      // setTimeout(() => {
      //   window.location.reload()
      // }, 2500)
    } catch (err: any) {
      const t = portalErrorToToast(err)

      showNotification(
        t.type ?? 'danger',
        t.title ?? 'Error al eliminar publicación',
        t.text ??
          'No fue posible completar la eliminación en todos los sistemas. Intente nuevamente.'
      )
    } finally {
      setIsDeletingPortal(false)
    }
  }

  // ===================== render =====================

  return (
    <div className={className}>
      <h3 className="text-sm font-semibold mb-2">Presencia en portales</h3>

      {isFetching && (
        <div className="text-sm text-slate-600 flex items-center">
          <Spinner size={18} className="mr-2" />
          Cargando portales…
        </div>
      )}

      {isError && (
        <p className="text-sm text-rose-600">
          No fue posible consultar los portales.{' '}
          {String((error as any)?.status ?? '')}
        </p>
      )}

      {!isFetching && !isError && perPortal.length === 0 && (
        <p className="text-sm text-slate-500">
          No se encontró esta propiedad publicada en ningún portal.
        </p>
      )}

      {!isFetching && !isError && perPortal.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            {perPortal.map((p) => {
              const republishing = repubUuid === p.uuid
              const deleting = deleteUuid === p.uuid
              const statusLoading = statusBusyUuid === p.uuid
              const currentStatus: StatusValue =
                (p.status as StatusValue) ?? 'available'

              return (
                <div
                  key={`${p.portal}-${p.uuid ?? p.code}`}
                  className="px-3 py-2 rounded-md border text-sm flex flex-wrap items-center justify-between gap-3
                             bg-white/60 dark:bg-slate-800/40 dark:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        currentStatus === 'available'
                          ? 'bg-emerald-500'
                          : currentStatus === 'reserved'
                          ? 'bg-amber-500'
                          : currentStatus === 'sold'
                          ? 'bg-lime-500'
                          : 'bg-gray-400'
                      }`}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {getPortalLabel(String(p.portal))}
                      </span>
                      <span className="text-xs text-slate-500">
                        Estado: {currentStatus} • UUID:{' '}
                        {p.uuid ? `${p.uuid}` : '—'}
                      </span>
                      <span className="text-xs text-slate-400">
                        Actualizado: {fmt(p.updated_at)}
                      </span>
                    </div>
                  </div>

                  {actionable && (
                    <div className="flex items-center gap-2">
                      <div className="min-w-[170px]">
                        <Select
                          size="md"
                          isSearchable={false}
                          value={
                            STATUS_OPTIONS.find(
                              (o) => o.value === currentStatus
                            ) || STATUS_OPTIONS[0]
                          }
                          options={STATUS_OPTIONS}
                          isDisabled={
                            !p.uuid || statusLoading || republishing || deleting
                          }
                          onChange={(opt) => {
                            const next = (opt as { value: StatusValue })?.value
                            if (!next || next === currentStatus) return
                            void handleStatusChange(p, next)
                          }}
                        />
                      </div>

                      <Button
                        variant="default"
                        disabled={
                          !p.uuid || republishing || statusLoading || deleting
                        }
                        loading={republishing}
                        onClick={() => handleRepublish(p)}
                      >
                        {republishing
                          ? 'Vinculando...'
                          : 'Vincular Publicación en Portal de Portales'}
                      </Button>

                      <Button
                        variant="solid"
                        color="red-500"
                        disabled={
                          !p.uuid ||
                          deleting ||
                          statusLoading ||
                          republishing ||
                          isUpdatingPDP
                        }
                        loading={
                          (deleting && isDeletingPortal) || isUpdatingPDP
                        }
                        onClick={() => openDeleteDialog(p.uuid!)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        isOpen={Boolean(deleteUuid)}
        onClose={closeDeleteDialog}
        onRequestClose={closeDeleteDialog}
      >
        <h5 className="mb-4">Eliminar publicación</h5>
        <p className="text-sm">
          Esta acción eliminará la publicación del Portal de Portales y
          actualizará Pulso Propiedades
          <br />
          <span className="text-xs text-slate-500">
            UUID: {deleteUuid ?? '—'}
          </span>
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            disabled={!deleteUuid || isUpdatingPDP}
            onClick={closeDeleteDialog}
          >
            Cancelar
          </Button>
          <Button
            variant="solid"
            color="red-500"
            disabled={!deleteUuid}
            loading={isDeletingPortal || isUpdatingPDP}
            onClick={confirmDelete}
          >
            Eliminar definitivamente
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export default PortalPresence
