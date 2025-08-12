import { Button } from '@/components/ui'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import CustomerSearchForm from './CustomerSearchForm'

const CustomerSearchNew = () => {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3>Crear Oportunidad</h3>
          <p>Crea una oportunidad de búsqueda para clientes.</p>
        </div>
        <Button
          size="sm"
          variant="solid"
          color="sky-500"
          icon={<HiArrowLeft />}
          onClick={() => navigate('/procanje/buzon-de-clientes')}
        >
          Regresar
        </Button>
      </div>

      {/* CUSTOMER SEARCH FORM CREATE*/}
      <CustomerSearchForm />
    </div>
  )
}

export default CustomerSearchNew
