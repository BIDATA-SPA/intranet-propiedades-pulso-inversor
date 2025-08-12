import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { setPageIndex, setPageSize, useAppDispatch } from '../store'
import GridCard from './GridCard'

const PropertiesGrid: React.FC = () => {
  const dispatch = useAppDispatch()

  // Obtener las propiedades y el estado de carga desde el store
  const properties = useSelector(
    (state: RootState) => state.propertiesList.data.properties
  )
  const isLoading = useSelector(
    (state: RootState) => state.propertiesList.data.loading
  )

  // Obtener la metadata de paginación desde el store
  const { page, limit, totalItems } = useSelector(
    (state: RootState) => state.propertiesList.data
  )

  // Manejar el cambio de página
  const handlePaginationChange = (newPageIndex: number) => {
    dispatch(setPageIndex(newPageIndex))
  }

  // Manejar el cambio de tamaño de página
  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize))
  }

  const pageSizeOptions = [5, 10, 20, 50].map((size) => ({
    value: size,
    label: `${size} / Página`,
  }))

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {isLoading ? (
          <p>Cargando propiedades...</p>
        ) : (
          properties?.map((property) => (
            <GridCard key={property?.id} property={property} />
          ))
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <Pagination
          pageSize={limit}
          currentPage={page}
          total={totalItems}
          onChange={handlePaginationChange}
        />
        <Select
          size="sm"
          menuPlacement="top"
          isSearchable={false}
          value={pageSizeOptions.find((option) => option.value === limit)}
          options={pageSizeOptions}
          onChange={(option) => handlePageSizeChange(option?.value as number)}
        />
      </div>
    </div>
  )
}

export default PropertiesGrid
