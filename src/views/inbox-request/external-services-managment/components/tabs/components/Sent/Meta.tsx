import { Alert, Spinner, Tooltip } from '@/components/ui'
import Card from '@/components/ui/Card'
import { useGetExternalServicesMetadataQuery } from '@/services/RtkQueryService'
import { MdEmail, MdErrorOutline } from 'react-icons/md'

const Meta = () => {
  const {
    data: metadata,
    isLoading,
    isError,
    error: errorMessage,
  } = useGetExternalServicesMetadataQuery()

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
      <Card className="shadow-sm">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 text-2xl bg-sky-500 rounded items-center justify-center flex">
            <MdEmail className="text-2xl text-white" />
          </span>
          <div>
            <div className="flex flex-col">
              <span className="dark:text-white">
                Total de solicitudes emitidas
              </span>
              {isLoading ? (
                <Spinner size={30} className="mt-1" />
              ) : isError || errorMessage ? (
                <Alert type="danger">
                  <Tooltip title="Ha ocurrido un error" placement="bottom">
                    <MdErrorOutline className="text-xl" />
                  </Tooltip>
                </Alert>
              ) : (
                <h3>{metadata?.serviceExternalRequest}</h3>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* <Card className="shadow-sm">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 text-2xl bg-green-500 rounded items-center justify-center flex">
            <MdMarkEmailUnread className="text-2xl text-white" />
          </span>
          <div>
            <span className="dark:text-white">
              Total de solicitudes Activas
            </span>
            <h3>{0}</h3>
          </div>
        </div>
      </Card> */}

      {/* <Card className="shadow-sm">
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 text-2xl bg-red-500 rounded items-center justify-center flex">
            <MdEmail className="text-2xl text-white" />
          </span>
          <div>
            <span className="dark:text-white">
              Total de solicitudes rechazadas
            </span>
            <h3>{0}</h3>
          </div>
        </div>
      </Card> */}
    </div>
  )
}

export default Meta
