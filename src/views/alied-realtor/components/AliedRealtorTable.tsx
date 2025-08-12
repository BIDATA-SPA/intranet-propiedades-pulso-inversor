/* eslint-disable react-hooks/exhaustive-deps */
import { IRealtor } from '@/@types/modules/aliated-realtor.type'
import type {
  ColumnDef,
  DataTableResetHandle,
} from '@/components/shared/DataTable'
import DataTable from '@/components/shared/DataTable'
import { Tooltip } from '@/components/ui'
import Avatar from '@/components/ui/Avatar'
import { RootState } from '@/store'
import { useCopyToClipboard } from '@/utils/hooks/useCopyToClipboard'
import useNotification from '@/utils/hooks/useNotification'
import { truncateString } from '@/utils/truncateString'
import { getRating } from '@/views/inbox-request/kanje-managment/components/tabs/components/Inbox/UserRating'
import { Rating, ThinStar } from '@smastrom/react-rating'
import React, { useCallback, useMemo, useRef } from 'react'
import { FaClipboard, FaRegClipboard, FaUser, FaWhatsapp } from 'react-icons/fa'
import { HiOutlineExternalLink } from 'react-icons/hi'
import { MdMail, MdPhone } from 'react-icons/md'
import { PiChatsFill } from 'react-icons/pi'
import { useDispatch, useSelector } from 'react-redux'
import {
  setPageIndex,
  setPageSize,
  setSelectedRow,
  toggleEmailDialog,
} from '../store'

const ratingStyles = {
  itemShapes: ThinStar,
  activeFillColor: '#facc15',
  inactiveFillColor: '#fef08a',
}

const AliedRealtorTable: React.FC = () => {
  const tableRef = useRef<DataTableResetHandle>(null)
  const dispatch = useDispatch()
  const { isCopied, copyToClipboard } = useCopyToClipboard()
  const { showNotification } = useNotification()
  const { page, limit, realtors, totalItems, isLoading } = useSelector(
    (state: RootState) => state.aliedRealtorList.data
  )

  const handlePageChange = (newPageIndex: number) => {
    dispatch(setPageIndex(newPageIndex))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize))
  }

  const handleCopyToClipboard = (original) => {
    if (original?.phone) {
      copyToClipboard(original?.phone)
      showNotification('success', 'Copiado', '')
    }
  }

  const onEmailDialogOpen = useCallback(
    (row) => {
      dispatch(toggleEmailDialog(true))
      dispatch(setSelectedRow(row))
    },
    [dispatch]
  )

  const columns: ColumnDef<IRealtor>[] = useMemo(
    () => [
      {
        header: 'Corredor/a',
        accessorKey: 'name',
        cell: ({ row: { original } }) => {
          return <AliedRealtorColumn original={original} />
        },
      },
      {
        header: 'Calificacion',
        accessorKey: 'rating',
        cell: ({ row: { original } }) => {
          return (
            <div className="cursor-pointer flex flex-row justify-start items-center">
              <Tooltip
                title={`Calificación ${Math.ceil(
                  original?.averageRating || 0
                )} ${getRating(Math.ceil(original?.averageRating || 0))}`}
              >
                <Rating
                  readOnly
                  className="w-[90px]"
                  itemStyles={ratingStyles}
                  value={Math.ceil(original?.averageRating || 0)}
                />
              </Tooltip>
            </div>
          )
        },
      },
      {
        header: 'Teléfono / Celular',
        accessorKey: 'phone',
        cell: ({ row: { original } }) => {
          return (
            <div
              className="cursor-pointer flex flex-row justify-start items-center"
              onClick={() => handleCopyToClipboard(original)}
            >
              <span className="mr-1.5">
                <MdPhone className="text-xl" />
              </span>
              <span>{truncateString(original?.phone, 13) ?? '-'}</span>

              <button
                type="button"
                className="ml-2"
                onClick={() => handleCopyToClipboard(original)}
              >
                {isCopied ? <FaClipboard /> : <FaRegClipboard />}
              </button>
            </div>
          )
        },
      },
      {
        header: 'Correo electrónico',
        accessorKey: 'session.email',
        cell: ({ row: { original } }) => {
          const email = original?.session?.email ?? '-'
          return (
            <div className="flex flex-row justify-start items-center group">
              <span className="mr-1.5 group-hover:underline text-blue-500 hover:text-blue-700">
                <MdMail className="text-xl" />
              </span>
              {email !== '-' ? (
                <Tooltip title="Enviar un correo">
                  <button
                    type="button"
                    className="text-blue-500 hover:underline hover:text-blue-700 transition duration-150 group-hover:underline"
                    title={`Enviar un correo a ${email}`}
                    onClick={() => onEmailDialogOpen(original)}
                  >
                    {email}
                  </button>
                </Tooltip>
              ) : (
                <span>{email}</span>
              )}
            </div>
          )
        },
      },
      {
        header: 'Página web',
        accessorKey: 'webPage',
        cell: ({ row: { original } }) => {
          return (
            <div className="flex flex-row justify-start items-center">
              {original?.webPage ? (
                <Tooltip title="Visitar">
                  <a
                    href={original?.webPage}
                    target="_blank"
                    rel="norefre noreferrer"
                    className="flex items-center hover:underline text-blue-400 hover:text-blue-500"
                  >
                    <HiOutlineExternalLink className="mr-1 text-lg" />
                    Visitar web
                  </a>
                </Tooltip>
              ) : (
                <span>Web no disponible</span>
              )}
            </div>
          )
        },
      },
      {
        header: 'Acciones',
        id: 'actions',
        cell: ({ row: { original } }) => <TableActions original={original} />,
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

const AliedRealtorColumn = ({ original }: { original: IRealtor }) => {
  const avatar = original?.image ? (
    <Avatar src={original?.image} shape="circle" />
  ) : (
    <Avatar icon={<FaUser />} shape="circle" />
  )

  return (
    <Tooltip
      title={`${original?.name && original.name} ${
        original?.lastName && original?.lastName
      }`}
    >
      <div className="flex items-center rounded-full cursor-pointer">
        {avatar}
        <div className="flex flex-col justify-start ml-2 rtl:mr-2 font-semibold">
          <span>
            {original?.name && truncateString(original.name, 50)}{' '}
            {original?.lastName && truncateString(original?.lastName, 20)}
          </span>
          <small className="font-normal">{original.session.rol.name}</small>
        </div>
      </div>
    </Tooltip>
  )
}

const TableActions = ({ original }: { original: IRealtor }) => {
  const normalizedPhone = original?.phone?.replace('+', '') || ''

  const apiNumber = normalizedPhone
    ? `https://api.whatsapp.com/send/?phone=${normalizedPhone}&text&type=phone_number&app_absent=0`
    : ''

  return (
    <div className="flex justify-center items-center gap-3 text-lg">
      {normalizedPhone ? (
        <Tooltip title="Ir a WhatsApp">
          <a
            href={apiNumber}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#25D366] hover:underline hover:text-[#25D366]"
          >
            <FaWhatsapp />
          </a>
        </Tooltip>
      ) : (
        <span className="text-gray-500 italic">Teléfono no disponible</span>
      )}

      <Tooltip title="Ir al Chat">
        <span
          className="cursor-pointer p-2 hover:text-yellow-500"
          onClick={() => alert('Acción deshabilitada')}
        >
          <PiChatsFill />
        </span>
      </Tooltip>
    </div>
  )
}

export default AliedRealtorTable
