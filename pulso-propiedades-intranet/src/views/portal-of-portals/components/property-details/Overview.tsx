/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from '@/components/ui'
import {
  mapSpcToPortalCreate,
  mapSpcToPortalUpdate,
} from '@/services/portal/mappers/toPortalPublication'
import PortalPresence from '@/services/portal/portalPresence'
import type { SpcProperty } from '@/services/portal/types'
import {
  useFindPortalPublicationsQuery,
  useGetPropertyByIdQuery,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import React, { useEffect, useMemo, useRef } from 'react'
import { useParams } from 'react-router-dom'
import MultiPortalPublisher from './MultiPortalPublisher'
import PropertyDetail from './PropertyDetails'

function toUiPropertyFromSpc(spc: SpcProperty) {
  const p = mapSpcToPortalCreate(spc)

  return {
    portal: p.portal,
    listing_type: p.listing_type as any,
    property_type: p.property_type,
    external_url: p.external_url,
    code: p.code,
    title: p.title,
    status: 'available',
    published_at: p.published_at,
    // scraped_at: p.scraped_at,
    price_clp: p.price_clp,
    price_uf: p.price_uf,
    currency: p.currency as any,
    area_total: p.area_total,
    area_useful: p.area_useful,
    unit: p.unit as any,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: p.parking,
    floor: p.floor,
    age: p.age,
    orientation: p.orientation as any,
    common_expenses: p.common_expenses,
    condition: p.condition as any,
    location: {
      address: p.location.address,
      neighborhood: p.location.neighborhood,
      commune: p.location.commune,
      city: p.location.city,
      region: p.location.region,
      lat: p.location.coordinates.lat,
      lng: p.location.coordinates.lng,
    },
    description: p.description,
    features: p.features,
    tags: p.tags,
    images: p.images,
    broker: p.broker,
    consolidated_id: '',
    consolidated_status: 'pending' as any,
    uuid: p?.uuid,
    created_at: p.published_at,
    updated_at: p.scraped_at,
    owner_id: null,
    pending_approval: p?.pending_approval,
  }
}

/** Normaliza respuesta del portal (lista) a array */
const pickList = (res: any) =>
  Array.isArray(res) ? res : res?.items ?? res?.data ?? []

/** Extrae mensaje legible de error del portal (402/422/etc.) */
const portalErrorMessage = (err: any): string => {
  const data = err?.data ?? err
  if (data?.detail && Array.isArray(data.detail)) {
    const joined = data.detail
      .map((d: any) => d?.msg || JSON.stringify(d))
      .join(' • ')
    return joined || 'Error desconocido'
  }
  if (typeof data === 'string') return data
  try {
    return JSON.stringify(data)
  } catch {
    return String(data || 'Error desconocido')
  }
}

const Overview: React.FC = () => {
  const { showNotification } = useNotification()
  const { propertyId } = useParams<{ propertyId: string }>()

  // 1) Propiedad local
  const { data, isLoading, isError, error } = useGetPropertyByIdQuery(
    propertyId,
    { skip: !propertyId }
  )

  // 2) Buscar en Portal por code = propertyId
  const {
    data: portalSearch,
    isFetching: portalSearching,
    isError: portalIsError,
    error: portalError,
    refetch: portalRefetch,
  } = useFindPortalPublicationsQuery(
    { code: propertyId, page: 1, page_size: 1 },
    { skip: !propertyId }
  )

  // 3) Coincidencia estricta por code y con uuid presente
  const portalItems = pickList(portalSearch)
  const matched = useMemo(() => {
    const item = portalItems?.[0]
    if (!item) return null
    const sameCode =
      String(item.code ?? '').trim() !== '' &&
      String(item.code) === String(propertyId)
    const hasUuid = typeof item.uuid === 'string' && item.uuid.length > 0
    return sameCode && hasUuid ? item : null
  }, [portalItems, propertyId])

  // 4) UI property desde SPC
  const uiProperty = useMemo(
    () => (data ? toUiPropertyFromSpc(data as any) : undefined),
    [data]
  )

  // ---- Toasters controlados (evitar duplicados) ----
  const shownSearchError = useRef(false)

  useEffect(() => {
    if (portalIsError && !shownSearchError.current) {
      shownSearchError.current = true
      showNotification(
        'danger',
        'Error al consultar el portal',
        portalErrorMessage(portalError)
      )
    }
  }, [portalIsError, portalError, showNotification])

  // ===== Render =====
  if (isLoading) return <div className="p-6">Cargando propiedad…</div>

  if (isError) {
    const msg =
      (error as any)?.data || (error as any)?.message || 'Error desconocido'
    return (
      <div className="p-6 text-rose-600">
        Error al cargar la propiedad: {String(msg)}
      </div>
    )
  }

  if (!data)
    return <div className="p-6">No se encontró la propiedad local.</div>

  // Si NO hay coincidencia en el portal (code + uuid), mostrar aviso + botón POST
  if (!matched) {
    return (
      <div className="w-full">
        <div className="rounded-lg border p-5 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-2">
            Portal en donde se encuentre su propiedad.
          </h2>

          {portalSearching ? (
            <div className="text-sm text-slate-600 flex items-center">
              <Spinner size={20} className="mr-2" />
              <p>Buscando coincidencia en el portal…</p>
            </div>
          ) : portalIsError ? (
            <p className="text-sm text-rose-600">
              Ocurrió un error consultando el portal. Intenta más tarde.
            </p>
          ) : (
            <>
              <div className="flex flex-col gap-2 border-dashed border-2 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  Esta propiedad (<b>id/code: {propertyId}</b>){' '}
                  <b className="underline">no se encuentra publicada</b> en
                  Portal de Portales.
                </p>
                <p className="text-xs text-gray-500">
                  Puedes publicar esta misma propiedad en uno o más portales. Se
                  creará una publicación por cada portal seleccionado.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 border rounded-lg">
      <div className="mt-4">
        <PortalPresence
          actionable
          code={propertyId!}
          buildUpdateBody={() => mapSpcToPortalUpdate(data as any)}
          onChanged={portalRefetch}
        />
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2">Consultar en portales</h3>
        <MultiPortalPublisher
          spc={data as any}
          code={propertyId!}
          onPublished={portalRefetch}
        />
      </div>

      {uiProperty && <PropertyDetail property={uiProperty} />}
    </div>
  )
}

export default Overview
