import AdaptableCard from '@/components/shared/AdaptableCard'
import { Skeleton } from '@/components/ui'
import { useGetAllAliedRealtorRequestQuery } from '@/services/RtkQueryService'
import { injectReducer, RootState } from '@/store'
import { setLoading } from '@/views/inbox-request/contact-managment/store/aliedRealtorRequestSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import AliedRealtorGrid from './components/AliedRealtorGrid'
import AliedRealtorTable from './components/AliedRealtorTable'
import AliedRealtorTableTools from './components/AliedRealtorTableTools'
import EmailDialog from './components/EmailDialog'
import reducer, { setAliedRealtorsRequestData } from './store'

injectReducer('aliedRealtorRequestList', reducer)

const ContactRequest = () => {
  const dispatch = useDispatch()

  const viewMode = useSelector(
    (state: RootState) => state.aliedRealtorRequestList.data.viewMode
  )

  const isAliedRealtorLoading = useSelector(
    (state: RootState) => state.aliedRealtorRequestList.data.loading
  )

  const { page, limit, filters } = useSelector(
    (state: RootState) => state.aliedRealtorRequestList.data
  )

  const { data, isLoading } = useGetAllAliedRealtorRequestQuery({
    page,
    limit,
    filterType: 'all',
    ...filters,
  })

  useEffect(() => {
    dispatch(setLoading(isLoading))

    if (data?.data) {
      dispatch(
        setAliedRealtorsRequestData({
          requests: data?.data,
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
        <h3 className="mb-4 lg:mb-0">Solicitudes de Contacto Corredores</h3>
      </div>

      <div className="flex justify-end flex-col lg:flex-row lg:items-center gap-4 mb-5">
        <AliedRealtorTableTools />
      </div>

      {isAliedRealtorLoading && <Skeleton />}
      {viewMode === 'list' && <AliedRealtorTable />}
      {/* {viewMode === 'grid' && <AliedRealtorGrid />} */}

      <EmailDialog />
    </AdaptableCard>
  )
}

export default ContactRequest
