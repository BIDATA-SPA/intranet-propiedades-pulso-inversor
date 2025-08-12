/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import Table from '@/components/ui/Table'
import Tooltip from '@/components/ui/Tooltip'
import { useGetAllPropertiesSearchQuery } from '@/services/RtkQueryService'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'
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
import { FaCheck } from 'react-icons/fa'
import { ImHome } from 'react-icons/im'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import PaginationBottom from './PaginationBottom'

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const PropertiesTable = ({
  setCustomerSearchMatches,
  setCurrentProperty,
  onDrawerOpen,
}) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search] = useState(searchParams.get('search') || '')
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const { data: properties, isFetching } = useGetAllPropertiesSearchQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search }),
    },
    {
      refetchOnMountOrArgChange: true,
    }
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
        header: 'PROPIEDAD',
        accessorKey: 'propertyTitle',
        cell: (cellProps) => (
          <div className="flex items-center">
            <Tooltip title={cellProps.row.original?.propertyTitle}>
              <span className="font-bold">
                {truncateString(cellProps.row.original?.propertyTitle, 40) ||
                  '-'}
              </span>
            </Tooltip>
          </div>
        ),
      },
      {
        header: 'OPERACIÓN',
        accessorKey: 'operation',
        cell: (cellProps) => (
          <Tooltip title={cellProps.row.original?.propertyTitle}>
            <div className="flex items-center">
              <ImHome className="mr-1" />
              <span className="hover:underline">
                {`${cellProps.row.original?.typeOfOperationId} de ${cellProps.row.original?.typeOfPropertyId}`}
              </span>
            </div>
          </Tooltip>
        ),
      },
      {
        header: 'PRECIO',
        accessorKey: 'propertyPrice',
        cell: (cellProps) => (
          <div className="flex items-center">
            {formatCurrency(cellProps.row.original?.propertyPrice, {
              currency: 'CLP',
            }) || '-'}
          </div>
        ),
      },
      {
        header: 'UBICACIÓN',
        accessorKey: 'location',
        cell: (cellProps) => {
          return (
            <div className="flex items-center justify-start">
              <span>
                <Tooltip
                  title={`${
                    cellProps.row.original?.address?.city?.name
                      ? cellProps.row.original?.address?.city?.name
                      : ''
                  }${
                    cellProps.row.original?.address?.state?.name
                      ? `, ${cellProps.row.original?.address?.state?.name}`
                      : ''
                  }${
                    cellProps.row.original?.address?.country?.name
                      ? `, ${cellProps.row.original?.address?.country?.name}`
                      : ''
                  }`}
                >
                  {truncateString(
                    `${
                      cellProps.row.original?.address?.city?.name
                        ? cellProps.row.original?.address?.city?.name
                        : ''
                    }${
                      cellProps.row.original?.address?.state?.name
                        ? `, ${cellProps.row.original?.address?.state?.name}`
                        : ''
                    }${
                      cellProps.row.original?.address?.country?.name
                        ? `, ${cellProps.row.original?.address?.country?.name}`
                        : ''
                    }`,
                    40
                  )}
                </Tooltip>
              </span>
            </div>
          )
        },
      },
      {
        header: 'ÚLTIMA ACTUALIZACIÓN',
        accessorKey: 'updatedAt',
        cell: (cellProps) => (
          <>{formatDate(cellProps.row.original?.updatedAt) || new Date()}</>
        ),
      },

      {
        header: 'MATCH CLIENTES',
        accessorKey: 'similarCustomers',
        cell: (cellProps: any) => (
          <div
            className="cursor-pointer flex items-center justify-center"
            onClick={() => {
              onDrawerOpen()
              setCurrentProperty(cellProps.row.original)
              setCustomerSearchMatches(
                cellProps.row.original?.customer_search_matches
              )
            }}
          >
            {cellProps.row.original?.customer_search_matches?.length > 0 ? (
              <Tooltip
                title={`${
                  cellProps.row.original?.customer_search_matches?.length > 1
                    ? `Ver ${cellProps.row.original?.customer_search_matches.length} Clientes buscando propiedades similares`
                    : `Ver ${cellProps.row.original?.customer_search_matches.length} Cliente buscando propiedad similar`
                }`}
              >
                <span className="text-green-500 flex items-center text-[18px] font-semibold ml-10 bg-green-500/10 hover:bg-green-400/20 p-2.5 rounded-full">
                  {cellProps.row.original?.customer_search_matches?.length}
                  <FaCheck className="ml-1" />
                </span>
              </Tooltip>
            ) : (
              0
            )}
          </div>
        ),
      },
    ],
    [navigate]
  )

  const table = useReactTable({
    data: properties?.data,
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
          currentPage={+properties?.meta?.page}
          total={properties?.meta?.totalItems}
          pageSize={pageSize}
          onChange={onPaginationChange}
          onPageSelect={onPageSelect}
        />
      </div>
    </>
  )
}

export default PropertiesTable
