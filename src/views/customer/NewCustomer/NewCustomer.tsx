import { Button, Card } from '@/components/ui'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router-dom'
import CustomerForm from './CustomerForm'

const NewCustomer = () => {
  const navigate = useNavigate()

  return (
    <div>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3>Crear cliente</h3>
          <Button
            size="sm"
            variant="solid"
            color="sky-500"
            icon={<HiArrowLeft />}
            onClick={() => navigate(-1)}
          >
            Regresar
          </Button>
        </div>

        <div className="flex justify-center">
          <Card className="xl:w-4/6 2xl:w-3/6 lg:w-full sp:w-full mobile:w-full">
            <CustomerForm />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default NewCustomer
