import { Spinner } from '@/components/ui'
import Tooltip from '@/components/ui/Tooltip'
import { useGetReferralRealtorMetadataQuery } from '@/services/RtkQueryService'
import classNames from 'classnames'
import { MdEmail, MdOutlineDangerous } from 'react-icons/md'
import { RiShareFill } from 'react-icons/ri'

interface CustomCardProp {
  color: string
  icon: JSX.Element
  title: string
  value: number
  isFetching?: boolean
}

export const CustomCard = ({
  color = 'bg-lime-500',
  icon = <MdEmail />,
  title = 'Titulo tarjeta',
  value = 0,
  isFetching = false,
}: CustomCardProp) => {
  return (
    <div className="border rounded-lg p-1.5 px-3 dark:border-gray-700 w-full">
      <div className="flex items-center gap-4">
        <span
          className={classNames(
            `${color}`,
            'w-8 h-8 text-xl rounded flex items-center justify-center text-white'
          )}
        >
          {icon}
        </span>
        <div>
          <span className="dark:text-white text-[13px]">{title}</span>
          {isFetching ? <Spinner /> : <h3>{value}</h3>}
        </div>
      </div>
    </div>
  )
}

const Meta = () => {
  const {
    data: metadata,
    isFetching,
    isError,
  } = useGetReferralRealtorMetadataQuery()

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
      <Tooltip title="Total de corredores referidos.">
        <CustomCard
          color="bg-lime-500"
          icon={<RiShareFill />}
          title="Total de Corredores Referidos"
          value={isError ? <MdOutlineDangerous /> : metadata?.countSendingTotal}
          isFetching={isFetching}
        />
      </Tooltip>

      <Tooltip title="Total de corredores referidos, con registro y propiedades creadas">
        <CustomCard
          color="bg-green-500"
          icon={<RiShareFill />}
          title="Cuenta y Propiedades creadas"
          value={
            isError ? (
              <MdOutlineDangerous />
            ) : (
              metadata?.countReceivedStatusAproved
            )
          }
          isFetching={isFetching}
        />
      </Tooltip>

      <Tooltip title="Total de corredores referidos, con registro creado pero sin propiedades creadas">
        <CustomCard
          color="bg-yellow-500"
          icon={<RiShareFill />}
          title="Propiedades pendientes"
          value={
            isError ? (
              <MdOutlineDangerous />
            ) : (
              metadata?.countReceivedStatusPending || 0
            )
          }
          isFetching={isFetching}
        />
      </Tooltip>
    </div>
  )
}

export default Meta
