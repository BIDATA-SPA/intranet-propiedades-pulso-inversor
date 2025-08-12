import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import Avatar from '@/components/ui/Avatar'
import Card from '@/components/ui/Card'
import { useState, type ReactNode } from 'react'
import {
  HiEye,
  HiOutlineUserAdd,
  HiOutlineUserGroup,
  HiOutlineUsers,
} from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import { dashboardData } from '../data/scheduleData'

import { useGetDashboardQuery } from '@/services/RtkQueryService'
// import { GetDashboard } from '@/services/dashboard/types/dashboard.type'

type StatisticCardProps = {
  icon: ReactNode
  avatarClass: string
  label: string
  value?: number
  path?: string
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
    path,
    loading,
    nameTitle,
    growShrink,
    growthRate,
  } = props
  const avatarSize = 20

  return (
    <>
      <article className="shadow-md group group-hover:blur-lg px-2 2xl:p-1  w-full h-28 border border-1 rounded-md">
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
          <div className="overflow-hidden relative text-center 2xl:p-2 group items-center flex duration-500 h-full ">
            <div className="flex items-center gap-4 bg-transparent group-hover:blur-[1px]  z-10 transition-all duration-500">
              <Avatar
                className={`${avatarClass} md:text-base md:p-1 2xl:text-lg`}
                // size={avatarSizeXl}
                icon={icon}
              />
              <div className="2xl:text-start">
                <span className="">{nameTitle}</span>
                <h3>
                  <NumericFormat
                    thousandSeparator
                    displayType="text"
                    value={value}
                  />
                </h3>
              </div>
            </div>
            <div className="flex items-center duration-500 delay-150 group-hover:bottom-7 2xl:group-hover:bottom-6 group-hover:blur-none -bottom-full left-2 2xl:left-2 absolute z-50 justify-center w-full">
              <div className="flex text-2xl text-white p-1 transition-all duration-500 delay-200 rounded-full ">
                <a
                  className="transition-all duration-500 flex items-center font-medium  hover:bg-lime-700 bg-lime-600 p-1 px-2 rounded-full"
                  href={path}
                >
                  <HiEye className="mx-1" size={24} />
                </a>
              </div>
            </div>
          </div>
        </Loading>
      </article>
    </>
  )
}

const CustomerStatistic = () => {
  const [loading] = useState(false)
  const { customerData } = dashboardData

  const { data, isFetching, error, refetch } = useGetDashboardQuery(null, {
    refetchOnMountOrArgChange: true,
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 mb-3">
      <StatisticCard
        icon={<HiOutlineUserGroup />}
        avatarClass="bg-lime-500"
        label="Total clientes"
        nameTitle={customerData?.totalCustomers?.nameTitle}
        value={data?.personalInfo?.activeCustomers}
        path={customerData?.totalCustomers?.path}
        growthRate={customerData?.totalCustomers?.growShrink}
        loading={loading}
      />
      <StatisticCard
        icon={<HiOutlineUsers />}
        avatarClass="bg-lime-500"
        label="Clientes activos"
        nameTitle={customerData?.activeCustomers?.nameTitle}
        value={data?.personalInfo?.customersSearch}
        path={customerData?.activeCustomers?.path}
        growthRate={customerData?.activeCustomers?.growShrink}
        loading={loading}
      />
      <StatisticCard
        icon={<HiOutlineUserAdd />}
        avatarClass="bg-lime-500"
        label="Nuevos clientes"
        nameTitle={customerData?.newCustomers?.nameTitle}
        value={data?.personalInfo?.newCustomers}
        path={customerData?.newCustomers.path}
        growthRate={customerData?.newCustomers?.growShrink}
        loading={loading}
      />
    </div>
  )
}

export default CustomerStatistic
