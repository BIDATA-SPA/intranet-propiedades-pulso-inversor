import { Tabs } from '@/components/ui' // Tabs
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { useGetMyInfoQuery } from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import AccessDenied from '../access-denied/AccessDenied'
import ActivityLog from './components/activityLog/ActivityLog'
import ClicsOfProperties from './components/clicsOfPaginasWeb/clicsOfProperties/ClicsOfProperties'
import ClicsOfRealtors from './components/clicsOfPaginasWeb/clicsOfRealtors/ClicsOfRealtors'
import CountsProperties from './components/CountsProperties/CountsProperties'
import CustomerStatistic from './components/CustomerStatics'
import MainDashboardHeader from './components/MainDashboardHeader'
import PropertyStatistic from './components/PropertyStatistic'
// import QuickNavigation from './components/QuickNavigation'
import Schedule from './components/Schedule'
import TopCitiesMostProperties from './components/TopCitiesMostProperties/TopCitiesMostProperties'
import TopStatesMostProperties from './components/TopStatesMostProperties/TopStatesMostProperties'

const MainDashboard = () => {
  const { data } = useGetMyInfoQuery({}, { refetchOnMountOrArgChange: true })
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  return (
    <>
      {/* Not authorized view */}
      {userAuthority !== 3 && userAuthority !== 2 && <AccessDenied />}

      {/* Realtor view */}
      {userAuthority === 2 && (
        <div className="flex flex-col gap-4 h-full">
          <div>
            <div className="border dark:border-gray-700 w-full border-l-4 px-4 border-l-lime-500 dark:border-l-lime-500 rounded-lg flex flex-col lg:flex-row justify-between items-center">
              <div className="flex justify-start items-center w-full p-2">
                <MainDashboardHeader
                  userName={
                    !data?.name ? '' : data?.name + ' ' + data?.lastName
                  }
                />
              </div>
            </div>

            <div>
              <Tabs defaultValue="tab1">
                <TabList>
                  <TabNav value="tab1">Información personal</TabNav>
                  <TabNav value="tab2">Información global</TabNav>
                </TabList>

                <TabContent value="tab1">
                  <div className="flex flex-row gap-2 mt-2">
                    <div className="w-[50%]">
                      <CustomerStatistic />
                    </div>
                    <div className="w-[50%]">
                      <PropertyStatistic />
                    </div>
                  </div>

                  <div className="flex flex-col xl:flex-row gap-4 pb-2">
                    <div className="flex flex-col flex-auto">
                      <div className="flex flex-col 2xl:flex-row gap-2 mb-3">
                        <div className="h-full w-full 2xl:w-[50%]">
                          <ClicsOfRealtors />
                        </div>
                        <div className="h-full w-full 2xl:w-[50%]">
                          <ClicsOfProperties />
                        </div>
                      </div>
                      <div>
                        <ActivityLog />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="xl:w-[380px]">
                        <Schedule />
                      </div>
                    </div>
                  </div>
                </TabContent>

                <TabContent value="tab2">
                  <div className="flex flex-col xl:flex-row gap-4 py-2">
                    <div className="flex flex-col flex-auto">
                      <div>
                        <CountsProperties />
                      </div>
                      <div>
                        <TopCitiesMostProperties />
                      </div>
                      <div>
                        <TopStatesMostProperties />
                      </div>
                    </div>
                  </div>
                </TabContent>
              </Tabs>

              {/* old  */}
              {/* <Tabs defaultValue="tab1">
            <TabList>
              <TabNav value="tab1" icon="">
                Información personal
              </TabNav>
              <TabNav value="tab2" icon="">
                Información global
              </TabNav>
            </TabList>
            <TabContent value="tab1">
              <div className="flex flex-row gap-2 mt-2">
                <div className="w-[50%]">
                  <CustomerStatistic />
                </div>
                <div className="w-[50%]">
                  <PropertyStatistic />
                </div>
              </div>
              <div className="flex flex-col xl:flex-row gap-4 pb-2">
                <div className="flex flex-col flex-auto">
                  <div className="flex flex-col 2xl:flex-row gap-2 mb-3">
                    <div className="h-full w-full 2xl:w-[50%]">
                      <ClicsOfRealtors />
                    </div>
                    <div className="h-full w-full 2xl:w-[50%]">
                      <ClicsOfProperties />
                    </div>
                  </div>
                  <div>
                    <GraphicStats />
                  </div>
                  <div>
                    <ActivityLog />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="xl:w-[380px]">
                    <Schedule />
                  </div>
                </div>
              </div>
            </TabContent>
            <TabContent value="tab2">
              <div className="flex flex-col xl:flex-row gap-4 py-2">
                <div className="flex flex-col flex-auto">
                  <div>
                    <GlobalCustomerStatistic />
                  </div>
                  <div>
                    <GlobalPropertyStatistic />
                  </div>
                  <div>
                    <GraphicStatsGlobal />
                  </div>
                </div>
              </div>
            </TabContent>
          </Tabs> */}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default MainDashboard
