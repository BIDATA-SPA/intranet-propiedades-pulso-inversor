import { useParams, useNavigate } from 'react-router-dom'
import Container from '@/components/shared/Container'
import AdaptableCard from '@/components/shared/AdaptableCard'
import VisitForm from './components/VisitForm'
import Button from '@/components/ui/Button'
import { HiArrowLeft } from 'react-icons/hi'

const VisitPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <Container>
      {/* Barra superior: back + contexto */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="plain"
            icon={<HiArrowLeft />}
            onClick={() => navigate('/mis-propiedades')}
          >
            Volver a Mis Propiedades
          </Button>
          <div className="hidden md:block h-6 w-px bg-gray-200" />
          <div>
            <h2 className="text-xl md:text-2xl font-semibold leading-tight">
              Crear Orden de Visita
            </h2>
            <p className="text-sm text-gray-500">
              Completa los datos para generar la orden de visita en PDF.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-medium border border-emerald-100">
            Paso 1 de 1 · Datos de visita
          </span>
        </div>
      </div>

      {/* Card principal */}
      <AdaptableCard>
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h3 className="text-lg font-semibold">Datos de la visita</h3>
          <p className="text-sm text-gray-500 mt-1">
            Revisa que la propiedad y los datos del cliente estén correctos antes
            de generar la orden.
          </p>
        </div>

        <VisitForm propertyId={id} />
      </AdaptableCard>
    </Container>
  )
}

export default VisitPage
