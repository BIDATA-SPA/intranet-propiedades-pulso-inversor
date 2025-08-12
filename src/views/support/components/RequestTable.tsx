/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import Table from '@/components/ui/Table'
import Tooltip from '@/components/ui/Tooltip'
import { useGetSupportRequestQuery } from '@/services/RtkQueryService'
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
import classNames from 'classnames'
import { useMemo, useState } from 'react'
import { IoMdEye } from 'react-icons/io'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import PaginationBottom from './PaginationBottom'

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const RequestTable = ({ onShowDelete, onShowDetails }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const { data: requests, isFetching } = useGetSupportRequestQuery(
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
        header: 'NÚMERO DE SOLICITUD',
        accessorKey: 'id',
        cell: (cellProps) => {
          const { id } = cellProps.row.original
          return (
            <div className="flex items-center">
              <span className="font-bold">#{id}</span>
            </div>
          )
        },
      },
      {
        header: 'CATEGORÍA',
        accessorKey: 'category',
        cell: (cellProps) => {
          const { category } = cellProps.row.original
          return (
            <div className="flex items-center">
              <span>{category?.name}</span>
            </div>
          )
        },
      },
      {
        header: 'ENVIADA',
        accessorKey: 'createdAt',
        cell: (cellProps) => {
          const { createdAt } = cellProps.row.original
          return (
            <div className="flex items-center">
              <span>{formatDate(createdAt)}</span>
            </div>
          )
        },
      },
      {
        header: 'ESTADO DE SOLICITUD',
        accessorKey: 'status',
        cell: (cellProps) => {
          const { status } = cellProps.row.original
          return (
            <>
              <div className="flex items-center">
                <span
                  className={classNames(
                    'badge-dot',
                    status?.name === 'Pendiente' && 'bg-yellow-500',
                    status?.name === 'Cerrada' && 'bg-emerald-500',
                    status?.name === null && 'bg-gray-500'
                  )}
                ></span>
                <span
                  className={classNames(
                    'ml-2 rtl:mr-2 capitalize font-semibold',
                    status?.name === 'Pendiente' && 'text-yellow-500',
                    status?.name === 'Cerrada' && 'text-emerald-500',
                    status?.name === null && 'text-gray-500'
                  )}
                >
                  {status?.name === null ? 'No definido.' : status?.name}
                </span>
              </div>
            </>
          )
        },
      },

      {
        header: 'FECHA DE RESOLUCION',
        accessorKey: 'closedAt',
        cell: (cellProps) => {
          const { closedAt } = cellProps.row.original
          return (
            <div className="flex items-center">
              <span>{formatDate(closedAt || new Date())}</span>
            </div>
          )
        },
      },

      {
        header: 'DETALLES',
        accessorKey: 'details',
        cell: (cellProps) => {
          return (
            <div className="w-full text-center justify-center items-center">
              <Tooltip title="Ver detalles">
                <span
                  className="cursor-pointer flex text-center justify-center items-center mt-1"
                  onClick={() => onShowDetails(cellProps.row.original)}
                >
                  <IoMdEye className="text-xl" />
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
    data: requests?.data,
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
          <TableRowSkeleton columns={7} rows={5} />
        ) : (
          <TBody className="dark:text-white/90 dark:font-semibold">
            {table.getRowModel()?.rows?.map((row) => {
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
          currentPage={+requests?.meta?.page}
          total={requests?.meta?.totalItems}
          pageSize={pageSize}
          onChange={onPaginationChange}
          onPageSelect={onPageSelect}
        />
      </div>
    </>
  )
}

export default RequestTable
