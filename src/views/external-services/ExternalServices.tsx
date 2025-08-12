import { AdaptableCard } from '@/components/shared'
import BannerCarousel from './components/BannerCarousel'
import ActionBar from './components/ExternalServiceActionBar'
import ServicesList from './components/ExternalServicesList'

const ExternalServices = () => {
  return (
    <div className="relative">
      <AdaptableCard className="h-full">
        <ActionBar />
        <ServicesList />
      </AdaptableCard>

      <div className=" sticky bottom-2 left-0 right-0 shadow-2xl rounded-lg w-full bg-gray-500">
        <BannerCarousel />
      </div>
    </div>
  )
}

export default ExternalServices
