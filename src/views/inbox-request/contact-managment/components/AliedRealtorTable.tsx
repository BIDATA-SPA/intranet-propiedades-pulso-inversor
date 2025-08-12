/* eslint-disable react-hooks/exhaustive-deps */
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Tooltip } from '@/components/ui'
import Avatar from '@/components/ui/Avatar'
import { RootState } from '@/store'
import { formatDate } from '@/utils/formatDate'
import { truncateString } from '@/utils/truncateString'
import React, { useMemo, useRef } from 'react'
import { FaUser } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { setPageIndex, setPageSize } from '../store'

const AliedRealtorTable: React.FC = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const dispatch = useDispatch()
  const { page, limit, requests, totalItems, isLoading } = useSelector(
    (state: RootState) => state.aliedRealtorRequestList.data
  )

  const handlePageChange = (newPageIndex: number) => {
    dispatch(setPageIndex(newPageIndex))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize))
  }

  const columns: ColumnDef<any>[] = useMemo(
    () => [
      {
        header: 'Remitente',
        accessorKey: 'sender',
        cell: ({ row: { original } }) => {
          const sender = original?.sender
          return (
            <div className="flex items-center gap-3">
              <Avatar
                src={sender?.image || ''}
                shape="circle"
                icon={!sender?.image && <FaUser />}
              />
              <div>
                <span className="font-semibold">
                  {sender?.name || 'N/A'} {sender?.lastName || ''}
                </span>
                <small className="block text-gray-500">
                  {sender?.session?.email || 'Correo no disponible'}
                </small>
              </div>
            </div>
          )
        },
      },
      {
        header: 'Destinatario',
        accessorKey: 'receiver',
        cell: ({ row: { original } }) => {
          const receiver = original?.receiver
          return (
            <div className="flex items-center gap-3">
              <Avatar
                src={receiver?.image || ''}
                shape="circle"
                icon={!receiver?.image && <FaUser />}
              />
              <div>
                <span className="font-semibold">
                  {receiver?.name || 'N/A'} {receiver?.lastName || ''}
                </span>
                <small className="block text-gray-500">
                  {receiver?.session?.email || 'Correo no disponible'}
                </small>
              </div>
            </div>
          )
        },
      },
      {
        header: 'Mensaje',
        accessorKey: 'message',
        cell: ({ row: { original } }) => (
          <Tooltip title={original?.message || 'Sin mensaje'}>
            <span>
              {truncateString(original?.message, 50) || 'Sin mensaje'}
            </span>
          </Tooltip>
        ),
      },
      {
        header: 'Fecha de solicitud',
        accessorKey: 'createdAt',
        cell: ({ row: { original } }) => (
          <span>
            {original?.createdAt
              ? formatDate(original?.createdAt)
              : 'Fecha no disponible'}
          </span>
        ),
      },
      {
        header: 'Estado',
        accessorKey: 'responded',
        cell: ({ row: { original } }) => (
          <span
            className={`px-2 py-1 rounded-full flex text-nowrap w-28 justify-center text-center ${
              original?.responded
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {original?.responded ? 'Respondido' : 'No respondido'}
          </span>
        ),
      },
    ],
    []
  )

  return (
    <DataTable
      ref={tableRef}
      columns={columns}
      data={requests}
      loading={isLoading}
      pagingData={{
        total: totalItems,
        pageIndex: page,
        pageSize: limit,
      }}
      onPaginationChange={handlePageChange}
      onSelectChange={handlePageSizeChange}
    />
  )
}

export default AliedRealtorTable
