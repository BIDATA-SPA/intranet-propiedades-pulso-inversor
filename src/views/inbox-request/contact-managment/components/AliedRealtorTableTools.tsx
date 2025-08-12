import { Button } from '@/components/ui'
import Input from '@/components/ui/Input'
import { RootState, useAppSelector } from '@/store'
import debounce from 'lodash/debounce'
import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import { HiOutlineSearch } from 'react-icons/hi'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../store'
import { setFilters, setFilterType } from '../store/aliedRealtorRequestSlice'

const AliedRealtorTableTools = () => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { filters } = useAppSelector(
    (state) => state.aliedRealtorRequestList.data
  )

  // const viewMode = useSelector(
  //   (state: RootState) => state.aliedRealtorRequestList.data.viewMode
  // )

  const loading = useSelector(
    (state: RootState) => state.aliedRealtorRequestList.data.loading
  )

  const debounceSearch = debounce((value: string) => {
    dispatch(setFilters({ search: value }))
  }, 300)

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value)
  }

  // const handleToggleView = () => {
  //   dispatch(toggleViewMode())
  // }

  const handleFilterChange = (type: string) => {
    dispatch(setFilterType(type))
  }

  return (
    <div className="lg:flex items-center justify-between mb-4 gap-3">
      <div className="flex justify-end items-center gap-3 p-2 lg:p-0">
        {/* <Tooltip title={viewMode === 'list' ? 'Lista' : 'Grilla'}>
          <Button
            size="sm"
            icon={
              viewMode === 'list' ? <HiViewList /> : <HiOutlineSquares2X2 />
            }
            onClick={handleToggleView}
          ></Button>
        </Tooltip> */}

        <Button
          loading={loading}
          size="sm"
          variant={filters.filterType === 'all' ? 'solid' : 'outline'}
          onClick={() => handleFilterChange('all')}
        >
          Todos
        </Button>
        <Button
          loading={loading}
          size="sm"
          variant={filters.filterType === 'sent' ? 'solid' : 'outline'}
          onClick={() => handleFilterChange('sent')}
        >
          Enviados
        </Button>
        <Button
          loading={loading}
          size="sm"
          variant={filters.filterType === 'received' ? 'solid' : 'outline'}
          onClick={() => handleFilterChange('received')}
        >
          Recibidos
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-2">
        <Input
          ref={inputRef}
          size="sm"
          placeholder="Buscar corredores..."
          prefix={<HiOutlineSearch className="text-lg" />}
          defaultValue={filters.search}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  )
}

export default AliedRealtorTableTools
