import AdaptableCard from '@/components/shared/AdaptableCard'
import Skeleton from '@/components/ui/Skeleton'
import Tabs from '@/components/ui/Tabs'
import { useGetAllPropertiesQuery } from '@/services/RtkQueryService'
import { injectReducer, RootState } from '@/store'
import {
  clearPropertiesData,
  setLoading,
  setPropertiesData,
} from '@/views/my-properties/store/propertyListSlice'
import { useEffect, useMemo } from 'react'
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

  const viewMode = useSelector(
    (state: RootState) => state.propertiesList.data.viewMode
  )

  const isPropertiesLoading = useSelector(
    (state: RootState) => state.propertiesList.data.loading
  )

  const { page, limit, filters } = useSelector(
    (state: RootState) => state.propertiesList.data
  )

  /**
   * IMPORTANTE:
   * Ajusta estos selectores según tu store real.
   * La idea es obtener un dato único del usuario actual.
   */
  const authUser = useSelector((state: RootState) => {
    return (
      state.auth?.user ||
      state.auth?.session?.user ||
      state.auth?.data?.user ||
      null
    )
  })

  const cacheUserKey = useMemo(() => {
    const userIdentifier =
      authUser?.id ||
      authUser?._id ||
      authUser?.email ||
      authUser?.rut ||
      'authenticated-user'

    return `properties-${userIdentifier}`
  }, [authUser])

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      cacheUserKey,
      ...filters,
    }),
    [page, limit, filters, cacheUserKey]
  )

  const { data, isLoading, isFetching, isSuccess } = useGetAllPropertiesQuery(
    queryParams,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  )

  useEffect(() => {
    dispatch(clearPropertiesData())
  }, [dispatch, cacheUserKey])

  useEffect(() => {
    dispatch(setLoading(isLoading || isFetching))
  }, [dispatch, isLoading, isFetching])

  useEffect(() => {
    if (!isSuccess || !data?.data) return

    dispatch(
      setPropertiesData({
        properties: data.data,
        page: data.meta?.page ?? page,
        limit: data.meta?.limit ?? limit,
        totalItems: data.meta?.totalItems ?? 0,
        totalPages: data.meta?.totalPages ?? 0,
        previousPageUrl: data.meta?.previousPageUrl ?? null,
        nextPageUrl: data.meta?.nextPageUrl ?? null,
      })
    )
  }, [data, isSuccess, dispatch, page, limit])

  const shouldShowContent = !isPropertiesLoading && !isFetching

  return (
    <AdaptableCard>
      <Tabs defaultValue="tab1">
        <TabList>
          <TabNav value="tab1" icon={<HiOutlineBuildingOffice2 />}>
            Mis Propiedades
          </TabNav>
        </TabList>

        <div className="p-4">
          <TabContent value="tab1">
            <>
              <div className="w-full">
                <PropertiesMeta cacheUserKey={cacheUserKey} />
              </div>

              <div className="mb-5 flex flex-col justify-end gap-4 lg:flex-row lg:items-center">
                <PropertiesTableTools />
              </div>

              <div>
                {!shouldShowContent && <Skeleton />}

                {shouldShowContent && viewMode === 'list' && (
                  <PropertiesTable />
                )}

                {shouldShowContent && viewMode === 'grid' && <PropertiesGrid />}
              </div>
            </>
          </TabContent>

          <TabContent value="tab2">
            <PortalOfPortals />
          </TabContent>
        </div>
      </Tabs>
    </AdaptableCard>
  )
}

export default MyPropertiesList
