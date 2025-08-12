import { AdaptableCard } from '@/components/shared'
import { Button } from '@/components/ui'
import { HiArrowLeft } from 'react-icons/hi'
import { useNavigate } from 'react-router'
import ActionBar from './components/ActionBar'
import ServicesList from './components/ServiceList'

const FolderContentList = () => {
    const navigate = useNavigate()

    return (
        <AdaptableCard className="h-full" bodyClass="h-full">
            <div className="lg:flex items-center justify-between mb-4">
                <h3 className="mb-4 lg:mb-0">Servicios</h3>
                <div className="flex flex-col lg:flex-row lg:items-center">
                    <ActionBar />

                    <Button
                        size="sm"
                        variant="solid"
                        color="sky-500"
                        icon={<HiArrowLeft />}
                        onClick={() => navigate('/servicios-externos')}
                    >
                        Regresar
                    </Button>
                </div>
            </div>

            {/* SERVICE'S TABLE */}
            <ServicesList />
        </AdaptableCard>
    )
}

export default FolderContentList
