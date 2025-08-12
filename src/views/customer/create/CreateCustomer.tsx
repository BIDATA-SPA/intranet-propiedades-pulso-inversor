import { useCreateCustomerMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import CustomerForm, {
  FormModel,
  SetSubmitting,
} from '@/views/customer/CustomerForm/CustomerForm'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Tools from '../components/Tools'

const CreateCustomer = () => {
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [createCustomer, { data, isError, isSuccess, error, isLoading }] =
    useCreateCustomerMutation()

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
    createCustomer(data)
    setSubmitting(false)
  }

  useEffect(() => {
    if (isSuccess) {
      showNotification('success', 'Creado', '¡Cliente creado exitosamente!')
      if (!data?.id) return null
      navigate(`/clientes/${data.id}`)
    }

    if (isError) {
      setTimeout(() => {
        showNotification(
          'danger',
          'Error',
          `¡Ha ocurrido un error al crear el cliente, por favor inténtalo más tarde! ${
            error?.message && `- ${error?.message}`
          }`
        )
      }, 1000)
    }
  }, [isSuccess, isError, error])

  return (
    <>
      <Tools type="create" />
      <CustomerForm
        type="create"
        isLoading={isLoading}
        onFormSubmit={handleFormSubmit}
        onDiscard={handleDiscard}
      />
    </>
  )
}

export default CreateCustomer
