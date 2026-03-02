import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import Select from '@/components/ui/Select'
import toast from '@/components/ui/toast'
import {
  useGetAllDisabledReasonsQuery,
  useUpdatePropertyMutation,
} from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { useMemo, useState } from 'react'
import { Property } from '../../store/types'

interface UpdateStatusFormProps {
  onClose: () => void
  property: Property
}

const UpdateStatusForm = ({ onClose, property }: UpdateStatusFormProps) => {
  const userAuthority = useAppSelector((state) => state.auth.session.rol)
  const { data: disabledReasons } = useGetAllDisabledReasonsQuery()
  const [updateProperty, { isLoading }] = useUpdatePropertyMutation()

  // ✅ el select debe partir con el status actual
  const [selectedStatusId, setSelectedStatusId] = useState<string | number>(
    property?.propertyStatus?.id ?? ''
  )

  // ✅ NO invento estados: uso API si viene, si no, tu fallback
  const allOptions = useMemo(
    () =>
      disabledReasons ?? [
        { value: '1', label: 'Vendida' },
        { value: '2', label: 'Dada de baja' },
        { value: '3', label: 'Deshabilitada' },
        { value: '4', label: 'Activa' },
      ],
    [disabledReasons]
  )

  // 🔹 Filtrar opciones según el rol del usuario (mantengo tu regla)
  const selectOptions =
    userAuthority === 3
      ? allOptions.filter((opt) => ['2', '4'].includes(String(opt.value)))
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

  const handleSelectChange = (opt: any) => {
    setSelectedStatusId(opt ? opt.value : '')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!property?.id) {
      openNotification('danger', '¡Error!', 'ID de propiedad no definido.', 3)
      return
    }

    if (!selectedStatusId) {
      openNotification(
        'warning',
        'Falta selección',
        'Debes seleccionar un estado.',
        3
      )
      return
    }

    try {
      await updateProperty({
        id: property.id,
        step2: { propertyStatusId: Number(selectedStatusId) },
      }).unwrap()

      openNotification(
        'success',
        '¡Actualizada!',
        'Estado de la propiedad actualizado exitosamente.',
        3
      )
      onClose()
    } catch (error: any) {
      openNotification(
        'danger',
        '¡Error!',
        error?.data?.message ||
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
        value={selectOptions.find(
          (option) => String(option.value) === String(selectedStatusId)
        )}
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
