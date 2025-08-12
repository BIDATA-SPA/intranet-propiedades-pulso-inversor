import { Alert, Card, Spinner, Tooltip } from '@/components/ui'
import { MdErrorOutline } from 'react-icons/md'
import { TbHomeCheck, TbHomeDollar, TbHomeShare } from 'react-icons/tb'
import { useMetadata } from '../hooks/use-metadata'

interface MetaCardProps {
  isFetching: boolean
  isError: boolean | unknown
  errorMessage?: string | unknown
  title?: string
  value?: string | number
  icon?: React.ReactNode
  iconClass?: string
  className?: string
}

const MetaCard = ({
  isFetching,
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
            {isFetching ? (
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

const PropertiesMeta = () => {
  const { metadata, isMetadataFetching, isMetadataError, isMetadataErrorMsg } =
    useMetadata()

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <MetaCard
          isFetching={isMetadataFetching}
          isError={isMetadataError}
          errorMessage={isMetadataErrorMsg}
          title="Total de Propiedades"
          value={metadata?.totalProperties}
          icon={<TbHomeCheck />}
          iconClass="bg-gray-500"
        />

        {/* <MetaCard
          isFetching={isMetadataFetching}
          isError={isMetadataError}
          errorMessage={isMetadataErrorMsg}
          title="Propiedades en Canje"
          value={metadata?.totalPropertiesInExchange}
          icon={<TbHomeShare />}
          iconClass="bg-sky-500"
        /> */}

        <MetaCard
          isFetching={isMetadataFetching}
          isError={isMetadataError}
          errorMessage={isMetadataErrorMsg}
          title="Propiedades Vendidas"
          value={metadata?.totalPropertiesSold}
          icon={<TbHomeDollar />}
          iconClass="bg-green-500"
        />
      </div>
    </div>
  )
}

export default PropertiesMeta
