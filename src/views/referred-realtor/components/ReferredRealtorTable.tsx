/* eslint-disable react-hooks/exhaustive-deps */
import { IReferredRealtor } from '@/@types/modules/referred-realtor.type'
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Tooltip } from '@/components/ui'
import Avatar from '@/components/ui/Avatar'
import { RootState } from '@/store'
import { truncateString } from '@/utils/truncateString'
import React, { useMemo, useRef } from 'react'
import { FaUser } from 'react-icons/fa'
import { FaHouseCircleCheck } from 'react-icons/fa6'
import { useDispatch, useSelector } from 'react-redux'
import { setPageIndex, setPageSize } from '../store'

const ReferredRealtorTable: React.FC = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const dispatch = useDispatch()

  const { page, limit, realtors, totalItems, isLoading } = useSelector(
    (state: RootState) => state.referredRealtorList.data
  )

  const handlePageChange = (newPageIndex: number) => {
    dispatch(setPageIndex(newPageIndex))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize))
  }

  const columns: ColumnDef<IReferredRealtor>[] = useMemo(
    () => [
      {
        header: 'Origen',
        accessorKey: 'name',
        cell: ({ row: { original } }) => {
          return <ReferredRealtorColumn original={original} />
        },
      },
      {
        header: 'Corredor/a Referenciado/a',
        accessorKey: 'receiver.name',
        cell: ({ row: { original } }) => {
          const avatarreceiver = original?.receiver?.image ? (
            <Avatar src={original?.receiver?.image} shape="circle" />
          ) : (
            <Avatar icon={<FaUser />} shape="circle" />
          )

          return (
            <Tooltip
              title={`
                ${original?.receiver?.session?.rol?.name}
                ${original?.receiver?.name && original?.receiver?.name} ${
                original?.receiver?.lastName && original?.receiver?.lastName
              }`}
            >
              <div className="flex items-center rounded-full cursor-pointer">
                {avatarreceiver}
                <div className="flex flex-col justify-start ml-2 rtl:mr-2 font-semibold">
                  <span>
                    {original?.receiver?.name &&
                      truncateString(original?.receiver?.name, 50)}{' '}
                    {original?.receiver?.lastName &&
                      truncateString(original?.receiver?.lastName, 20)}
                  </span>
                  <small className="font-normal">
                    {original?.receiver?.session?.email}
                  </small>
                </div>
              </div>
            </Tooltip>
          )
        },
      },
      {
        header: 'Propiedades registras',
        accessorKey: 'properties',
        cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-row justify-center items-center ml-5">
              <Tooltip
                title={`${
                  original?.receiver?.name &&
                  `${original?.receiver?.name} ha creado ${
                    original?.receiver?.propertyCount === 1
                      ? `${original?.receiver?.propertyCount} Propiedad`
                      : `${original?.receiver?.propertyCount} Propiedades`
                  } con tu código de referidos.`
                } `}
              >
                <span className="text-sky-500 font-bold hover:underline">
                  {original?.receiver?.propertyCount > 0 ? (
                    <span className="flex items-center">
                      <FaHouseCircleCheck className="mr-1" />
                      {original?.receiver?.propertyCount}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaHouseCircleCheck className="mr-1" />
                      {'0'}
                    </span>
                  )}
                </span>
              </Tooltip>
            </div>
          )
        },
      },
      {
        header: 'Código  de referencia',
        accessorKey: 'sender.referralCode',
        cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-row justify-start items-center ml-5">
              <Tooltip
                title={`${
                  original?.receiver?.name &&
                  `${original?.receiver?.name} ha utilizado este código para crear y publicar en Procanje.`
                } `}
              >
                <span className="text-sky-500 font-bold hover:underline">
                  {original?.sender?.referralCode ?? '-'}
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
      data={realtors}
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

const ReferredRealtorColumn = ({
  original,
}: {
  original: IReferredRealtor
}) => {
  const avatarSender = original?.sender?.image ? (
    <Avatar src={original?.sender?.image} shape="circle" />
  ) : (
    <Avatar icon={<FaUser />} shape="circle" />
  )

  return (
    <Tooltip
      title={`${original?.receiver?.session?.rol?.name} ${
        original?.sender?.name && original?.sender?.name
      } ${original?.sender?.lastName && original?.sender?.lastName}`}
    >
      <div className="flex items-center rounded-full cursor-pointer">
        {avatarSender}
        <div className="flex flex-col justify-start ml-2 rtl:mr-2 font-semibold">
          <span>
            {original?.sender?.name &&
              truncateString(original?.sender?.name, 50)}{' '}
            {original?.sender?.lastName &&
              truncateString(original?.sender?.lastName, 20)}
          </span>
          <small className="font-normal">
            {original?.receiver?.session?.email}
          </small>
        </div>
      </div>
    </Tooltip>
  )
}

export default ReferredRealtorTable
