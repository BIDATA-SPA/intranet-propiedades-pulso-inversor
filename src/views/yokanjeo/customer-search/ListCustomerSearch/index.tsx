import { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Button, Drawer, Select } from '@/components/ui'
import Pagination from '@/components/ui/Pagination'
import Table from '@/components/ui/Table'
import Tooltip from '@/components/ui/Tooltip'
import {
  useGetAllCustomersSearchQuery,
  useGetCustomerSearchMetadataQuery,
} from '@/services/RtkQueryService'
import { formatCurrency, formatThousands } from '@/utils/formatCurrency'
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
import type { InputHTMLAttributes } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  FaBath,
  FaBed,
  FaCheck,
  FaHouseCircleCheck,
  FaPersonSwimming,
} from 'react-icons/fa6'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import CustomerSearchMeta from '../components/CustomerSearchMeta'
import DrawerContent from './components/DrawerContent'
import { HiViewList } from 'react-icons/hi'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { RiMapPinFill } from 'react-icons/ri'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string
  onChange: (value: string) => void
  debounce?: number
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
}: DebouncedInputProps) {
  const navigate = useNavigate()
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <div className="sm:flex sm:justify-between lg:items-center">
      <div className="xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4 lg:flex lg:items-center lg:justify-start lg:w-[65%] xl:max-w-[600px] xl:gap-4 lg:gap-4">
        {/* FILTROS DE BUSQUEDA: TIPO DE OPERACION, TIPO DE PROPIEDAD, CARACTERISTICAS */}
      </div>
    </div>
  )
}

