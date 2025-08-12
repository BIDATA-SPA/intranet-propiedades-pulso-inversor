import GrowShrinkTag from '@/components/shared/GrowShrinkTag'
import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { useState, type ReactNode } from 'react'
import {
  HiOutlineUserAdd,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { dashboardData } from '../data/scheduleData'
import { useGetDashboardQuery } from '@/services/RtkQueryService'

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

const GlobalCustomerStatistic = () => {
  const [loading] = useState(false)
  const { customerDataGlobal } = dashboardData

  const { data, isFetching, error, refetch } = useGetDashboardQuery(null, {
    refetchOnMountOrArgChange: true,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-3">
      <StatisticCard
        icon={<HiOutlineUserGroup />}
        avatarClass="bg-lime-500"
        label="Total oportunidad de cliente"
        nameTitle={customerDataGlobal?.totalCustomers?.nameTitle}
        value={data?.globalInfo?.customersSearch}
        growthRate={customerDataGlobal?.totalCustomers?.growShrink}
        loading={loading}
      />
      <StatisticCard
        icon={<HiOutlineUsers />}
        avatarClass="bg-lime-500"
        label="Oportunidad de cliente nuevas"
        nameTitle={customerDataGlobal?.activeCustomers?.nameTitle}
        value={data?.globalInfo?.newCustomersSearch}
        growthRate={customerDataGlobal?.activeCustomers?.growShrink}
        loading={loading}
      />
      <StatisticCard
        icon={<HiOutlineUserAdd />}
        avatarClass="bg-lime-500"
        label="Oportunidade cliente activa"
        nameTitle={customerDataGlobal?.newCustomers?.nameTitle}
        value={data?.globalInfo?.activeCustomersSearch}
        growthRate={customerDataGlobal?.newCustomers?.growShrink}
        loading={loading}
      />
    </div>
  )
}

export default GlobalCustomerStatistic
