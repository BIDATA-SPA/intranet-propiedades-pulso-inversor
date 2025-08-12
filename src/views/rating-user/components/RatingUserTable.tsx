/* eslint-disable react-hooks/exhaustive-deps */
import { IRatingUserByCustomer } from '@/@types/modules/rating-user.type'
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Tooltip } from '@/components/ui'
import { RootState } from '@/store'
import { formatDate } from '@/utils/formatDate'
import { truncateString } from '@/utils/truncateString'
import { getRating } from '@/views/inbox-request/kanje-managment/components/tabs/components/Inbox/UserRating'
import { Rating, ThinStar } from '@smastrom/react-rating'
import React, { useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPageIndex, setPageSize } from '../store'

const ratingStyles = {
  itemShapes: ThinStar,
  activeFillColor: '#facc15',
  inactiveFillColor: '#fef08a',
}

const RatingUserTable: React.FC = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const dispatch = useDispatch()

  const { page, limit, ratingUsers, totalItems, isLoading } = useSelector(
    (state: RootState) => state.ratingUserList.data
  )

  const handlePageChange = (newPageIndex: number) => {
    dispatch(setPageIndex(newPageIndex))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize))
  }

  const columns: ColumnDef<IRatingUserByCustomer>[] = useMemo(
    () => [
      {
        header: 'id',
        accessorKey: 'id',
        cell: ({ row: { original } }) => {
          return (
            <Tooltip title={original.id}>
              <span className="flex items-center rounded-full cursor-pointer">
                {`#${original.id}`}
              </span>
            </Tooltip>
          )
        },
      },
      {
        header: 'Corredor/Cliente',
        accessorKey: 'realtor',
        cell: ({ row: { original } }) => {
          return (
            <Tooltip
              title={` ${
                original?.customer
                  ? `${original?.customer?.name} ${
                      original?.customer?.lastName
                    } ${
                      original?.customer?.alias
                        ? `(${original?.customer?.alias}) `
                        : ''
                    }`
                  : 'Calificado/a por corredor/a'
              }  `}
            >
              <span className="cursor-pointer">
                {original?.customer
                  ? `${original?.customer?.name} ${
                      original?.customer?.lastName
                    } ${
                      original?.customer?.alias
                        ? `(${original?.customer?.alias}) `
                        : ''
                    }`
                  : 'Calificado/a por corredor/a'}
              </span>
            </Tooltip>
          )
        },
      },
      {
        header: 'Calificaciones',
        accessorKey: 'rating',
        cell: ({ row: { original } }) => {
          return (
            <Tooltip
              title={`Calificación: ${original.rating} ${getRating(
                original?.rating
              )}`}
            >
              <span className="cursor-pointer">
                <Rating
                  readOnly
                  transition="zoom"
                  className="w-[90px]"
                  value={original?.rating}
                  itemStyles={ratingStyles}
                />
              </span>
            </Tooltip>
          )
        },
      },
      {
        header: 'Comentarios',
        accessorKey: 'comment',
        cell: ({ row: { original } }) => {
          return (
            <Tooltip title={`${(original.comment && original.comment) || '-'}`}>
              <span className="flex items-center rounded-full cursor-pointer">
                {(original.comment && truncateString(original.comment, 30)) ||
                  '-'}
              </span>
            </Tooltip>
          )
        },
      },
      {
        header: 'Enviada',
        accessorKey: 'createdAt',
        cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-row justify-center items-center">
              <Tooltip
                title={`${
                  (original.createdAt &&
                    `Con fecha y hora: ${formatDate(original.createdAt)}`) ||
                  '-'
                }`}
              >
                <span className="flex items-center rounded-full cursor-pointer">
                  {original.createdAt && formatDate(original.createdAt)}
                </span>
              </Tooltip>
            </div>
          )
        },
      },
    ],
    []
  )

  return (
    <DataTable
      ref={tableRef}
      columns={columns}
      data={ratingUsers}
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

export default RatingUserTable
