/* eslint-disable react-hooks/exhaustive-deps */
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import Tooltip from '@/components/ui/Tooltip'
import { RootState } from '@/store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { switchPrice } from '@/utils/switch-price'
import { truncateString } from '@/utils/truncateString'
import { formatDate } from '@fullcalendar/core'
import classNames from 'classnames'
import React, { useCallback, useMemo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPageIndex, setPageSize, useAppDispatch } from '../store'
import { Property } from '../store/types'
import ActionColumn from './ActionColumn'
import PropertyAvatarColumn from './PropertyAvatarColumn'

const PropertiesTable: React.FC = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const dispatch = useAppDispatch()

  // Properties from store
  const properties = useSelector(
    (state: RootState) => state.propertiesList.data.properties
  )

  // Properties loading from store
  const loadingProperties = useSelector(
    (state: RootState) => state.propertiesList.data.loading
  )

  // Metadata from properties store
  const { page, limit, totalItems } = useSelector(
    (state: RootState) => state.propertiesList.data
  )

  const handlePaginationChange = (newPageIndex: number) => {
    dispatch(setPageIndex(newPageIndex))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize))
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
/*       {
        header: 'Estado de canje',
        accessorKey: 'statusExchange',
        cell: (cellProps) => {
          const { isExchanged } = cellProps.row.original
          return (
            <div className="flex items-center justify-start">
              <span
                className={classNames(
                  'badge-dot',
                  isExchanged && 'bg-sky-500',
                  !isExchanged && 'bg-gray-500'
                )}
              ></span>
              <span
                className={classNames(
                  'ml-2 rtl:mr-2 capitalize font-semibold',
                  isExchanged && 'text-sky-500',
                  !isExchanged && 'text-gray-500'
                )}
              >
                {isExchanged ? 'En Canje' : 'Estado no definido'}
              </span>
            </div>
          )
        },
      }, */
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
        cell: (props) => <ActionColumn row={props.row.original} className="" />,
      },
    ],
    []
  )

  return (
    <>
      <DataTable
        ref={tableRef}
        columns={columns}
        data={properties}
        loading={loadingProperties}
        pagingData={{
          total: totalItems,
          pageIndex: page,
          pageSize: limit,
        }}
        onPaginationChange={handlePaginationChange}
        onSelectChange={handlePageSizeChange}
      />
    </>

    // Update status dialogs
  )
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

export default PropertiesTable
