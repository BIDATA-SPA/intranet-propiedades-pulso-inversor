import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Button, Dropdown, Select } from '@/components/ui'
import Input from '@/components/ui/Input'
import Table from '@/components/ui/Table'
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
import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Select as SelectType } from '@/@types/select'
import { useNavigate } from 'react-router'

import {
  HiArrowLeft,
  HiBookmark,
  HiOutlineBookmark,
  HiOutlineDotsVertical,
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineLink,
  HiOutlineSearch,
  HiOutlineTrash,
} from 'react-icons/hi'
import { useSearchParams } from 'react-router-dom'

import { ContentAssignService } from '../components/ContentDialog'
import ShowDialog from '../components/ShowDialogServices'

import { userCustomer, userOwner } from '../data/fakeData'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string
  onChange: (value: string) => void
  debounce?: number
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
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
        <Input
          {...props}
          value={value}
          size="sm"
          placeholder="Buscar empresa..."
          prefix={<HiOutlineSearch className="text-lg" />}
          className="lg:w-[33%] mb-0 md:mb-2 mobile:mb-2 sp:mb-2"
          onChange={(e) => setValue(e.target.value)}
        />

        <Button
          size="sm"
          className="xl:w-[10%] lg:w-[15%] md:w-full mobile:w-full sp:w-full mb-0 md:mb-2 text-xl"
          icon={<HiOutlineTrash />}
          // onClick={handleResetButtonClick}
        />
      </div>

      <Button
        size="sm"
        variant="solid"
        color="sky-500"
        icon={<HiArrowLeft />}
        onClick={() => navigate('/servicios-externos')}
      >
        Regresar
      </Button>
    </div>
  )
}

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const ServicesList = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)

  const [assignService, setAssignService] = useState<boolean>(false)
  const [saved, setSaved] = useState(false)

  const [dataOwner, isDataOwner] = useState(userOwner)
  const [dataCustomer, isDataCustomer] = useState(userCustomer)

  // const { data, isFetching } = useGetAllCustomersQuery(
  //   {
  //     page: currentPage || 1,
  //     limit: pageSize,
  //     ...(search && { search: search }),
  //   },

  //   { refetchOnMountOrArgChange: true }
  // )

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search && { search: search }),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search])

  const [isLoading, setIsLoading] = useState(true)

  const Toggle = (
    <HiOutlineDotsVertical className="cursor-pointer h-6 w-10  xl:h-5 xl:w-[30px]" />
  )

  const savedServices = () => {
    setSaved(!saved)
  }

  const openAssignService = useCallback(
    (setter: Dispatch<React.SetStateAction<boolean>>) => {
      setter(true)
    },
    []
  )

  const onAssignServiceClose = useCallback(
    (setter: Dispatch<React.SetStateAction<boolean>>) => {
      setter(false)
    },
    []
  )

  const onAssignServiceOk = useCallback(
    (setter: Dispatch<React.SetStateAction<boolean>>) => {
      setter(false)
    },
    []
  )

  const navigate = useNavigate()

  const { Tr, Th, Td, THead, TBody } = Table

  const columns = useMemo(
    () => [
      {
        header: 'Logo',
        accessorKey: 'LogoEmp',
      },
      {
        header: 'Nombre empresa',
        accessorKey: 'nameEmp',
        cell: (cellProps: any) => (
          <>
            {cellProps.row.original?.NameEmp
              ? cellProps.row.original?.NameEmp
              : 'Nombre de empresa' || 'Servicio de...'}
          </>
        ),
      },
      {
        header: 'Titular',
        accessorKey: 'TitularEmp',
        cell: (cellProps: any) => (
          <>
            {cellProps.row.original?.OwnEmpName
              ? cellProps.row.original.OwnEmpName
              : 'No Titular' || 'Roberto'}
          </>
        ),
      },
      {
        header: 'Descripción',
        cell: (cellProps: any) => (
          <>
            {cellProps.row.original.DescripEmp
              ? cellProps.row.original.DescripEmp
              : 'No Descripcion' || 'Servicio de...'}
          </>
        ),
      },
      {
        header: 'Email',
        cell: (cellProps: any) => (
          <>{cellProps.row.original?.OwnEmpEmail || 'No hay email'}</>
        ),
      },
      {
        header: 'Teléfono',
        cell: (cellProps: any) => (
          <>{cellProps.row.original?.OwnEmpPhone || 'No hay número'}</>
        ),
      },
      {
        header: 'Valor Servicio',
        cell: (cellProps: any) => (
          <>{cellProps.row.original?.Valor || 'No hay valor'}</>
        ),
      },
      {
        header: 'Clientes asignados',
        cell: (cellProps: any) => (
          <>{cellProps.row.original?.CustName || 'No hay asignados'}</>
        ),
      },
      {
        header: 'Acción',
        cell: () => (
          <div className="flex items-center ">
            <Dropdown
              renderTitle={Toggle}
              trigger="click"
              className="xl:absolute z-50"
              placement="bottom-center"
            >
              <Dropdown.Item
                eventKey="a"
                onClick={() => openAssignService(setAssignService)}
              >
                <HiOutlineLink /> Asignar servicio
              </Dropdown.Item>
              <Dropdown.Item variant="divider" />
              {saved ? (
                <Dropdown.Item eventKey="b" onClick={() => savedServices()}>
                  <HiOutlineBookmark />
                  Guardar
                </Dropdown.Item>
              ) : (
                <Dropdown.Item eventKey="b" onClick={() => savedServices()}>
                  <HiBookmark />
                  Olvidar
                </Dropdown.Item>
              )}
              <Dropdown.Item variant="divider" />
              <Dropdown.Item eventKey="c">
                <HiOutlineEye />
                Ver más
              </Dropdown.Item>
              <Dropdown.Item variant="divider" />
              <Dropdown.Item eventKey="c">
                <HiOutlineExclamationCircle />
                Informar error
              </Dropdown.Item>
            </Dropdown>
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: dataOwner,
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

  return (
    <div>
      <h3 className="mb-4">Listado Servicios externos</h3>
      <DebouncedInput
        value={search}
        placeholder="Buscar Cliente..."
        onChange={setSearch}
      />
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
        {!dataOwner ? (
          <TableRowSkeleton columns={9} rows={pageSize} />
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

      {/* Asssign servicio to customer type dialog */}
      <ShowDialog
        title="Asignación del servicio"
        isOpen={assignService}
        Content={<ContentAssignService />}
        closable={true}
        onClose={() => onAssignServiceClose(setAssignService)}
        onRequestClose={() => onAssignServiceOk(setAssignService)}
      />
    </div>
  )
}

export default ServicesList
