import { AdaptableCard } from '@/components/shared'
import { useGetMyInfoQuery } from '@/services/RtkQueryService'
import MainDashboardHeader from '../dashboard/components/MainDashboardHeader'
import DashboardTabs from './components/dashboard-tabs/DashboardTabs'

const DashboardCustomer = () => {
  const { data } = useGetMyInfoQuery({}, { refetchOnMountOrArgChange: true })

  const userName = `${
    data?.name && `${data.name} ${data?.lastName && `${data.lastName}`}`
  }`

  return (
    <AdaptableCard>
      <div className="lg:flex items-center justify-start mb-4">
        <div className="border dark:border-gray-700 w-full border-l-4 px-4 border-l-sky-500 dark:border-l-sky-500 rounded-lg flex flex-col lg:flex-row justify-between items-center">
          <div className="flex justify-start items-center w-full p-2">
            <MainDashboardHeader userName={userName} />
          </div>
        </div>
      </div>

      <div className="w-full">
        <DashboardTabs />
      </div>
    </AdaptableCard>
  )
}

export default DashboardCustomer
