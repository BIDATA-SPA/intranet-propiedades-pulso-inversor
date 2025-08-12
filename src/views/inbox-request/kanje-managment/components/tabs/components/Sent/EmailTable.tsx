/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import Dialog from '@/components/ui/Dialog'
import Table from '@/components/ui/Table'
import Tooltip from '@/components/ui/Tooltip'
import { useGetExchangeEmailRequestQuery } from '@/services/RtkQueryService'
import { formatDate } from '@fullcalendar/core'
import type { ColumnFiltersState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { GrDocumentMissing } from 'react-icons/gr'
import { MdEditDocument, MdEmail } from 'react-icons/md'
import { RiShareLine } from 'react-icons/ri'
import { TbPencilMinus, TbStars } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import SignForm from './Dialog/SignForm'
import PaginationBottom from './PaginationBottom'

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const EmailTable = ({ onShowDetails, onShowPreview, onShowRatingUser }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const { data: emails, isFetching } = useGetExchangeEmailRequestQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
    },
    { refetchOnMountOrArgChange: true }
  )
  const [dialogIsOpen, setIsOpen] = useState(false)
  const [currentEmail, setCurrentEmail] = useState(null)
  const { Tr, Th, Td, THead, TBody } = Table

  const openDialog = () => {
    setIsOpen(true)
  }

  const onDialogClose = () => {
    setIsOpen(false)
    setCurrentEmail(null)
  }

  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1)
    setCurrentPage(page)
  }

  const onPageSelect = ({ value }: SelectType) => {
    setPageSize(value)
    table.setPageSize(Number(value))
  }

  const columns = useMemo(
    () => [
      {
        header: 'CORREDOR EMISOR',
        accessorKey: 'requestingRealtor_name',
        cell: (cellProps) => (
          <div className="flex items-center">
            <span className="font-bold">
              {cellProps.row.original?.requestingRealtor?.name || '-'}{' '}
              {cellProps.row.original?.requestingRealtor?.lastName || '-'}
            </span>
          </div>
        ),
      },
      {
        header: 'CORREDOR PROPIETARIO',
        accessorKey: 'realtorOwner_name_realtorOwner_name_LastName',
        cell: (cellProps) => (
          <>
            {cellProps.row.original?.realtorOwner?.name}{' '}
            {cellProps.row.original?.realtorOwner?.lastName}
          </>
        ),
      },
      {
        header: 'ASUNTO',
        accessorKey: 'subject',
        cell: () => <>{'Solicitud de Canje'}</>,
      },
      {
        header: 'ENVIADA RECIENTE',
        accessorKey: 'emailsSent_lastDate',
        cell: (cellProps) => {
          const lastDate = cellProps.row.original.emailsSent.at(-1)
          return <span>{formatDate(new Date(lastDate?.datetime)) || '-'}</span>
        },
      },
      {
        header: 'Estado',
        accessorKey: 'status',
        cell: (cellProps) => {
          return (
            <>
              <div className="flex items-center">
                <span
                  className={classNames(
                    'badge-dot',
                    cellProps.row.original?.status?.name === 'Pendiente' &&
                      'bg-yellow-500',

                    cellProps.row.original?.status?.name === 'Aprobada' &&
                      'bg-emerald-500',

                    cellProps.row.original?.status?.name === 'Rechazada' &&
                      'bg-red-500',

                    cellProps.row.original?.status?.name === null &&
                      'bg-gray-500'
                  )}
                ></span>
                <span
                  className={classNames(
                    'ml-2 rtl:mr-2 capitalize font-semibold',
                    cellProps.row.original?.status?.name === 'Pendiente' &&
                      'text-yellow-500',

                    cellProps.row.original?.status?.name === 'Aprobada' &&
                      'text-emerald-500',

                    cellProps.row.original?.status?.name === 'Rechazada' &&
                      'text-red-500',

                    cellProps.row.original?.status?.name === null &&
                      'text-gray-500'
                  )}
                >
                  {cellProps.row.original?.status?.name === null
                    ? 'No definido.'
                    : cellProps.row.original?.status?.name}
                </span>
              </div>
            </>
          )
        },
      },
      {
        header: 'Permisos de publicación',
        accessorKey: 'isShareable',
        cell: (cellProps) => {
          const lastContract =
            cellProps.row.original?.contract[
              cellProps.row.original?.contract?.length - 1
            ]

          const isShareable = lastContract?.isShareable

          return (
            <div className="w-100 flex justify-center items-center">
              <Tooltip title={isShareable ? 'Autorizado/a' : 'No Autorizado/a'}>
                <span
                  className={`${
                    isShareable ? 'text-green-500' : 'text-red-500'
                  } cursor-pointer flex`}
                >
                  <RiShareLine className="text-xl mr-1.5" />
                  {isShareable ? 'Autorizado/a' : 'No Autorizado/a'}
                </span>
              </Tooltip>
            </div>
          )
        },
      },
      {
        header: 'Estado de contrato',
        accessorKey: 'contract',
        cell: (cellProps) => {
          const { row } = cellProps
          const contracts = row.original?.contract
          const latestContract = contracts?.[contracts.length - 1]
          const disabledContract = contracts?.length === 0 || !contracts

          return (
            <div className="flex items-center justify-center">
              {latestContract?.applicantSignature ? (
                <Tooltip title="Firmado">
                  <div className="flex items-center">
                    <img
                      src="/img/contracts/check.png"
                      alt="signature"
                      className="w-auto h-6"
                    />
                    <span className="ml-1">Firmado</span>
                  </div>
                </Tooltip>
              ) : (
                <Tooltip
                  title={
                    disabledContract
                      ? 'El contrato aún no ha sido firmado por el corredor propietario.'
                      : 'Firma pendiente: Corredor solicitante.'
                  }
                >
                  <button
                    disabled={disabledContract}
                    className="underline hover:text-yellow-600"
                    onClick={() => {
                      openDialog()
                      setCurrentEmail(cellProps.row.original)
                    }}
                  >
                    <span className="cursor-pointer flex items-center text-yellow-500 underline">
                      <TbPencilMinus className="text-2xl ml-2" />
                      Firma pendiente
                    </span>
                  </button>
                </Tooltip>
              )}
            </div>
          )
        },
      },
      {
        header: 'Contrato',
        accessorKey: 'contract-file',
        cell: (cellProps) => {
          const contracts = cellProps.row.original?.contract
          const latestContract = contracts?.[contracts.length - 1]

          return (
            <div className="flex items-center justify-center">
              {latestContract?.applicantSignature ? (
                <>
                  <Tooltip title="Ver contrato">
                    <span
                      className="cursor-pointer"
                      onClick={() => onShowPreview(cellProps.row.original)}
                    >
                      <MdEditDocument className="text-lg hover:text-blue-500" />
                    </span>
                  </Tooltip>
                </>
              ) : (
                <Tooltip title="El documento será visible siempre y cuando ambas partes hayan acordado el contrato.">
                  <span className="cursor-pointer flex items-center text-yellow-500 font-semibold">
                    <GrDocumentMissing className="text-xl mr-1" />
                    Pendiente
                  </span>
                </Tooltip>
              )}
            </div>
          )
        },
      },
      {
        header: 'DETALLES',
        accessorKey: 'details',
        cell: (cellProps) => {
          const { original } = cellProps.row

          const lastContract =
            original?.contract?.[original?.contract?.length - 1]

          const showRatingAction =
            lastContract?.ownerSignature && lastContract?.applicantSignature

          return (
            <div className="w-full text-center flex justify-between items-center">
              <Tooltip title="Ver detalles de solicitud">
                <span
                  className="cursor-pointer flex text-center justify-center items-center mt-1"
                  onClick={() => onShowDetails(cellProps.row.original)}
                >
                  <MdEmail className="text-xl" />
                </span>
              </Tooltip>

              {showRatingAction && (
                <Tooltip title="Calificar corredor/a">
                  <span
                    className="cursor-pointer"
                    onClick={() => onShowRatingUser(cellProps.row.original)}
                  >
                    <TbStars className="text-lg hover:text-yellow-500" />
                  </span>
                </Tooltip>
              )}
            </div>
          )
        },
      },
    ],
    [navigate]
  )

  const table = useReactTable({
    data: emails?.data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugColumns: false,
    debugHeaders: false,
    debugRows: false,
    debugTable: false,
  })

  return (
    <>
      <Table>
        <THead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </Th>
                )
              })}
            </Tr>
          ))}
        </THead>

        {isFetching ? (
          <TableRowSkeleton columns={6} rows={5} />
        ) : (
          <TBody className="dark:text-white/90 dark:font-semibold">
            {table.getRowModel().rows.map((row) => {
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </TBody>
        )}
      </Table>

      <div className="flex items-center mt-5">
        <PaginationBottom
          currentPage={+emails?.meta?.page}
          total={emails?.meta?.totalItems}
          pageSize={pageSize}
          onChange={onPaginationChange}
          onPageSelect={onPageSelect}
        />
      </div>

      <div>
        <Dialog
          width={800}
          isOpen={dialogIsOpen}
          onClose={onDialogClose}
          onRequestClose={onDialogClose}
        >
          <SignForm currentEmail={currentEmail} onClose={onDialogClose} />
        </Dialog>
      </div>
    </>
  )
}

export default EmailTable
