import { FC, memo } from 'react'

const Pin: FC = () => {
  return (
    <img
      src={'/img/map/location-pin-1.svg'}
      alt="location-pin-icon"
      title="location-pin-icon"
      height="40"
      width="40"
      loading="lazy"
    />
  )
}

export default memo(Pin)
