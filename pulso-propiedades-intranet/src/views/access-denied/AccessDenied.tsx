import { Button } from '@/components/ui'
import useAuth from '@/utils/hooks/useAuth'

function AccessDenied() {
  const { signOut } = useAuth()

  return (
    <div className="flex justify-center items-center h-full">
      <div className="text-center">
        <h2>Acceso Denegado</h2>
        <p>No tienes permiso para visitar esta página.</p>

        <div className="my-4">
          <Button
            variant="solid"
            onClick={async () => {
              await signOut()
            }}
          >
            Cerrar esta sesión
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied
