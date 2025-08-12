import Loading from '@/components/shared/Loading'
import MediaSkeleton from '@/components/shared/loaders/MediaSkeleton'
import Card from '@/components/ui/Card'
import { useState } from 'react'
import BasicLineGlobal from './ChartSalesGlobal'

type StatisticCardProps = {
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
        </div>
        <div className="m-1 mt-3 p-1">
          <BasicLineGlobal />
        </div>
      </Loading>
    </Card>
  )
}

const GraphicStatsGlobal = () => {
  const [loading] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-4 mb-3">
      <StatisticCard label="Reporte de Canjes" loading={loading} />
    </div>
  )
}

export default GraphicStatsGlobal
