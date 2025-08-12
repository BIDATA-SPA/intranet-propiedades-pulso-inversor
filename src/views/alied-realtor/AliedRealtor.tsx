import AdaptableCard from '@/components/shared/AdaptableCard'
import { Skeleton } from '@/components/ui'
import { useGetAllAliedRealtorQuery } from '@/services/RtkQueryService'
import { injectReducer, RootState } from '@/store'
import {
  setAliedRealtorsData,
  setLoading,
} from '@/views/alied-realtor/store/aliedRealtorSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AliedRealtorGrid from './components/AliedRealtorGrid'
import AliedRealtorTable from './components/AliedRealtorTable'
import AliedRealtorTableTools from './components/AliedRealtorTableTools'
import EmailDialog from './components/EmailDialog'
import reducer from './store'

injectReducer('aliedRealtorList', reducer)

const AliedRealtor = () => {
  const dispatch = useDispatch()

  const viewMode = useSelector(
    (state: RootState) => state.aliedRealtorList.data.viewMode
  )

  const isAliedRealtorLoading = useSelector(
    (state: RootState) => state.aliedRealtorList.data.loading
  )

  const { page, limit, filters } = useSelector(
    (state: RootState) => state.aliedRealtorList.data
  )

  const { data, isLoading } = useGetAllAliedRealtorQuery({
    page,
    limit,
    ...filters,
  })

  useEffect(() => {
    dispatch(setLoading(isLoading))

    if (data?.data) {
      dispatch(
        setAliedRealtorsData({
          realtors: data?.data,
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
      <div className="lg:flex items-center justify-start mb-4">
        <h3 className="mb-4 lg:mb-0">Corredores Asociados</h3>
      </div>

      <div className="flex justify-end flex-col lg:flex-row lg:items-center gap-4 mb-5">
        <AliedRealtorTableTools />
      </div>

      {isAliedRealtorLoading && <Skeleton />}
      {viewMode === 'list' && <AliedRealtorTable />}
      {viewMode === 'grid' && <AliedRealtorGrid />}

      <EmailDialog />
    </AdaptableCard>
  )
}

export default AliedRealtor
