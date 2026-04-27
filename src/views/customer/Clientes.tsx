import type { InputHTMLAttributes } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import type { Select as SelectType } from '@/@types/select'
import TableRowSkeleton from '@/components/shared/loaders/TableRowSkeleton'
import { Tooltip } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Spinner from '@/components/ui/Spinner'
import Table from '@/components/ui/Table'

import { useGetAllCustomersQuery } from '@/services/RtkQueryService'

import classNames from 'classnames'
import { FaUser } from 'react-icons/fa'
import { FaUserCheck, FaUsers } from 'react-icons/fa6'
import {
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiViewList,
} from 'react-icons/hi'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { IoMdEye } from 'react-icons/io'

import {
  DEFAULT_TAILWIND_COLORS,
  getRandomBackgroundColor,
} from '@/utils/randomColor'

const { Tr, Th, Td, THead, TBody } = Table

type ViewMode = 'table' | 'cards'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string
  onChange: (value: string) => void
  debounce?: number
  toggleViewMode: () => void
  viewMode: ViewMode
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  toggleViewMode,
  viewMode,
  ...props
}: DebouncedInputProps) {
  const [value, setValue] = useState(initialValue)
  const navigate = useNavigate()

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  const handleReset = () => {
    setValue('')
    onChange('')
  }

  return (
    <div className="sm:flex sm:justify-between lg:items-center">
      <div className="xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4 lg:flex lg:items-center lg:justify-start lg:w-[65%] xl:max-w-[600px] xl:gap-4 lg:gap-4">
        <Input
          {...props}
          value={value}
          size="sm"
          placeholder="Buscar cliente..."
          prefix={<HiOutlineSearch className="text-lg" />}
          className="lg:w-[33%] mb-0 md:mb-2 mobile:mb-2 sp:mb-2"
          onChange={(event) => setValue(event.target.value)}
        />

        <Button
          size="sm"
          className="xl:w-[10%] lg:w-[15%] md:w-full mobile:w-full sp:w-full mb-0 md:mb-2 text-xl"
          icon={<HiOutlineTrash />}
          onClick={handleReset}
        />
      </div>

      <div className="flex gap-2">
        <Tooltip title={viewMode === 'table' ? 'Grilla' : 'Lista'}>
          <Button
            size="sm"
            icon={
              viewMode === 'table' ? (
                <HiOutlineSquares2X2 className="w-5 h-5" />
              ) : (
                <HiViewList className="w-5 h-5" />
              )
            }
            className="sm:w-[40px] h-[38px] flex justify-center items-center"
            color="lime-500"
            onClick={toggleViewMode}
          />
        </Tooltip>

        <Button
          variant="solid"
          size="sm"
          color="lime-500"
          className="w-full md:h-[25%] sm:h-[80%] sm:w-[160px] xl:mb-4 md:mb-4 lg:mb-4 mobile:mb-4 sp:mb-4"
          icon={<HiOutlineUserAdd />}
          onClick={() => navigate('/clientes/crear')}
        >
          Crear cliente
        </Button>
      </div>
    </div>
  )
}

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

type Customer = {
  id: number | string
  name?: string
  lastName?: string
  alias?: string
  rut?: string
  email?: string
  phone?: string
  image?: string
  hasBadReputation?: boolean
  dialCode?: {
    dialCode?: string
  }
  address?: {
    country?: {
      name?: string
    }
    internalDbCity?: {
      name?: string
    }
  }
}

type CustomersResponse = {
  data?: Customer[]
  meta?: {
    page?: number
    limit?: number
    totalItems?: number
    totalPages?: number
    activeCustomers?: number
    newCustomers?: number
    previousPageUrl?: string | null
    nextPageUrl?: string | null
  }
}

const safeArray = <T,>(value: unknown): T[] =>
  Array.isArray(value) ? (value as T[]) : []

const getErrorMessage = (error: unknown): string => {
  if (!error) return 'No fue posible cargar la información.'

  if (typeof error === 'string') return error

  if (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'message' in error.data
  ) {
    return String(error.data.message)
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message)
  }

  return 'Ha ocurrido un error al obtener la información.'
}

