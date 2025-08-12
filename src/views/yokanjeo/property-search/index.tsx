import { Select as SelectType } from '@/@types/select'
import { Button } from '@/components/ui/Button'
import Tooltip from '@/components/ui/Tooltip'
import {
  useGetAllPropertiesSearchQuery,
  useGetPropertySearchMetadataQuery,
} from '@/services/RtkQueryService'
import { useState } from 'react'
import { HiViewList } from 'react-icons/hi' // Tabla
import { HiOutlineSquares2X2 } from 'react-icons/hi2' // Grilla
import { useSearchParams } from 'react-router-dom'
import DrawerComponent from './components/DrawerComponent'
import GridCard from './components/PropertiesGridCard'
import PropertiesSearchMeta from './components/PropertiesSearchMeta'
import PropertiesTable from './components/PropertiesTable'
import useDrawer from './hooks/useDrawer'

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const PropertyMailbox = () => {
  const { isDrawerOpen, openDrawer, closeDrawer } = useDrawer()
  const [currentProperty, setCurrentProperty] = useState(null)
  const [customerSearchMatches, setCustomerSearchMatches] = useState([])
  const [searchParams] = useSearchParams()
  const [search] = useState(searchParams.get('search') || '')
  const [pageSize, setPageSize] = useState(pageSizeOption[0].value)
  const [currentPage, setCurrentPage] = useState(+searchParams.get('page') || 1)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const { data, isLoading, isError, error } = useGetAllPropertiesSearchQuery(
    {
      page: currentPage || 1,
      limit: pageSize,
      ...(search && { search }),
    },
    {
      refetchOnMountOrArgChange: true,
    }
  )

  const {
    data: metaData,
    isLoading: metaDataIsLoading,
    isError: metaDataIsError,
    error: metadataError,
  } = useGetPropertySearchMetadataQuery()

  const onDrawerOpen = (property) => {
    openDrawer()
    setCurrentProperty(property)
    setCustomerSearchMatches(property?.customer_search_matches)
  }

  const onDrawerClose = () => {
    closeDrawer()
    setCurrentProperty(null)
    setCustomerSearchMatches([])
  }

  const toggleView = () => {
    setViewMode(viewMode === 'table' ? 'grid' : 'table')
  }

  return (
    <>
      <h3 className="mb-4">Buzón de Propiedades</h3>

      <PropertiesSearchMeta
        isLoading={metaDataIsLoading}
        isError={metaDataIsError}
        errorMessage={metadataError}
        totalItems={metaData?.matchingProperties}
        approvedItems={metaData?.matchingPropertiesActives}
        rejectedItem={metaData?.matchingPropertiesNoActive}
      />

      <div className="flex justify-end mb-4">
        <Tooltip title={viewMode === 'table' ? 'Grilla' : 'Lista'}>
          <Button
            size="sm"
            icon={
              viewMode === 'table' ? (
                <HiOutlineSquares2X2 className="w-5 h-8" />
              ) : (
                <HiViewList className="w-5 h-8" />
              )
            }
            className="sm:w-[40px]"
            onClick={toggleView}
          />
        </Tooltip>
      </div>

      {viewMode === 'table' ? (
        <PropertiesTable
          setCustomerSearchMatches={setCustomerSearchMatches}
          setCurrentProperty={setCurrentProperty}
          data={data?.data}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onDrawerOpen={onDrawerOpen}
        />
      ) : (
        <GridCard
          properties={data?.data}
          isLoading={isLoading}
          isError={isError}
          error={error}
          onDrawerOpen={onDrawerOpen}
        />
      )}

      {isDrawerOpen && (
        <DrawerComponent
          isOpen={isDrawerOpen}
          customerSearchMatches={customerSearchMatches}
          currentProperty={currentProperty}
          onDrawerClose={onDrawerClose}
        />
      )}
    </>
  )
}

export default PropertyMailbox
