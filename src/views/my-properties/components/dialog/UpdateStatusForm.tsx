import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Select from '@/components/ui/Select'
import toast from '@/components/ui/toast'
import {
  useGetAllDisabledReasonsQuery,
  useUpdatePropertyMutation,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { useState } from 'react'
import { Property } from '../../store/types'

interface UpdateStatusFormProps {
  onClose: () => void
  property: Property
}

const UpdateStatusForm = ({ onClose, property }: UpdateStatusFormProps) => {
  const userAuthority = useAppSelector((state) => state.auth.session.rol)
  const { data: disabledReasons } = useGetAllDisabledReasonsQuery()
  const [updateProperty, { isLoading }] = useUpdatePropertyMutation()
  const [selectedReason, setSelectedReason] = useState(
    property?.propertyStatus?.id
  )

  const allOptions = disabledReasons ?? [
    { value: '1', label: 'Vendida' },
    { value: '2', label: 'Dada de baja' },
    { value: '3', label: 'Deshabilitada' },
    { value: '4', label: 'Activa' },
  ]

  // 🔹 Filtrar opciones según el rol del usuario
  const selectOptions =
    userAuthority === 3
      ? allOptions.filter((opt) => ['2', '4'].includes(opt.value)) // Solo "Activa" y "Dada de baja"
      : allOptions

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  const handleSelectChange = (selectedOption) => {
    setSelectedReason(selectedOption ? selectedOption.value : '')
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const body = {
      step2: {
        propertyStatusId: selectedReason, // property?.propertyStatus?.id
      },
    }

    try {
      await updateProperty({ id: property?.id, ...body }).unwrap()
      openNotification(
        'success',
        '¡Actualizada!',
        'Propiedad actualizada exitosamente',
        3
      )
      onClose()
    } catch (error) {
      openNotification(
        'danger',
        '¡Error!',
        error?.message ||
          'Ha habido un error al actualizar esta propiedad, inténtelo más tarde.',
        3
      )
      onClose()
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Select
        isSearchable
        options={selectOptions}
        placeholder="Seleccionar"
        value={selectOptions.find((option) => option.value === selectedReason)}
        onChange={handleSelectChange}
      />

      <div className="w-full flex justify-end mt-4">
        <Button
          size="md"
          variant="solid"
          className="mx-1"
          type="submit"
          loading={isLoading}
        >
          Guardar
        </Button>
      </div>
    </form>
  )
}

export default UpdateStatusForm
