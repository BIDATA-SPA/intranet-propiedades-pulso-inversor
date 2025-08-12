import { Alert, Card, Spinner, Tooltip } from '@/components/ui'
import { FaUserFriends, FaUserTimes } from 'react-icons/fa'
import { FaUserCheck, FaUserClock } from 'react-icons/fa6'
import { MdErrorOutline } from 'react-icons/md'
import { TbHomeCheck } from 'react-icons/tb'

interface MetaCardProps {
  isLoading: boolean
  isError: boolean | unknown
  errorMessage?: string | unknown
  title?: string
  value?: string | number
  icon?: React.ReactNode
  iconClass?: string
  className?: string
}

const MetaCard = ({
  isLoading,
  isError,
  errorMessage,
  title = 'Titulo card',
  value = 0,
  icon = <TbHomeCheck />,
  iconClass = 'bg-gray-500',
  className = '',
}: MetaCardProps) => {
  return (
    <>
      <Card className={`${className} shadow-sm`}>
        <div className="flex items-center gap-4">
          <span
            className={`${iconClass} w-14 h-14 text-2xl bg-gray-500 rounded items-center justify-center flex`}
          >
            {icon && <i className="text-2xl text-white">{icon}</i>}
          </span>
          <div className="flex flex-col">
            <span className="dark:text-white">{title}</span>
            {isLoading ? (
              <Spinner size={30} className="mt-1" />
            ) : isError || errorMessage ? (
              <Alert type="danger">
                <Tooltip title="Ha ocurrido un error" placement="bottom">
                  <MdErrorOutline className="text-xl" />
                </Tooltip>
              </Alert>
            ) : (
              <h3>{value}</h3>
            )}
          </div>
        </div>
      </Card>
    </>
  )
}

const CustomerSearchMeta = ({
  isLoading,
  isError,
  errorMessage,
  totalItems,
  approvedItems,
  rejectedItem,
  pendingItem,
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <MetaCard
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          title="Total de oportunidades"
          value={totalItems}
          icon={<FaUserFriends />}
          iconClass="bg-gray-500"
        />

        <MetaCard
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          title="Matches aprobados"
          value={approvedItems}
          icon={<FaUserCheck />}
          iconClass="bg-green-500"
        />

        <MetaCard
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          title="Matches pendientes"
          value={pendingItem || 0}
          icon={<FaUserClock />}
          iconClass="bg-yellow-500"
        />

        <MetaCard
          isLoading={isLoading}
          isError={isError}
          errorMessage={errorMessage}
          title="Matches rechazados"
          value={rejectedItem || 0}
          icon={<FaUserTimes />}
          iconClass="bg-red-500"
        />
      </div>
    </div>
  )
}

export default CustomerSearchMeta
