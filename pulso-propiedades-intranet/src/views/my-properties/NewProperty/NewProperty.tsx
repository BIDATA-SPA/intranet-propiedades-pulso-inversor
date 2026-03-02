import { Button, Card } from '@/components/ui'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import PropertyForm from './PropertyForm/PropertyForm'

const NewProperty = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3>Crear Propiedad</h3>
          <Button
            size="sm"
            variant="solid"
            color="lime-500"
            icon={<HiArrowLeft />}
            onClick={() => navigate('/mis-propiedades')}
          >
            Regresar
          </Button>
        </div>
        <div className="flex justify-center">
          <Card className="xl:w-4/6 2xl:w-3/6 lg:w-full sp:w-full mobile:w-full">
            <PropertyForm />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NewProperty
