import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { useState, type ReactNode } from 'react'
// import {
//     HiOutlineUserAdd,
//     HiOutlineUserGroup,
//     HiOutlineUsers,
// } from 'react-icons/hi'
import { useGetDashboardQuery } from '@/services/RtkQueryService'
import {
  BsBuildingFill,
  BsBuildingFillAdd,
  BsBuildingFillCheck,
} from 'react-icons/bs'
import { NumericFormat } from 'react-number-format'
import { dashboardData } from '../data/scheduleData'

type StatisticCardProps = {
  icon: ReactNode
  avatarClass: string
  label: string
  value?: number
  growthRate?: number
  loading: boolean
  nameTitle?: string
  growShrink?: number
}

const StatisticCard = (props: StatisticCardProps) => {
  const {
    icon,
    avatarClass,
    label,
    value,
    loading,
    nameTitle,
    growShrink,
    growthRate,
  } = props
  const avatarSize = 55

  return (
    <Card bordered className="shadow-md">
      <Loading
        loading={loading}
        customLoader={
          <MediaSkeleton
            avatarProps={{
              className: 'rounded',
              width: avatarSize,
              height: avatarSize,
            }}
          />
        }
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Avatar
              className={`${avatarClass} md:text-xl md:p-2 2xl:text-2xl`}
              // size={avatarSize}
              icon={icon}
            />
            <div>
              <span>{nameTitle}</span>
              <span className="cursor-pointer">{}</span>
              <h3>
                <NumericFormat
                  thousandSeparator
                  displayType="text"
                  value={value}
                />
              </h3>
            </div>
          </div>
          {/* <GrowShrinkTag className='xl:mt-10' value={growthRate} suffix="%" /> */}
        </div>
      </Loading>
    </Card>
  )
}

const GlobalPropertyStatistic = () => {
  const [loading] = useState(false)
  const { propertyDataGlobal } = dashboardData
  const { data, isFetching, error, refetch } = useGetDashboardQuery(null, {
    refetchOnMountOrArgChange: true,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-3">
      <StatisticCard
        icon={<BsBuildingFill />}
        avatarClass="bg-lime-500"
        label="Total propiedades en Canje"
        nameTitle={propertyDataGlobal?.totalProperties?.nameTitle}
        value={data?.globalInfo?.totalPropertiesInExchange}
        growthRate={propertyDataGlobal?.totalProperties?.growShrink}
        loading={loading}
      />
      <StatisticCard
        icon={<BsBuildingFillCheck />}
        avatarClass="bg-lime-500"
        label="Propiedades nuevas en Canje"
        nameTitle={propertyDataGlobal?.activeProperties?.nameTitle}
        value={data?.globalInfo?.newPropertiesInExchange}
        growthRate={propertyDataGlobal?.activeProperties?.growShrink}
        loading={loading}
      />
      <StatisticCard
        icon={<BsBuildingFillAdd />}
        avatarClass="bg-lime-500"
        label="Propiedades en Canje similares"
        nameTitle={propertyDataGlobal?.newProperties?.nameTitle}
        value={data?.globalInfo?.matchingProperties}
        growthRate={propertyDataGlobal?.newProperties?.growShrink}
        loading={loading}
      />
    </div>
  )
}

export default GlobalPropertyStatistic
