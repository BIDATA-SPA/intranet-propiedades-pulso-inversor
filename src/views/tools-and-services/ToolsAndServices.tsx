import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'
import { useGetAllRootFoldersQuery } from '@/services/RtkQueryService'
import ToolsAndServicesList from './components/ToolsAndServicesList'

const ToolsAndServices = () => {
  const { data, isLoading, isError, error, refetch } =
    useGetAllRootFoldersQuery({
      page: 1,
      limit: 10,
      paginated: false,
    })

  if (isLoading)
    return (
      <div className="w-100 h-screen flex justify-center items-center">
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
    <Container className="h-full">
      <AdaptableCard>
        <div className="w-full flex justify-start items-center">
          <h1 className="text-lg md:text-xl">Mis Recursos</h1>
        </div>
      </AdaptableCard>

      <ToolsAndServicesList itemsList={data} />
    </Container>
  )
}

export default ToolsAndServices