const ListCustomerSearch = () => {
  const navigate = useNavigate()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value || 5)
  const { data, isFetching } = useGetAllCustomersSearchQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search }),
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const {
    data: metaData,
    isLoading: metaDataIsLoading,
    isError: metaDataIsError,
    error: metadataError,
  } = useGetCustomerSearchMetadataQuery()

  const [isOpen, setIsOpen] = useState(false)
  const [selectedMatches, setSelectedMatches] = useState([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const openDrawer = () => {
    setIsOpen(true)
  }

  const onDrawerClose = () => {
    setSelectedMatches([])
    setIsOpen(false)
  }

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search && { search: search }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search])

  const columns = useMemo(
    () => [
      {
        header: 'Corredor',
        accessorKey: 'realtor',
        cell: (cellProps: any) => (
          <div className="flex items-center">
            <span
              className="font-bold cursor-pointer hover:text-sky-500 transition-colors duration-200"
              onClick={() => {
                navigate(
                  `/procanje/buzon-de-clientes/${cellProps.row.original?.id}`
                )
              }}
            >
              {`${cellProps.row.original?.createdByUser?.name} ${cellProps.row.original?.createdByUser?.lastName}`}
            </span>
          </div>
        ),
      },
      {
        header: 'Tipo de Operación',
        cell: (cellProps: any) => (
          <>{cellProps.row.original?.typeOfOperationId || 'N/A'}</>
        ),
      },
      {
        header: 'Tipo de Propiedad',
        cell: (cellProps: any) => (
          <>{cellProps.row.original?.typeOfPropertyId || 'N/A'}</>
        ),
      },
      {
        header: 'Rango de Precio',
        cell: (cellProps: any) => (
          <>
            {cellProps.row.original.currencyId === 'CLP'
              ? `${formatCurrency(cellProps.row.original.minPrice, {
                  currency: 'CLP',
                })} - ${formatCurrency(cellProps.row.original.maxPrice, {
                  currency: 'CLP',
                })}`
              : cellProps.row.original.currencyId === 'UF'
              ? `${formatThousands(
                  cellProps.row.original.minPrice
                )} UF - ${formatThousands(cellProps.row.original.maxPrice)} UF`
              : 'N/A'}
          </>
        ),
      },
      {
        header: 'Características',
        cell: (cellProps: any) => (
          <div className="flex items-center justify-around">
            <span className="flex items-center gap-2">
              <FaBed className="text-lg" />
              {cellProps.row.original?.bedrooms || 'N/A'}
            </span>

            <span className="flex items-center gap-2">
              <FaBath className="text-lg" />
              {cellProps.row.original?.bathrooms || 'N/A'}
            </span>

            <span className="flex items-center gap-2">
              <FaPersonSwimming className="text-xl" />
              {cellProps.row.original?.hasSwimmingPool
                ? 'Sí' || 'N/A'
                : 'No' || 'N/A'}
            </span>
          </div>
        ),
      },
      {
        header: 'Ubicación',
        cell: (cellProps: any) => (
          <>
            {truncateString(
              `${
                cellProps.row.original?.city?.name
                  ? cellProps.row.original?.city?.name
                  : ''
              }${
                cellProps.row.original?.state?.name
                  ? `, ${cellProps.row.original?.state?.name}`
                  : ''
              }${
                cellProps.row.original?.country?.name
                  ? `, ${cellProps.row.original?.country?.name}`
                  : ''
              }`,
              40
            )}
          </>
        ),
      },
      {
        header: 'Última actualización',
        cell: (cellProps: any) => (
          <>{formatDate(cellProps.row.original.customer?.updatedAt)}</>
        ),
      },
      {
        header: 'MATCH PROPIEDADES',
        cell: (cellProps: any) => (
          <div
            className="cursor-pointer"
            onClick={() => {
              setSelectedMatches(cellProps.row.original?.customerSearchMatches)
              openDrawer()
            }}
          >
            {cellProps.row.original?.customerSearchMatches &&
            cellProps.row.original?.customerSearchMatches.length > 0 ? (
              <Tooltip
                title={`${
                  cellProps.row.original?.customerSearchMatches.length > 1
                    ? `Ver ${cellProps.row.original?.customerSearchMatches.length} Propiedades similares`
                    : `Ver ${cellProps.row.original?.customerSearchMatches.length} Propiedad similar`
                }`}
              >
                <span className="text-green-500 flex items-center text-[18px] font-semibold ml-10 bg-green-500/10 hover:bg-green-400/20 p-2.5 rounded-full">
                  {cellProps.row.original?.customerSearchMatches.length}
                  <FaCheck className="ml-1 font-normal" />
                </span>
              </Tooltip>
            ) : (
              0
            )}
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: data?.data,
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

  const onPaginationChange = (page: number) => {
    table.setPageIndex(page - 1)
    setCurrentPage(page)
  }

  const onPageSelect = ({ value }: SelectType) => {
    setPageSize(value)
    table.setPageSize(Number(value))
  }

  // Get all images
  const extractImagePaths = (data): string[] => {
    const paths = data.map((item) => {
      if (!item.property.images || item.property.images.length === 0) {
        return []
      }
      return item.property.images.map((image) => image)
    })
    const flattenedPaths = paths.filter((item) => item.length > 0).flat()
    return flattenedPaths
  }

  const images = extractImagePaths(selectedMatches)

  return (
    <div>
      <h3 className="mb-4">Buzón de Clientes</h3>
      <CustomerSearchMeta
        isLoading={metaDataIsLoading}
        isError={metaDataIsError}
        errorMessage={metadataError}
        totalItems={metaData?.customerSearch}
        approvedItems={metaData?.customerSearchApproved}
        rejectedItem={metaData?.customerSearchRejected}
        pendingItem={metaData?.customerSearchPending}
      />
      <>
        <DebouncedInput
          value={search}
          placeholder="Buscar Cliente..."
          onChange={setSearch}
        />

        <div className="flex items-center gap-2 mt-4 ml-auto mb-6 justify-end">
          <Tooltip title={viewMode === 'table' ? 'Grilla' : 'Lista'}>
            <Button
              size="sm"
              icon={
                viewMode === 'table' ? (
                  <HiOutlineSquares2X2 className="w-5 h-8" />
                ) : (
                  <HiViewList className="w-5 h-8" />
                )
              }
              className="sm:w-[40px]"
              color="sky-500"
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
            />
          </Tooltip>

          <Button
            variant="solid"
            size="sm"
            color="sky-500"
            className="w-full sm:w-[160px]"
            icon={<FaHouseCircleCheck />}
            onClick={() => {
              navigate('/procanje/buzon-de-clientes/crear')
            }}
          >
            Crear oportunidad
          </Button>
        </div>

        {viewMode === 'table' ? (
          <Table>
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
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
                  ))}
                </Tr>
              ))}
            </THead>
            {isFetching ? (
              <TableRowSkeleton columns={5} rows={pageSize} />
            ) : (
              <TBody className="dark:text-white/90 dark:font-semibold">
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </TBody>
            )}
          </Table>
        ) : (
          // Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data?.data?.map((row) => {
              const address = `${row.city?.name || ''}, ${row.state?.name || ''}, ${row.country?.name || ''}`;

              return (
                <div
                  key={row.id}
                  className="relative w-full border dark:border-gray-700 rounded-lg shadow-md hover:shadow-lg transition-transform transform duration-300 ease-in-out hover:-translate-y-1"
                >
                  <div className="relative flex justify-center h-40 overflow-hidden border-b rounded-t-lg bg-gray-200 dark:bg-gray-700">
                    <img
                      src="/img/not-found/not-found-image.png" 
                      alt="Cliente"
                      className="absolute hover:cursor-pointer inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-110"
                    />
                  </div>

                  <div className="p-4">
                    <h5 className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                      {row.typeOfOperationId} de {row.typeOfPropertyId}
                    </h5>

                    <div className="flex items-center mt-1">
                      <RiMapPinFill className="text-red-500 text-sm" />
                      <Tooltip title={address}>
                        <p className="text-sm ml-1 text-gray-400 dark:text-gray-400 font-semibold">
                          {truncateString(address, 50)}
                        </p>
                      </Tooltip>
                    </div>

                    <div className="mt-2">
                      <small className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        Rango de Precio
                      </small>
                      <p className="text-primary font-semibold text-lg lg:text-xl text-gray-700 dark:text-white">
                        {row.currencyId === 'CLP'
                          ? `${formatCurrency(row.minPrice, { currency: 'CLP' })} - ${formatCurrency(row.maxPrice, { currency: 'CLP' })}`
                          : row.currencyId === 'UF'
                          ? `${formatThousands(row.minPrice)} UF - ${formatThousands(row.maxPrice)} UF`
                          : 'N/A'}
                      </p>
                    </div>

                    <Tooltip title={`${row.createdByUser?.name} ${row.createdByUser?.lastName}`}>
                      <h3 className="break-words font-medium text-base mt-2 text-gray-600 dark:text-white">
                        {`${row.createdByUser?.name} ${row.createdByUser?.lastName}`}
                      </h3>
                    </Tooltip>
                  </div>

                  <div className="p-4 border-t dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                    <div className="text-xs text-gray-500 dark:text-white/60">
                      Última actualización: {formatDate(row.customer?.updatedAt)}
                    </div>
                    {row.customerSearchMatches && row.customerSearchMatches.length > 0 ? (
                      <Tooltip
                        title={`${
                          row.customerSearchMatches.length > 1
                            ? `Ver ${row.customerSearchMatches.length} Propiedades similares`
                            : `Ver ${row.customerSearchMatches.length} Propiedad similar`
                        }`}
                      >
                        <div
                          className="text-green-500 flex items-center text-sm font-semibold bg-green-500/10 hover:bg-green-400/20 p-2 rounded-lg cursor-pointer"
                          onClick={() => {
                            setSelectedMatches(row.customerSearchMatches);
                            openDrawer();
                          }}
                        >
                          {row.customerSearchMatches.length}
                          <FaCheck className="ml-1" />
                        </div>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400 text-sm">Sin coincidencias</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center mt-5">
          <Pagination
            currentPage={currentPage || 1}
            total={data?.meta?.totalItems}
            pageSize={pageSize}
            onChange={onPaginationChange}
          />
          <div style={{ minWidth: 120 }}>
            <Select
              size="sm"
              isSearchable={false}
              defaultValue={pageSizeOption[0]}
              options={pageSizeOption}
              onChange={(selected) => onPageSelect(selected as SelectType)}
            />
          </div>
        </div>
      </>

      <Drawer
        title={
          selectedMatches?.length === 0
            ? 'Sin resultados'
            : `Match de Propiedades encontradas (${selectedMatches.length})`
        }
        isOpen={isOpen}
        headerClass="!items-start !bg-gray-100 dark:!bg-gray-700"
        footerClass="!border-t-0 !p-3"
        placement="right"
        width={480}
        onClose={onDrawerClose}
        onRequestClose={onDrawerClose}
      >
        <DrawerContent data={selectedMatches} images={images} />
      </Drawer>
    </div>
  );
};

export default ListCustomerSearch;