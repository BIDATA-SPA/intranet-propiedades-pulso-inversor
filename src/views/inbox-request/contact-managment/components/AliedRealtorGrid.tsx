import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { setPageIndex, setPageSize, useAppDispatch } from '../store'
import GridCard from './GridCard'

const AliedRealtorGrid: React.FC = () => {
  const dispatch = useAppDispatch()

  const { page, limit, totalItems, requests } = useSelector(
    (state: RootState) => state.aliedRealtorRequestList.data
  )

  const handlePaginationChange = (newPageIndex: number) => {
    dispatch(setPageIndex(newPageIndex))
  }

  const handlePageSizeChange = (newPageSize: number) => {
    dispatch(setPageSize(newPageSize))
  }

  const pageSizeOptions = [5, 10, 20, 50].map((size) => ({
    value: size,
    label: `${size} / Página`,
  }))

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
        {requests?.map((realtor) => (
          <GridCard key={realtor?.id} realtor={realtor} />
        ))}
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

export default AliedRealtorGrid
