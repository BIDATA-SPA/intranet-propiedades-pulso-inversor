/* eslint-disable react-hooks/exhaustive-deps */
import AdaptableCard from '@/components/shared/AdaptableCard'
import Skeleton from '@/components/ui/Skeleton'
import { useGetAllPropertiesQuery } from '@/services/RtkQueryService'
import { injectReducer, RootState } from '@/store'
import {
  setLoading,
  setPropertiesResumeData,
} from '@/views/dashboard-customer/components/dashboard-tabs/dashboard-content/properties/store/resumePropertySlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import reducer from '../store'
import PropertiesResumeGrid from './PropertiesResumeGrid'

injectReducer('propertiesResumeList', reducer)

const PropertiesResumeList = () => {
  const dispatch = useDispatch()

  const viewMode = useSelector(
    (state: RootState) => state.propertiesResumeList.data.viewMode
  )

  const isPropertiesLoading = useSelector(
    (state: RootState) => state.propertiesResumeList.data.loading
  )

  // Metadata from properties store
  const { page, limit } = useSelector(
    (state: RootState) => state.propertiesResumeList.data
  )

  const { data, isLoading } = useGetAllPropertiesQuery({
    page,
    limit,
  })

  useEffect(() => {
    dispatch(setLoading(isLoading))

    if (data?.data) {
      dispatch(
        setPropertiesResumeData({
          propertiesResume: data?.data,
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
      <div>
        {isPropertiesLoading && <Skeleton />}
        {viewMode === 'grid' && <PropertiesResumeGrid />}
      </div>
    </AdaptableCard>
  )
}

export default PropertiesResumeList
