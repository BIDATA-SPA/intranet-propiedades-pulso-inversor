import { Button } from '@/components/ui'
import { FaLink } from 'react-icons/fa'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router'

type ToolsType = {
  type: 'create' | 'update'
}

const Tools = ({ type = 'create' }: ToolsType) => {
  const navigate = useNavigate()
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3>
          {type === 'create' && 'Crear cliente'}
          {type === 'update' && 'Detalles del cliente'}
        </h3>

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
    </div>
  )
}

export default Tools
