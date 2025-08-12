import { useGetAllExternalServicesQuery } from '@/services/RtkQueryService'
import { useAppSelector } from '../store'
import ExternalServiceItem from './ExternalServiceItem'

const ExternalServicesList = () => {
  const view = useAppSelector((state) => state.serviceList.view)
  const { data: externalServiceFolders, isFetching } =
    useGetAllExternalServicesQuery({
      paginated: false,
      search: '',
    })

  const renderedFolders =
    !isFetching &&
    externalServiceFolders &&
    externalServiceFolders?.length > 0 ? (
      externalServiceFolders?.map((folder) => (
        <ExternalServiceItem key={folder.id} item={folder} />
      ))
    ) : (
      <p>Aún no hay servicios disponibles.</p>
    )

  if (isFetching) {
    return <p>Cargando servicios...</p>
  }

  return (
    <ul
      className={`${
        view === 'grid'
          ? 'lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
          : view === 'list'
          ? 'grid-cols-1'
          : ''
      } grid gap-4 mt-4`}
    >
      {renderedFolders}
    </ul>
  )
}

export default ExternalServicesList
