import AdaptableCard from '@/components/shared/AdaptableCard'
import Skeleton from '@/components/ui/Skeleton'
import Tabs from '@/components/ui/Tabs'
import { useGetAllPropertiesQuery } from '@/services/RtkQueryService'
import { injectReducer, RootState } from '@/store'
import {
  setLoading,
  setPropertiesData,
} from '@/views/my-properties/store/propertyListSlice'
import { useEffect } from 'react'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux'
import PortalOfPortals from '../portal-of-portals'
import PropertiesGrid from './components/PropertiesGrid'
import PropertiesMeta from './components/PropertiesMeta'
import PropertiesTable from './components/PropertiesTable'
import PropertiesTableTools from './components/PropertiesTableTools'
import reducer from './store'

const { TabNav, TabList, TabContent } = Tabs

injectReducer('propertiesList', reducer)

const MyPropertiesList = () => {
  const dispatch = useDispatch()

  // Properties view mode from store
  const viewMode = useSelector(
    (state: RootState) => state.propertiesList.data.viewMode
  )

  const isPropertiesLoading = useSelector(
    (state: RootState) => state.propertiesList.data.loading
  )

  // Metadata from properties store
  const { page, limit, filters } = useSelector(
    (state: RootState) => state.propertiesList.data
  )

  const { data, isLoading } = useGetAllPropertiesQuery({
    page,
    limit,
    ...filters,
  })

  useEffect(() => {
    dispatch(setLoading(isLoading))

    if (data?.data) {
      dispatch(
        setPropertiesData({
          properties: data?.data,
          page: data?.meta?.page,
          limit: data?.meta?.limit,
          totalItems: data?.meta?.totalItems,
          totalPages: data?.meta?.totalPages,
          previousPageUrl: data?.meta?.previousPageUrl,
          nextPageUrl: data?.meta?.nextPageUrl,
        })
      )
      dispatch(setLoading(isLoading))
    }
  }, [data, dispatch])

  return (
    <AdaptableCard>
      <Tabs defaultValue="tab1">
        <TabList>
          <TabNav value="tab1" icon={<HiOutlineBuildingOffice2 />}>
            Mis Propiedades
          </TabNav>
          {/* ℹ️ disable-pdp */}
          {/* <TabNav value="tab2" icon={<FaHouseSignal />}>
            Portal de Portales
          </TabNav> */}
          {/* ℹ️ end disable-pdp */}
        </TabList>

        <div className="p-4">
          <TabContent value="tab1">
            <>
              <div className="w-full">
                <PropertiesMeta />
              </div>

              <div className="flex justify-end flex-col lg:flex-row lg:items-center gap-4 mb-5">
                <PropertiesTableTools />
              </div>

              <div>
                {isPropertiesLoading && <Skeleton />}
                {viewMode === 'list' && <PropertiesTable />}
                {viewMode === 'grid' && <PropertiesGrid />}
              </div>
            </>
          </TabContent>

          {/* ! ℹ️ disable-pdp */}
          <TabContent value="tab2">
            <PortalOfPortals />
          </TabContent>
        </div>
      </Tabs>
    </AdaptableCard>
  )
}

export default MyPropertiesList
