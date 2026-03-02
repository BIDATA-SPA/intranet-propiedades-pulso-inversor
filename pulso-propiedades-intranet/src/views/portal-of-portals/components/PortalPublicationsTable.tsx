/* eslint-disable react-hooks/exhaustive-deps */
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Button } from '@/components/ui'
import Dialog from '@/components/ui/Dialog'
import Tooltip from '@/components/ui/Tooltip'
import type { PortalFindParams } from '@/services/portal/portalPublication'
import {
  useFindPortalPublicationsQuery,
  useGetMyInfoQuery,
} from '@/services/RtkQueryService'
import { usePdpSecureActions } from '@/utils/hooks/usePdpSecureActions'
import { truncateString } from '@/utils/truncateString'
import classNames from 'classnames'
import React, { useMemo, useRef, useState } from 'react'
import { HiOutlineEye } from 'react-icons/hi'
import { useSearchParams } from 'react-router-dom'
import PortalFiltersBar from './PortalFiltersBar'

// ---------------------- helpers ----------------------
const clean = (obj: Record<string, any>) => {
  const out: Record<string, any> = {}
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return
    if (typeof v === 'string' && v.trim() === '') return
    out[k] = v
  })
  return out
}

// Normaliza respuesta: soporta array o { items, total }
function pickListAndTotal(res: any) {
  const list = Array.isArray(res) ? res : res?.items ?? res?.data ?? []
  const total =
    (Array.isArray(res)
      ? undefined
      : res?.total ?? res?.totalItems ?? res?.count) ?? list.length
  return { list, total }
}

const fmtCLP = (n: number) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(n)
const fmtUF = (n: number) =>
  `${new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(n)} UF`

// ---------------------- tipos de fila ----------------------
type PortalRow = {
  uuid?: string
  code: string
  title: string
  listing_type: string
  property_type: string
  currency: string
  priceLabel: string
  bedrooms: number
  bathrooms: number
  parking: number
  location: string
  published_at: string
  status?: string
  external_url?: string | null
  area_useful?: number
  area_total?: number
}

const toRow = (p: any): PortalRow => {
  const priceLabel =
    p.currency === 'UF' && p.price_uf > 0
      ? fmtUF(p.price_uf)
      : p.price_clp > 0
      ? fmtCLP(p.price_clp)
      : '—'

  return {
    uuid: p.uuid,
    code: p.code,
    title: p.title,
    listing_type: p.listing_type,
    property_type: p.property_type,
    currency: p.currency,
    priceLabel,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    parking: p.parking,
    location: [p?.location?.commune, p?.location?.city, p?.location?.region]
      .filter(Boolean)
      .join(', '),
    published_at: p.published_at,
    status: p.status,
    external_url: p.external_url,
    area_total: p.area_total,
    area_useful: p.area_useful,
  }
}

