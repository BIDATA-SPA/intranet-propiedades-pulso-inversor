/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import Table from '@/components/ui/Table'
import Tooltip from '@/components/ui/Tooltip'
import { useGetRealtorIdeasQuery } from '@/services/RtkQueryService'
import { truncateString } from '@/utils/truncateString'
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
import { FaRegLightbulb } from 'react-icons/fa'
import { FaPen } from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import PaginationBottom from './PaginationBottom'

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const IdeasTable = ({ onShowDetails }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const { data: requests, isFetching } = useGetRealtorIdeasQuery(
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
        header: 'IDEA',
        accessorKey: 'title',
        cell: (cellProps) => {
          const { title } = cellProps.row.original
          return (
            <div className="flex items-center">
              <Tooltip title={title}>
                <span className="hover:underline flex items-center">
                  <FaRegLightbulb className="mr-1 text-yellow-500" />
                  {truncateString(title, 50)}
                </span>
              </Tooltip>
            </div>
          )
        },
      },
      {
        header: 'Descripción',
        accessorKey: 'description',
        cell: (cellProps) => {
          const { description } = cellProps.row.original
          return (
            <div className="flex items-center">
              <Tooltip title={description}>
                <span className="hover:underline flex items-center">
                  {truncateString(description, 80)}
                </span>
              </Tooltip>
            </div>
          )
        },
      },
      {
        header: 'DETALLES',
        accessorKey: 'details',
        cell: (cellProps) => {
          return (
            <div className="w-full text-start justify-start items-start ml-5">
              <Tooltip title="Editar">
                <span
                  className="cursor-pointer flex text-center justify-center items-center mt-1"
                  onClick={() => onShowDetails(cellProps.row.original)}
                >
                  <FaPen className="text-lg" />
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

export default IdeasTable
