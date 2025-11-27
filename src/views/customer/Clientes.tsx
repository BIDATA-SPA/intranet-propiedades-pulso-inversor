/* eslint-disable react-hooks/exhaustive-deps */
import { Select as SelectType } from '@/@types/select'
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
import {
  useCreateRatingUserSendMailMutation,
  useGetAllCustomersQuery,
  useGetDashboardQuery,
  useGetMyInfoQuery,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
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
import cloneDeep from 'lodash/cloneDeep'
import type { InputHTMLAttributes } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { FaUserCheck, FaUserPlus, FaUsers } from 'react-icons/fa6'
import {
  HiOutlineSearch,
  HiOutlineTrash,
  HiOutlineUserAdd,
  HiViewList,
} from 'react-icons/hi'
import { IoMdEye } from 'react-icons/io'
import { TbChecklist } from 'react-icons/tb'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

import { useCopyToClipboard } from '@/utils/hooks/useCopyToClipboard'
import {
  DEFAULT_TAILWIND_COLORS,
  getRandomBackgroundColor,
} from '@/utils/randomColor'
import classNames from 'classnames'
import { FaUserAlt } from 'react-icons/fa'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'

interface DebouncedInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size' | 'prefix'
  > {
  value: string
  onChange: (value: string) => void
  debounce?: number
  toggleViewMode: () => void
  viewMode: 'table' | 'cards'
}

const { Tr, Th, Td, THead, TBody } = Table

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

  const handleResetButtonClick = () => {
    setValue('')
  }

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
          placeholder="Buscar cliente..."
          prefix={<HiOutlineSearch className="text-lg" />}
          className="lg:w-[33%] mb-0 md:mb-2 mobile:mb-2 sp:mb-2"
          onChange={(e) => setValue(e.target.value)}
        />

        <Button
          size="sm"
          className="xl:w-[10%] lg:w-[15%] md:w-full mobile:w-full sp:w-full mb-0 md:mb-2 text-xl"
          icon={<HiOutlineTrash />}
          onClick={handleResetButtonClick}
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
          onClick={() => {
            navigate('/clientes/crear')
          }}
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

const Clientes = () => {
  const navigate = useNavigate()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const { data: me } = useGetMyInfoQuery()

  const { showNotification } = useNotification()
  const [
    createRatingUserSendMail,
    { isError: isErrorEmail, isSuccess: isSuccessEmail },
  ] = useCreateRatingUserSendMailMutation()

  const { copyToClipboard } = useCopyToClipboard()

  const { data, isFetching, isLoading, isError, error, refetch } =
    useGetAllCustomersQuery(
      {
        page: currentPage || 1,
        limit: pageSize,
        ...(search && { search: search }),
      },
      { refetchOnMountOrArgChange: true }
    )

  const { data: meta, isFetching: isMetaFetching } = useGetDashboardQuery(
    null,
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const userId = me?.id

  const onClickCopyReviewProfile = (userId: string) => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin.replace(/\/$/, '')
        : 'https://procanje.app'

    const url = `${origin}/califica-a-tu-corredor/${userId}`

    copyToClipboard(url)
    showNotification(
      'success',
      'Enlace copiado',
      'Comparte este enlace a tu cliente para calificar tu perfil'
    )
  }

  // Sent Rating form to customer
  const handleSendRatingForm = async (formData) => {
    const {
      id: customerId,
      createdByUser: { id: userId },
      email,
    } = cloneDeep(formData)

    const urlCalificacion = `${location.origin.replace(
      /\/$/,
      ''
    )}/calificar-corredor/${userId}/${customerId}`

    const data = {
      mail: email || '',
      cc: [''],
      subject: 'Calificar corredor - Procanje',
      link: urlCalificacion,
    }

    await createRatingUserSendMail(data)
  }

  useEffect(() => {
    if (isSuccessEmail) {
      showNotification(
        'success',
        'Éxito',
        'Formulario de encuesta enviado exitosamente'
      )
    }
  }, [isSuccessEmail])

  useEffect(() => {
    if (isErrorEmail) {
      showNotification(
        'danger',
        'Error',
        'Error al enviar la encuesta, inténtalo más tarde'
      )
    }
  }, [isErrorEmail])

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
        header: 'Cliente',
        accessorKey: 'customer',
        cell: (cellProps: any) => {
          return (
            <div className="flex items-center">
              <span
                className="font-bold cursor-pointer hover:text-lime-500 transition-colors duration-200"
                onClick={() => {
                  navigate(`/clientes/${cellProps.row.original.id}`)
                }}
              >
                {cellProps.row.original.name} {cellProps.row.original.lastName}{' '}
                {cellProps.row.original?.alias && (
                  <small>({cellProps.row.original?.alias})</small>
                )}
              </span>
            </div>
          )
        },
      },
      {
        header: 'alias',
        cell: (cellProps: any) => <>{cellProps.row.original.alias || '-'}</>,
      },
      {
        header: 'Teléfono/Celular',
        cell: (cellProps: any) => (
          <>
            {`${
              cellProps.row.original.dialCode?.dialCode
                ? `(${cellProps.row.original.dialCode?.dialCode})`
                : ''
            }`}{' '}
            {cellProps.row.original.phone || ''}
          </>
        ),
      },
      {
        header: 'Correo',
        cell: (cellProps: any) => <>{cellProps.row.original.email || '-'}</>,
      },
      {
        header: 'Ubicación',
        cell: (cellProps: any) => {
          const { address } = cellProps.row.original

          return (
            <p>
              {address?.country?.name}
              {`, ${address?.internalDbCity?.name}`}
            </p>
          )
        },
      },
      {
        header: 'Acciones',
        accessorKey: 'details',
        cell: (cellProps) => {
          return (
            <div className="w-100 flex gap-4">
              <Tooltip title="Ver detalles">
                <span
                  className="font-bold cursor-pointer hover:text-lime-500 transition-colors duration-200"
                  onClick={() => {
                    navigate(`/clientes/${cellProps.row.original.id}`)
                  }}
                >
                  <IoMdEye className="text-xl" />
                </span>
              </Tooltip>
            </div>
          )
        },
      },
    ],
    [navigate, userId, showNotification]
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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'cards' : 'table')
  }

  if (isLoading)
    return (
      <div className="w-100 h-screen flex justify-center items-center">
        <Spinner className="mr-4" size="40px" />
      </div>
    )

  if (isError) {
    return (
      <div className="w-100 h-100 flex justify-center items-center">
        <Alert
          showIcon
          type="warning"
          title={`${error?.message}` || 'Error de servidor'}
          className="w-screen flex justify-start items-start"
        >
          <span
            role="button"
            className="hover:underline"
            onClick={() => refetch()}
          >
            Reintentar
          </span>
        </Alert>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4">Clientes</h3>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-gray-500 rounded items-center justify-center flex">
              <FaUsers className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Total de Clientes</span>
              {isMetaFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{meta?.personalInfo?.activeCustomers || 0}</h3>
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
              {isMetaFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{meta?.personalInfo?.activeCustomers || 0}</h3>
              )}
            </div>
          </div>
        </Card>

        <Card className="shadow-sm">
          <div className="flex items-center gap-4">
            <span className="w-14 h-14 text-2xl bg-yellow-500 rounded items-center justify-center flex">
              <FaUserPlus className="text-2xl text-white" />
            </span>
            <div>
              <span className="dark:text-white">Total de Nuevos Clientes</span>
              {isMetaFetching ? (
                <Spinner size={30} className="mt-1" />
              ) : (
                <h3>{meta?.personalInfo?.newCustomers || 0}</h3>
              )}
            </div>
          </div>
        </Card>
      </div>

      <>
        <DebouncedInput
          value={search}
          placeholder="Buscar Cliente..."
          toggleViewMode={toggleViewMode}
          viewMode={viewMode}
          onChange={setSearch}
        />

        {viewMode === 'table' ? (
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
              <TableRowSkeleton columns={5} rows={pageSize} />
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data?.map((customer) => {
              const randomColor = getRandomBackgroundColor({
                colors: DEFAULT_TAILWIND_COLORS,
              })

              return (
                <Card
                  key={customer.id}
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
                        <FaUserAlt className="w-10 h-10 text-gray-600 dark:text-gray-200" />
                      )}
                    </div>
                    <div className="title mt-2 ml-2 font-bold flex flex-col">
                      <div className="break-words text-white">
                        <p className="text-sm">
                          {customer.name} {customer.lastName}{' '}
                          {customer?.alias && (
                            <small>({customer?.alias})</small>
                          )}
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
                      <span className="font-semibold">Teléfono/Celular:</span>{' '}
                      {`${
                        customer.dialCode?.dialCode
                          ? `(${customer.dialCode?.dialCode})`
                          : ''
                      } `}
                      {customer.phone || ''}
                    </p>
                    <p className="text-xs mb-">
                      <span className="font-semibold">Correo:</span>{' '}
                      {customer.email || '-'}
                    </p>
                    <p className="text-xs mb-1">
                      <span className="font-semibold">Ubicación:</span>{' '}
                      {customer.address?.country?.name}
                      {`, ${customer.address?.internalDbCity?.name}`}
                    </p>

                    <div className="flex flex-col mt-4 p-4 dark:bg-gray-700 rounded-b-lg border-t border-gray-300 dark:border-gray-600 ">
                      <div className="flex gap-4 w-full">
                        <Tooltip title="Ver detalles">
                          <span
                            className="font-bold cursor-pointer hover:text-lime-500 transition-colors duration-200"
                            onClick={() => {
                              navigate(`/clientes/${customer.id}`)
                            }}
                          >
                            <IoMdEye className="text-xl" />
                          </span>
                        </Tooltip>

                        <Tooltip
                          title={`Enviar encuesta a ${customer?.name} ${customer?.lastName}`}
                        >
                          <span
                            className="font-bold cursor-pointer hover:text-lime-500 transition-colors duration-200"
                            onClick={() => {
                              handleSendRatingForm(customer)
                            }}
                          >
                            <TbChecklist className="text-xl" />
                          </span>
                        </Tooltip>

                        <Tooltip title={`Enviar encuesta para web`}>
                          <span
                            className="font-bold cursor-pointer hover:text-lime-500 transition-colors duration-200"
                            onClick={() => {
                              handleSendRatingForm(customer)
                            }}
                          >
                            test
                            <TbChecklist className="text-xl" />
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        <div className="flex items-center mt-5">
          <Pagination
            currentPage={+data?.meta?.page}
            total={data?.meta.totalItems}
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
    </div>
  )
}

export default Clientes
