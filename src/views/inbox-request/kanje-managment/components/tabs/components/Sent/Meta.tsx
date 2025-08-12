import Alert from '@/components/ui/Alert'
import Card from '@/components/ui/Card'
import Spinner from '@/components/ui/Spinner'
import { useGetRequestMetadataQuery } from '@/services/RtkQueryService'
import classNames from 'classnames'
import { MdEmail, MdMarkEmailRead, MdMarkEmailUnread } from 'react-icons/md'
import { RiMailCloseFill } from 'react-icons/ri'

type Metadata = {
  requests: number
  pendingRequests: number
  approvedRequests: number
  rejectedRequests: number
}

interface CustomCardProp {
  color: string
  icon: JSX.Element
  title: string
  value: number
}

const CustomCard = ({
  color = 'bg-sky-500',
  icon = <MdEmail />,
  title = 'Titulo tarjeta',
  value = 0,
}: CustomCardProp) => {
  return (
    <Card className="shadow-sm">
      <div className="flex items-center gap-4">
        <span
          className={classNames(
            `${color}`,
            'w-14 h-14 text-2xl rounded flex items-center justify-center text-white'
          )}
        >
          {icon}
        </span>
        <div>
          <span className="dark:text-white">{title}</span>
          <h3>{value}</h3>
        </div>
      </div>
    </Card>
  )
}

const Meta = () => {
  const {
    data: metadata,
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useGetRequestMetadataQuery({}) as {
    data: Metadata
    isLoading: boolean
    isError: boolean
    isFetching: boolean
    error: object
    refetch: () => void
  }

  if (isLoading || isFetching)
    return (
      <div className="w-100 h-auto flex justify-center items-center">
        <Spinner className="mr-4" size="40px" />
      </div>
    )

  if (isError) {
    return (
      <div className="w-100 h-100 flex justify-center items-center">
        <Alert
          showIcon
          type="warning"
          title={error && 'Error de servidor'}
          className="w-screen flex justify-start items-start"
        >
          <span
            role="button"
            className="hover:underline"
            onClick={() => refetch()}
          >
            Reintentar
          </span>
        </Alert>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <CustomCard
        color="bg-sky-500"
        icon={<MdEmail />}
        title="Solicitudes enviadas"
        value={metadata?.requests}
      />

      <CustomCard
        color="bg-green-500"
        icon={<MdMarkEmailRead />}
        title="Solicitudes aprobadas"
        value={metadata?.approvedRequests}
      />

      <CustomCard
        color="bg-yellow-500"
        icon={<MdMarkEmailUnread />}
        title="Solicitudes pendientes"
        value={metadata?.pendingRequests}
      />

      <CustomCard
        color="bg-red-500"
        icon={<RiMailCloseFill />}
        title="Solicitudes rechazadas"
        value={metadata?.rejectedRequests}
      />
    </div>
  )
}

export default Meta
