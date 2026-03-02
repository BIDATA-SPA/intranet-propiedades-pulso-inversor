import {
  useGetCustomerByIdQuery,
  useUpdateCustomerMutation,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import CustomerForm, {
  FormModel,
  SetSubmitting,
} from '@/views/customer/CustomerForm/CustomerForm'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Tools from '../components/Tools'

const UpdateCustomer = () => {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const { showNotification } = useNotification()
  const { data: customer } = useGetCustomerByIdQuery(customerId, {
    refetchOnMountOrArgChange: true,
  })
  const [updateCustomer, { data, isError, isSuccess, error, isLoading }] =
    useUpdateCustomerMutation()

  const handleDiscard = () => {
    navigate('/clientes')
  }

  const handleFormSubmit = async (
    values: FormModel,
    setSubmitting: SetSubmitting
  ) => {
    const data = cloneDeep({
      ...values,
      dialCodeId: Number(values.dialCodeId),
    })

    setSubmitting(true)
    updateCustomer({ id: customerId, ...data })
    setSubmitting(false)
  }

  useEffect(() => {
    if (isSuccess) {
      showNotification(
        'success',
        'Actualizado',
        '¡Cliente actualizado exitosamente!'
      )
      if (!data?.id) return null
    }

    if (isError) {
      setTimeout(() => {
        showNotification(
          'danger',
          'Error',
          `¡Ha ocurrido un error al actualizar el cliente, por favor inténtalo más tarde! ${
            error?.message && `- ${error?.message}`
          }`
        )
      }, 1000)
    }
  }, [isSuccess, isError, error])

  return (
    <>
      <Tools type="update" />
      <CustomerForm
        type="update"
        isLoading={isLoading}
        initialData={{
          name: customer?.name ?? '',
          lastName: customer?.lastName ?? '',
          alias: customer?.alias ?? '',
          rut: customer?.rut ?? '',
          email: customer?.email ?? '',
          dialCodeId: customer?.dialCode?.id ?? '',
          phone: customer?.phone ?? '',
          address: {
            countryId: customer?.address?.country?.id,
            stateId: customer?.address?.internalDbState?.id,
            cityId: customer?.address?.internalDbCity?.id,
            street: customer?.address?.street ?? '',
          },
        }}
        onFormSubmit={handleFormSubmit}
        onDiscard={handleDiscard}
      />
    </>
  )
}

export default UpdateCustomer
