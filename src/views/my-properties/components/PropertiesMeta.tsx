import { Alert, Card, Spinner, Tooltip } from '@/components/ui'
import type { ReactNode } from 'react'
import { MdErrorOutline } from 'react-icons/md'
import { TbHomeCheck } from 'react-icons/tb'
import { useMetadata } from '../hooks/use-metadata'

interface MetaCardProps {
  isFetching: boolean
  isError: boolean
  errorMessage?: string
  title?: string
  value?: string | number | null
  icon?: ReactNode
  iconClass?: string
  className?: string
}

const MetaCard = ({
  isFetching,
  isError,
  errorMessage,
  title = 'Título card',
  value = 0,
  icon = <TbHomeCheck />,
  iconClass = 'bg-gray-500',
  className = '',
}: MetaCardProps) => {
  const hasError = isError || Boolean(errorMessage)

  return (
    <Card className={`${className} shadow-sm`}>
      <div className="flex items-center gap-4">
        <span
          className={`${iconClass} w-14 h-14 text-2xl rounded items-center justify-center flex`}
        >
          {icon && <i className="text-2xl text-white">{icon}</i>}
        </span>

        <div className="flex min-w-0 flex-col">
          <span className="dark:text-white">{title}</span>

          {isFetching ? (
            <Spinner size={30} className="mt-1" />
          ) : hasError ? (
            <Alert
              type="danger"
              className="mt-1 flex items-center gap-2 px-2 py-1"
            >
              <Tooltip
                title={
                  errorMessage ||
                  'Ha ocurrido un error al obtener la información'
                }
                placement="bottom"
              >
                <span className="inline-flex cursor-help items-center">
                  <MdErrorOutline className="text-xl" />
                </span>
              </Tooltip>

              <span className="text-xs font-medium">Error al cargar</span>
            </Alert>
          ) : (
            <h3>{value ?? 0}</h3>
          )}
        </div>
      </div>
    </Card>
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
      </div>
    </div>
  )
}

export default PropertiesMeta
