import { useUpdateUserMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

const useUpdateUser = () => {
  const navigate = useNavigate()
  const [updateUser, { isSuccess, isLoading, isError, data }] =
    useUpdateUserMutation()
  const { showNotification } = useNotification()

  useEffect(() => {
    if (isSuccess) {
      showNotification(
        'success',
        'Información actualizada',
        'Datos actualizados correctamente'
      )
      navigate(`/mi-perfil/${data?.id}`)
    }

    if (isError) {
      showNotification(
        'warning',
        'Error',
        'Ocurrió un error al actualizar tus datos, por favor intenta más tarde'
      )
    }
  }, [isSuccess, isError, isLoading])

  return { updateUser, isLoading }
}

export default useUpdateUser