const Clientes = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get('page')) || 1
  )
  const [pageSize, setPageSize] = useState<number>(
    Number(searchParams.get('limit')) || Number(pageSizeOption[0].value)
  )
  const [viewMode, setViewMode] = useState<ViewMode>('table')

  const queryParams = useMemo(
    () => ({
      page: currentPage || 1,
      limit: pageSize,
      ...(search ? { search } : {}),
    }),
    [currentPage, pageSize, search]
  )

  const { data, isFetching, isLoading, isError, error, refetch } =
    useGetAllCustomersQuery(queryParams, {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    })

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    const queryParams = new URLSearchParams({
      limit: String(pageSize),
      page: String(currentPage),
      ...(search ? { search } : {}),
    })

    setSearchParams(queryParams)
  }, [pageSize, currentPage, search, setSearchParams])

  const customers = useMemo(
    () => safeArray<Customer>((data as CustomersResponse)?.data),
    [data]
  )

  const apiMeta = (data as CustomersResponse)?.meta

  const totalCustomers = Number(apiMeta?.totalItems ?? customers.length)

  const totalActiveCustomers = Number(
    apiMeta?.activeCustomers ??
      customers.filter((customer) => !customer.hasBadReputation).length
  )

  const customerErrorMessage = getErrorMessage(error)

  const shouldShowInitialLoading = isLoading && !data
  const shouldShowTableSkeleton = isFetching
  const shouldShowCustomers = !isFetching && !isError

  const onPaginationChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const onPageSelect = useCallback((selected: SelectType | null) => {
    const next = Number(selected?.value ?? pageSizeOption[0].value)

    setPageSize(next)
    setCurrentPage(1)
  }, [])

  const toggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'table' ? 'cards' : 'table'))
  }, [])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }, [])

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  if (shouldShowInitialLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner className="mr-4" size="40px" />
      </div>
    )
  }

  if (isError && !data) {
    return (
      <div className="w-full min-h-[360px] flex justify-center items-center">
        <Alert
          showIcon
          type="danger"
          title="No fue posible cargar los clientes"
          className="w-full max-w-2xl"
        >
          <div className="flex flex-col gap-3">
            <span>{customerErrorMessage}</span>

            <Button size="sm" className="w-fit" onClick={handleRetry}>
              Reintentar
            </Button>
          </div>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4">Clientes</h3>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-6">
        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-gray-500 rounded items-center justify-center flex">
              <FaUsers className="text-2xl text-white" />
            </span>

            <div>
              <span className="dark:text-white">Total de Clientes</span>

              {isFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{totalCustomers}</h3>
              )}
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-green-500 rounded items-center justify-center flex">
              <FaUserCheck className="text-2xl text-white" />
            </span>

            <div>
              <span className="dark:text-white">Total de Clientes Activos</span>

              {isFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{totalActiveCustomers}</h3>
              )}
            </div>
          </div>
        </Card>
      </div>

      <DebouncedInput
        value={search}
        placeholder="Buscar Cliente..."
        toggleViewMode={toggleViewMode}
        viewMode={viewMode}
        onChange={handleSearchChange}
      />

      {isError && data && (
        <Alert
          showIcon
          type="warning"
          title="No se pudo actualizar la lista de clientes"
          className="mb-4"
        >
          <div className="flex flex-col gap-3">
            <span>{customerErrorMessage}</span>

            <Button size="sm" className="w-fit" onClick={handleRetry}>
              Reintentar
            </Button>
          </div>
        </Alert>
      )}

      {viewMode === 'table' ? (
        <Table>
          <THead>
            <Tr>
              <Th>Cliente</Th>
              <Th>Alias</Th>
              <Th>Teléfono/Celular</Th>
              <Th>Correo</Th>
              <Th>Ubicación</Th>
              <Th>Acciones</Th>
            </Tr>
          </THead>

          {shouldShowTableSkeleton ? (
            <TableRowSkeleton columns={6} rows={pageSize} />
          ) : (
            <TBody className="dark:text-white/90 dark:font-semibold">
              {shouldShowCustomers &&
                customers.map((customer) => (
                  <Tr key={String(customer.id)}>
                    <Td>
                      <div className="flex items-center">
                        <span
                          className="font-bold cursor-pointer hover:text-lime-500 transition-colors duration-200"
                          onClick={() => navigate(`/clientes/${customer.id}`)}
                        >
                          {`${customer.name || ''} ${
                            customer.lastName || ''
                          }`.trim()}{' '}
                          {customer.alias ? (
                            <small>({customer.alias})</small>
                          ) : null}
                        </span>
                      </div>
                    </Td>

                    <Td>{customer.alias || '-'}</Td>

                    <Td>
                      {customer.dialCode?.dialCode
                        ? `(${customer.dialCode.dialCode}) `
                        : ''}
                      {customer.phone || '-'}
                    </Td>

                    <Td>{customer.email || '-'}</Td>

                    <Td>
                      {customer.address?.country?.name || '-'}
                      {customer.address?.internalDbCity?.name
                        ? `, ${customer.address.internalDbCity.name}`
                        : ''}
                    </Td>

                    <Td>
                      <div className="w-full flex gap-4">
                        <Tooltip title="Ver detalles">
                          <span
                            className="font-bold cursor-pointer hover:text-lime-500 transition-colors duration-200"
                            onClick={() => navigate(`/clientes/${customer.id}`)}
                          >
                            <IoMdEye className="text-xl" />
                          </span>
                        </Tooltip>
                      </div>
                    </Td>
                  </Tr>
                ))}

              {shouldShowCustomers && !customers.length && (
                <Tr>
                  <Td colSpan={6}>
                    <div className="py-8 text-center text-sm text-gray-500">
                      No se encontraron clientes.
                    </div>
                  </Td>
                </Tr>
              )}
            </TBody>
          )}
        </Table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shouldShowTableSkeleton ? (
            <div className="col-span-full py-10 flex justify-center">
              <Spinner size={32} />
            </div>
          ) : (
            <>
              {shouldShowCustomers &&
                customers.map((customer) => {
                  const randomColor = getRandomBackgroundColor({
                    colors: DEFAULT_TAILWIND_COLORS,
                  })

                  return (
                    <Card
                      key={String(customer.id)}
                      className="rounded-lg relative border bg-white dark:bg-gray-500 dark:border-gray-600 w-full hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col mx-auto shadow-sm overflow-hidden"
                    >
                      <div
                        className={classNames(
                          randomColor,
                          'h-16 w-full opacity-80 absolute top-0 left-0 right-0 z-0 rounded-t-lg'
                        )}
                      />

                      <div className="w-full flex m-2 ml-3 text-white relative z-10">
                        <div className="w-12 h-12 p-2 bg-white dark:bg-gray-500 rounded-full flex items-center justify-center">
                          {customer.image ? (
                            <img
                              className="w-12 h-12 rounded-full object-cover"
                              src={customer.image}
                              alt="Customer"
                            />
                          ) : (
                            <FaUser className="w-10 h-10 text-gray-600 dark:text-gray-200" />
                          )}
                        </div>

                        <div className="title mt-2 ml-2 font-bold flex flex-col">
                          <div className="break-words text-white">
                            <p className="text-sm">
                              {`${customer.name || ''} ${
                                customer.lastName || ''
                              }`.trim()}{' '}
                              {customer.alias ? (
                                <small>({customer.alias})</small>
                              ) : null}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col p-3 mt-2 border-t border-gray-200 dark:border-gray-600 flex-grow">
                        <p className="text-xs mb-1">
                          <span className="font-semibold">RUT:</span>{' '}
                          {customer.rut || '-'}
                        </p>

                        <p className="text-xs mb-1">
                          <span className="font-semibold">
                            Teléfono/Celular:
                          </span>{' '}
                          {customer.dialCode?.dialCode
                            ? `(${customer.dialCode.dialCode}) `
                            : ''}
                          {customer.phone || '-'}
                        </p>

                        <p className="text-xs mb-1">
                          <span className="font-semibold">Correo:</span>{' '}
                          {customer.email || '-'}
                        </p>

                        <p className="text-xs mb-1">
                          <span className="font-semibold">Ubicación:</span>{' '}
                          {customer.address?.country?.name || '-'}
                          {customer.address?.internalDbCity?.name
                            ? `, ${customer.address.internalDbCity.name}`
                            : ''}
                        </p>

                        <div className="flex flex-col mt-4 p-4 dark:bg-gray-700 rounded-b-lg border-t border-gray-300 dark:border-gray-600">
                          <div className="flex gap-4 w-full">
                            <Tooltip title="Ver detalles">
                              <span
                                className="font-bold cursor-pointer hover:text-lime-500 transition-colors duration-200"
                                onClick={() =>
                                  navigate(`/clientes/${customer.id}`)
                                }
                              >
                                <IoMdEye className="text-xl" />
                              </span>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )
                })}

              {shouldShowCustomers && !customers.length && (
                <div className="col-span-full py-10 text-center text-sm text-gray-500">
                  No se encontraron clientes.
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex items-center mt-5">
        <Pagination
          currentPage={Number(apiMeta?.page || currentPage)}
          total={Number(apiMeta?.totalItems || 0)}
          pageSize={pageSize}
          onChange={onPaginationChange}
        />

        <div style={{ minWidth: 120 }}>
          <Select
            size="sm"
            isSearchable={false}
            value={
              pageSizeOption.find(
                (option) => Number(option.value) === Number(pageSize)
              ) || pageSizeOption[0]
            }
            options={pageSizeOption}
            onChange={(selected) => onPageSelect(selected as SelectType)}
          />
        </div>
      </div>

      {isFetching && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
          <Spinner size={14} /> Actualizando...
        </div>
      )}
    </div>
  )
}

export default Clientes
