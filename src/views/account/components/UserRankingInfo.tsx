import { useGetMyInfoQuery } from '@/services/RtkQueryService'
import { getRating } from '@/views/inbox-request/kanje-managment/components/tabs/components/Inbox/UserRating'
import { Rating, ThinStar } from '@smastrom/react-rating'

const ratingStyles = {
  itemShapes: ThinStar,
  activeFillColor: '#facc15',
  inactiveFillColor: '#fef08a',
}

const UserRatingInfo = () => {
  const { data: userInfo } = useGetMyInfoQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )

  return (
    <>
      <Rating
        readOnly
        style={{ width: '35%' }}
        value={Math.ceil(userInfo?.averageRating || 0)}
        itemStyles={ratingStyles}
      />

      <div>
        <small>{`${getRating(Math.ceil(userInfo?.averageRating || 0))}`}</small>
      </div>
    </>
  )
}

export default UserRatingInfo
