import { Button, Tooltip } from '@/components/ui'
import Input from '@/components/ui/Input'
import { RootState, useAppSelector } from '@/store'
import debounce from 'lodash/debounce'
import type { ChangeEvent } from 'react'
import { useRef } from 'react'
import { HiOutlineSearch, HiViewList } from 'react-icons/hi'
import { HiOutlineSquares2X2 } from 'react-icons/hi2'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../store'
import { setFilters, toggleViewMode } from '../store/aliedRealtorSlice'

const AliedRealtorTableTools = () => {
  const dispatch = useAppDispatch()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { filters } = useAppSelector((state) => state.aliedRealtorList.data)

  const viewMode = useSelector(
    (state: RootState) => state.aliedRealtorList.data.viewMode
  )

  const debounceSearch = debounce((value: string) => {
    dispatch(setFilters({ search: value }))
  }, 300)

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    debounceSearch(e.target.value)
  }

  const handleToggleView = () => {
    dispatch(toggleViewMode())
  }

  return (
    <div className="lg:flex items-center justify-between mb-4 gap-3">
      <Tooltip title={viewMode === 'list' ? 'Lista' : 'Grilla'}>
        <Button
          size="sm"
          icon={viewMode === 'list' ? <HiViewList /> : <HiOutlineSquares2X2 />}
          onClick={handleToggleView}
        ></Button>
      </Tooltip>

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
