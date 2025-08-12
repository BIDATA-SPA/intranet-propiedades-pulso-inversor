import AdaptableCard from '@/components/shared/AdaptableCard'
import { Skeleton } from '@/components/ui'
import Alert from '@/components/ui/Alert'
import { useGetAllRatingUsersQuery } from '@/services/RtkQueryService'
import { injectReducer, RootState } from '@/store'
import {
  setLoading,
  setRatingUserData,
} from '@/views/rating-user/store/ratingUserSlice'
import { useEffect } from 'react'
import { FaStarHalfAlt } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import RatingUserTable from './components/RatingUserTable'
import reducer from './store'

injectReducer('ratingUserList', reducer)

const RatingUser = () => {
  const dispatch = useDispatch()

  const { loading, page, limit, filters, totalItems } = useSelector(
    (state: RootState) => state.ratingUserList.data
  )

  const { data, isLoading } = useGetAllRatingUsersQuery({
    page,
    limit,
    paginated: true,
    ...filters,
  })

  useEffect(() => {
    dispatch(setLoading(isLoading))

    if (data?.data) {
      dispatch(
        setRatingUserData({
          ratingUsers: data.data,
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

  const totalRatingUsers = data?.meta?.totalItems || 0

  return (
    <AdaptableCard>
      <div className="flex flex-col items-start justify-start mb-4">
        <h3 className="mb-4 lg:mb-0 text-[17px] flex items-center">
          <FaStarHalfAlt className="mr-1.5 text-yellow-400" /> Total de
          calificaciones{' '}
          <span className="flex items-center ml-1">({totalRatingUsers})</span>
        </h3>
        <p>
          Resumen de todas las calificaciones enviadas de tu perfil
          (Corredores/as y Clientes).
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-4">
          <Skeleton variant="circle" />
          <Skeleton />
        </div>
      ) : totalItems > 0 ? (
        <RatingUserTable />
      ) : (
        <Alert showIcon className="mb-4" type="info">
          Aún no se han registrado calificaciones en tu perfil.
        </Alert>
      )}
    </AdaptableCard>
  )
}

export default RatingUser