// ---------------------- componente ----------------------
const PortalPublicationsTable: React.FC = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const { data } = useGetMyInfoQuery()

  const userOwnerId = data?.id ?? null

  // Estado local de paginación
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page')) || 1
  )
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get('pageSize')) || 100
  )

  // Filtros
  const [filters, setFilters] = useState<PortalFindParams>({
    page,
    page_size: pageSize,
  })

  // Query al portal
  const {
    data: raw,
    isFetching: loading,
    refetch,
  } = useFindPortalPublicationsQuery(
    clean({
      ...filters,
      portal: 'pulsoPropiedades',
      page,
      page_size: pageSize,
    }),
    { refetchOnMountOrArgChange: true }
  )

  const { list, total } = pickListAndTotal(raw)
  const rows: PortalRow[] = useMemo(() => (list || []).map(toRow), [list])

  // hook seguro PDP (tiene secureDelete)
  const { secureDelete } = usePdpSecureActions()

  // Sincroniza URL
  React.useEffect(() => {
    const sp = new URLSearchParams(searchParams)
    sp.set('page', String(page))
    sp.set('pageSize', String(pageSize))
    setSearchParams(sp, { replace: true })
  }, [page, pageSize])

  // Handlers de DataTable
  const handlePaginationChange = (newPageIndex: number) => {
    setPage(newPageIndex)
  }
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPage(1)
    setFilters((prev) => ({ ...prev, page: 1, page_size: newPageSize }))
  }

  const applyFilters = (next: PortalFindParams) => {
    setPage(1)
    setFilters({ ...next, page: 1, page_size: pageSize })
  }

  // -------------- ELIMINAR: estado + dialog --------------
  const [deleteUuid, setDeleteUuid] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const openDeleteDialog = (uuid?: string) => {
    if (!uuid) return
    setDeleteUuid(uuid)
  }
  const closeDeleteDialog = () => {
    if (isDeleting) return
    setDeleteUuid(null)
  }

  const confirmDelete = async () => {
    if (!deleteUuid) return
    setIsDeleting(true)
    try {
      // 👇 ahora sí usamos el hook seguro, que arma { id, pdpToken }
      await secureDelete(deleteUuid)
      setDeleteUuid(null)
      await refetch()
    } catch (err) {
      // podrías mostrar un toast aquí
    } finally {
      setIsDeleting(false)
    }
  }

  // Columnas
  const columns: ColumnDef<PortalRow>[] = useMemo(
    () => [
      {
        header: 'Código',
        accessorKey: 'code',
        cell: (cell) => {
          const row = cell.row.original
          return (
            <Tooltip title="Ver en portal (si aplica)">
              <span
                className="cursor-pointer font-semibold"
                onClick={() => {
                  if (row.external_url)
                    window.open(row.external_url, '_blank', 'noopener')
                }}
              >
                #{row.code}
              </span>
            </Tooltip>
          )
        },
      },
      {
        header: 'Propiedad',
        accessorKey: 'title',
        cell: (cell) => {
          const { title } = cell.row.original
          return (
            <Tooltip title={title}>
              <span className="line-clamp-2 max-w-[28rem] hover:underline">
                {truncateString(title, 35)}
              </span>
            </Tooltip>
          )
        },
      },
      {
        header: 'Operación',
        accessorKey: 'listing_type',
        cell: (cell) => {
          const { listing_type, property_type } = cell.row.original
          return (
            <span className="capitalize">
              {listing_type} de {property_type}
            </span>
          )
        },
      },
      {
        header: 'Precio',
        accessorKey: 'priceLabel',
        cell: (cell) => (
          <span className="font-semibold">{cell.row.original.priceLabel}</span>
        ),
      },
      {
        header: 'Dorm/Baños/Est',
        accessorKey: 'bedrooms',
        cell: (cell) => {
          const { bedrooms, bathrooms, parking } = cell.row.original
          return (
            <span className="tabular-nums">
              {bedrooms} / {bathrooms} / {parking}
            </span>
          )
        },
      },
      {
        header: 'Superficies',
        accessorKey: 'area_useful',
        cell: (cell) => {
          const { area_useful, area_total } = cell.row.original
          return (
            <span className="tabular-nums">
              {area_useful ?? '—'} útil · {area_total ?? '—'} total m²
            </span>
          )
        },
      },
      {
        header: 'Ubicación',
        accessorKey: 'location',
        cell: (cell) => (
          <span className="line-clamp-1 max-w-[20rem]">
            {cell.row.original.location || '—'}
          </span>
        ),
      },
      {
        header: 'Publicada',
        accessorKey: 'published_at',
        cell: (cell) => {
          const { published_at } = cell.row.original
          const d = published_at
            ? new Date(published_at).toLocaleDateString('es-CL')
            : '-'
          return <span>{d}</span>
        },
      },
      {
        header: 'Estado',
        accessorKey: 'status',
        cell: (cell) => {
          const { status } = cell.row.original
          return (
            <div className="flex items-center">
              <span
                className={classNames(
                  'badge-dot',
                  status === 'available' && 'bg-emerald-500',
                  status === 'inactive' && 'bg-gray-400',
                  status === 'reserved' && 'bg-yellow-500',
                  status === 'sold' && 'bg-rose-500'
                )}
              />
              <span
                className={classNames(
                  'ml-2 rtl:mr-2 capitalize font-semibold',
                  status === 'available' && 'text-emerald-600',
                  status === 'inactive' && 'text-gray-500',
                  status === 'reserved' && 'text-yellow-600',
                  status === 'sold' && 'text-rose-600'
                )}
              >
                {status || '—'}
              </span>
            </div>
          )
        },
      },
      {
        header: 'Acciones',
        id: 'actions',
        cell: (cell) => {
          const row = cell.row.original
          const open = () => {
            if (row.external_url)
              window.open(row.external_url, '_blank', 'noopener')
          }
          const canDelete = Boolean(row.uuid)
          return (
            <div className="flex items-center flex-row justify-around">
              <Tooltip title="Ver detalle">
                <span
                  className="cursor-pointer p-2 hover:text-blue-500 rounded-full bg-gray-50 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-800"
                  onClick={open}
                >
                  <HiOutlineEye className="text-lg lg:text-xl" />
                </span>
              </Tooltip>
              {/* <Tooltip
                title={
                  canDelete
                    ? 'Eliminar'
                    : 'Esta publicación no tiene UUID, no se puede eliminar'
                }
              >
                <span
                  className={classNames(
                    'cursor-pointer p-2 rounded-full bg-gray-50 dark:bg-gray-600',
                    canDelete
                      ? 'hover:text-red-500 hover:bg-gray-200 dark:hover:bg-gray-800'
                      : 'opacity-40 cursor-not-allowed'
                  )}
                  onClick={() => {
                    if (!canDelete) return
                    openDeleteDialog(row.uuid)
                  }}
                >
                  <HiTrash className="text-lg lg:text-xl" />
                </span>
              </Tooltip> */}
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <div className="w-full">
      <div className="mb-8">
        <PortalFiltersBar
          value={{ ...filters, page, page_size: pageSize }}
          onChange={applyFilters}
        />
      </div>

      <DataTable<PortalRow>
        ref={tableRef}
        columns={columns}
        data={rows}
        loading={loading}
        pagingData={{
          total: total ?? rows.length,
          pageIndex: page,
          pageSize: pageSize,
        }}
        onPaginationChange={handlePaginationChange}
        onSelectChange={handlePageSizeChange}
      />

      {/* Dialog de confirmación de eliminación */}
      <Dialog
        isOpen={Boolean(deleteUuid)}
        onClose={closeDeleteDialog}
        onRequestClose={closeDeleteDialog}
      >
        <h5 className="mb-2">Eliminar publicación</h5>
        <p className="text-sm">
          Esta acción eliminará la publicación del Portal de Portales.
          <br />
          <span className="text-xs text-slate-500">
            UUID: {deleteUuid ?? '—'}
          </span>
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            disabled={isDeleting}
            onClick={closeDeleteDialog}
          >
            Cancelar
          </Button>
          <Button
            variant="solid"
            color="red-500"
            disabled={!deleteUuid}
            loading={isDeleting}
            onClick={confirmDelete}
          >
            Eliminar definitivamente
          </Button>
        </div>
      </Dialog>
    </div>
  )
}

export default PortalPublicationsTable
