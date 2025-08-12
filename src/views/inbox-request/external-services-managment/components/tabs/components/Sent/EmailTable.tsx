/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import Table from '@/components/ui/Table'
import Tooltip from '@/components/ui/Tooltip'
import { useGetExternalServicesEmailRequestQuery } from '@/services/RtkQueryService'
import { formatDate } from '@/utils/formatDate'
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
import { useMemo, useState } from 'react'
import { MdEmail } from 'react-icons/md'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import PaginationBottom from './PaginationBottom'

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const EmailTable = ({ onShowDetails, onShowFeedback }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const { data: emails, isFetching } = useGetExternalServicesEmailRequestQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
    },
    { refetchOnMountOrArgChange: true }
  )
  const { Tr, Th, Td, THead, TBody } = Table

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
        accessorKey: 'user_name_user_lastName',
        cell: (cellProps) => (
          <div className="flex items-center">
            <span className="font-bold">
              {cellProps.row.original?.user?.name}{' '}
              {cellProps.row.original?.user?.lastName}
            </span>
          </div>
        ),
      },
      {
        header: 'EMPRESA',
        accessorKey: 'externalService_name',
        cell: (cellProps) => (
          <>{cellProps.row.original?.externalService?.name || '-'}</>
        ),
      },
      {
        header: 'ASUNTO',
        accessorKey: 'subject',
        cell: () => <>{'Solicitud de Servicio'}</>,
      },
      {
        header: 'ENVIADA RECIENTE',
        accessorKey: 'emailSentLastDate',
        cell: (cellProps) => {
          const lastDate = cellProps.row.original.emailSent.at(-1)
          return <span>{formatDate(new Date(lastDate?.datetime)) || '-'}</span>
        },
      },
      {
        header: 'DETALLES',
        accessorKey: 'details',
        cell: (cellProps) => {
          return (
            <div className="w-100 flex justify-center items-center">
              <Tooltip title="Ver detalles de solicitud">
                <span
                  className="cursor-pointer"
                  onClick={() => onShowDetails(cellProps.row.original)}
                >
                  <MdEmail className="text-xl" />
                </span>
              </Tooltip>
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
          <TableRowSkeleton columns={5} rows={5} />
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
    </>
  )
}

export default EmailTable
