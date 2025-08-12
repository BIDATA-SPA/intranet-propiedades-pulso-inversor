import { Select as SelectType } from '@/@types/select'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'

const pageSizeOption: SelectType[] = [
  { value: 5, label: '5 por página' },
  { value: 10, label: '10 por página' },
  { value: 20, label: '20 por página' },
  { value: 50, label: '50 por página' },
]

const PaginationBottom = ({
  currentPage,
  total,
  pageSize,
  onChange,
  onPageSelect,
}) => {
  return (
    <>
      <Pagination
        currentPage={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
      />
      <div style={{ minWidth: 120 }}>
        <Select
          size="sm"
          isSearchable={false}
          defaultValue={pageSizeOption[0]}
          options={pageSizeOption}
          onChange={(selected) => onPageSelect(selected as SelectType)}
        />
      </div>
    </>
  )
}

export default PaginationBottom
