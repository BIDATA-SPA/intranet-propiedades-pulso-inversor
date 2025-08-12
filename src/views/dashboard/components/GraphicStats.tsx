import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import Card from '@/components/ui/Card'
import { useState } from 'react'
// import {
//     HiOutlineUserAdd,
//     HiOutlineUserGroup,
//     HiOutlineUsers,
// } from 'react-icons/hi'
// import { NumericFormat } from 'react-number-format'
import { dashboardData } from '../data/scheduleData'
import BasicLine from './ChartSales'

type StatisticCardProps = {
  // icon: ReactNode
  label: string
  loading: boolean
}

const StatisticCard = (props: StatisticCardProps) => {
  const { label, loading } = props

  const avatarSize = 55

  return (
    <Card bordered className="shadow-md 2xl:h-[45vh]">
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
          <div className="">
            <span className="font-semibold text-base">{label}</span>
          </div>
          {/* <div className=''>
                    <button className="button bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 active:bg-gray-100 dark:active:bg-gray-500 dark:active:border-gray-500 text-gray-600 dark:text-gray-100 radius-round h-9 px-3 py-2 text-sm">Exportar Reporte</button>
                </div> */}
        </div>
        <div className="m-1 mt-3 p-1">
          <BasicLine />
        </div>
      </Loading>
    </Card>
  )
}

const GraphicStats = () => {
  const [loading] = useState(false)
  const { divisesData } = dashboardData

  return (
    <div className="grid grid-cols-1 gap-4 mb-3">
      <StatisticCard
        // icon={<HiOutlineUserGroup />}
        label="Reporte de Canjes"
        loading={loading}
      />
    </div>
  )
}

export default GraphicStats
