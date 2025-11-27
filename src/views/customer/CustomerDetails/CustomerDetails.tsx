import { Button, Card, Dialog, Skeleton } from '@/components/ui'
import Tabs from '@/components/ui/Tabs'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import {
  useDeleteCustomerMutation,
  useGetCustomerByIdQuery,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { FaLink } from 'react-icons/fa'
import { HiArrowLeft, HiOutlineTrash, HiOutlineUser } from 'react-icons/hi'
import { useNavigate, useParams } from 'react-router-dom'
import CustomerForm from './CustomerForm'

const CustomerDetails = () => {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [dialogIsOpen, setIsOpen] = useState(false)
  const [editingInitialValues, setEditingInitialValues] = useState({
    name: '',
    lastName: '',
    rut: '',
    email: '',
    phone: '',
    dialCodeId: '',
    address: {
      street: '',
      countryId: '',
      stateId: '',
      cityId: '',
    },
  })

  const { data, isFetching } = useGetCustomerByIdQuery(customerId, {
    refetchOnMountOrArgChange: true,
  })

  const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation()

  const openDialog = () => {
    setIsOpen(true)
  }

  const onDialogClose = (e) => {
    e.preventDefault()
    setIsOpen(false)
  }

  const onDialogOk = async (e) => {
    e.preventDefault()
    try {
      await deleteCustomer(customerId).unwrap()
      showNotification(
        'success',
        'Cliente eliminado',
        'El cliente ha sido eliminado correctamente.'
      )
      navigate('/clientes')
    } catch (error) {
      showNotification(
        'danger',
        'Error al eliminar',
        'No se pudo eliminar el usuario.'
      )
    } finally {
      setIsOpen(false)
    }
  }

  const formatDate = (date: Date | null, withTime = true) => {
    if (!date) return

    return withTime
      ? format(new Date(date), 'dd-MM-yyyy h:mm:ss a')
      : format(new Date(date), 'dd-MM-yyyy')
  }

  useEffect(() => {
    if (data && !isFetching) {
      setEditingInitialValues({
        name: data?.name,
        lastName: data?.lastName,
        rut: data?.rut,
        email: data?.email,
        phone: data?.phone,
        dialCodeId: data?.dialCode?.id,
        alias: data?.alias,
        address: {
          street: data?.address?.street,
          countryId: data?.address?.country?.id,
          stateId: data?.address?.internalDbState?.id, // ⚠️
          cityId: data?.address?.internalDbCity?.id, // ⚠️
        },
      })
    } else {
      setEditingInitialValues({
        name: '',
        lastName: '',
        rut: '',
        email: '',
        phone: '',
        dialCodeId: '',
        address: {
          street: '',
          countryId: '',
          stateId: '', // ⚠️
          cityId: '', // ⚠️
        },
      })
    }
  }, [data, isFetching])

  const cardFooter = (
    <div className="flex xl:justify-end gap-4">
      <Button
        block
        variant="solid"
        color="red-600"
        icon={<HiOutlineTrash />}
        className="xl:w-[150px]"
        onClick={openDialog}
      >
        Eliminar
      </Button>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3>Detalles del cliente</h3>

        <div className="flex justify-end items-end gap-4">
          <Button
            size="sm"
            variant="solid"
            color="gray-500"
            icon={<FaLink />}
            onClick={() => navigate('/mis-propiedades/crear-propiedad')}
          >
            Vincular una propiedad
          </Button>

          <Button
            size="sm"
            variant="solid"
            color="lime-500"
            icon={<HiArrowLeft />}
            onClick={() => navigate('/clientes')}
          >
            Regresar
          </Button>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-4 h-full">
          <Card className="xl:w-[500px] xl:h-[120%]" footer={cardFooter}>
            <div className="flex flex-col xl:justify-between mx-auto ">
              <div className="flex flex-col items-center">
                {isFetching ? (
                  <Skeleton width={150} height={20} className="mt-2" />
                ) : (
                  <h4 className="font-bold text-center text-gray-700 antialiased">
                    {data?.name} {data?.lastName}
                  </h4>
                )}
              </div>

              <div className="grid xl:grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-4 mt-8">
                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Nombre:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.name}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Apellido:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.lastName}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Alias:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.alias}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        RUT:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.rut || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Correo electrónico:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.email || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Teléfono:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.phone || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Dirección:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.address?.street || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Comuna o Ciudad:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {(data?.address?.internalDbCity &&
                          data?.address?.internalDbCity?.name) ||
                          '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Región:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {(data?.address?.internalDbState &&
                          data?.address?.internalDbState?.name) ||
                          '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        País:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {data?.address?.country?.name || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Fecha de creación:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {formatDate(data?.createdAt, false) || '-'}
                      </span>
                    </>
                  )}
                </div>

                <div className="flex flex-col">
                  {isFetching ? (
                    <>
                      <Skeleton className="mt-4 w-[20%]" />
                      <Skeleton className="mt-1 w-[30%]" />
                    </>
                  ) : (
                    <>
                      <span className="font-semibold dark:text-white/80">
                        Fecha de Actualización:
                      </span>
                      <span className="text-gray-700 font-semibold dark:text-white/80">
                        {formatDate(data?.updatedAt, false) || '-'}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="w-full">
            <Tabs defaultValue="tab1">
              <TabList>
                <TabNav value="tab1" icon={<HiOutlineUser />}>
                  Cliente
                </TabNav>
              </TabList>
              <div className="p-4">
                <TabContent value="tab1">
                  <CustomerForm initialValues={editingInitialValues} />
                </TabContent>
              </div>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* delete dialog */}
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <div className="flex flex-col h-full justify-between">
          <h5 className="mb-4">Confirmar Eliminación</h5>
          <p>¿Estás seguro de que quieres eliminar este cliente?</p>
          <div className="text-right mt-6">
            <Button
              className="ltr:mr-2 rtl:ml-2"
              variant="plain"
              onClick={onDialogClose}
            >
              Cancelar
            </Button>
            <Button
              variant="solid"
              color="red-500"
              disabled={isLoading}
              loading={isLoading}
              onClick={onDialogOk}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default CustomerDetails
