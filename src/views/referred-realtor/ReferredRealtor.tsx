import AdaptableCard from '@/components/shared/AdaptableCard'
import { Skeleton } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import { useGetAllReferredRealtorQuery } from '@/services/RtkQueryService'
import { injectReducer, RootState } from '@/store'
import {
  setLoading,
  setReferredRealtorsData,
} from '@/views/referred-realtor/store/referredRealtorSlice'
import { useEffect } from 'react'
import { RiUserShared2Line } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import ReferredRealtorTable from './components/ReferredRealtorTable'
import reducer from './store'

injectReducer('referredRealtorList', reducer)

const ReferredRealtor = () => {
  const dispatch = useDispatch()

  const {
    loading: isReferredRealtorLoading,
    page,
    limit,
    filters,
    totalItems,
  } = useSelector((state: RootState) => state.referredRealtorList.data)

  const { data, isLoading } = useGetAllReferredRealtorQuery({
    page,
    limit,
    paginated: true,
    ...filters,
  })

  useEffect(() => {
    dispatch(setLoading(isLoading))

    if (data?.data) {
      dispatch(
        setReferredRealtorsData({
          realtors: data.data,
          page: data.meta?.page,
          limit: data.meta?.limit,
          totalItems: data.meta?.totalItems,
          totalPages: data.meta?.totalPages,
          previousPageUrl: data.meta?.previousPageUrl,
          nextPageUrl: data.meta?.nextPageUrl,
        })
      )
    }
  }, [data, dispatch, isLoading])

  const totalRealtors = data?.meta?.totalItems || 0

  return (
    <AdaptableCard>
      <div className="flex flex-col items-start justify-start mb-4">
        <h3 className="mb-4 lg:mb-0 text-[17px] flex items-center">
          <RiUserShared2Line className="mr-1.5" /> Mis corredores referidos{' '}
          <span className="flex items-center ml-1">({totalRealtors})</span>
        </h3>
        <p>
          Lista de corredores que han utilizado tu enlace para inscripción a
          procanje y creación de propiedades.
        </p>
      </div>

      {isReferredRealtorLoading ? (
        <div className="flex items-center gap-4">
          <Skeleton variant="circle" />
          <Skeleton />
        </div>
      ) : totalItems > 0 ? (
        <ReferredRealtorTable />
      ) : (
        <Alert showIcon className="mb-4" type="info">
          Aún no se han registrado ni creado propiedades por otros corredores
          con tu código de referidos.
        </Alert>
      )}
    </AdaptableCard>
  )
}

export default ReferredRealtor
