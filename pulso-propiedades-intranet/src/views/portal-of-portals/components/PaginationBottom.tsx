// src/components/portal/PaginationBottom.tsx
import classNames from 'classnames'
import React, { useMemo } from 'react'

type SelectOption = { value: number; label: string }

type Props = {
  currentPage: number
  total?: number | null
  pageSize: number
  onChange: (page: number) => void
  onPageSelect: (opt: SelectOption) => void
  pageSizeOptions?: number[]
  className?: string
}

const PaginationBottom: React.FC<Props> = ({
  currentPage,
  total = 0,
  pageSize,
  onChange,
  onPageSelect,
  pageSizeOptions = [5, 10, 20, 50],
  className,
}) => {
  const totalPages = useMemo(() => {
    if (!total || total <= 0) return Math.max(1, currentPage) // si no tenemos total, evita 0
    return Math.max(1, Math.ceil(total / pageSize))
  }, [total, pageSize, currentPage])

  const start = useMemo(() => {
    if (!total || total <= 0) return (currentPage - 1) * pageSize + 1
    return Math.min((currentPage - 1) * pageSize + 1, total)
  }, [currentPage, pageSize, total])

  const end = useMemo(() => {
    if (!total || total <= 0) return currentPage * pageSize
    return Math.min(currentPage * pageSize, total)
  }, [currentPage, pageSize, total])

  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  const goFirst = () => canPrev && onChange(1)
  const goPrev = () => canPrev && onChange(currentPage - 1)
  const goNext = () => canNext && onChange(currentPage + 1)
  const goLast = () => canNext && onChange(totalPages)

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = Number(e.target.value)
    onPageSelect({ value, label: `${value} por página` })
  }

  return (
    <div
      className={classNames(
        'flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {/* Info */}
      <div className="text-sm text-slate-600">
        {total && total > 0 ? (
          <>
            Mostrando <span className="font-semibold">{start}</span>–
            <span className="font-semibold">{end}</span> de{' '}
            <span className="font-semibold">{total}</span>
          </>
        ) : (
          <>
            Página <span className="font-semibold">{currentPage}</span>
          </>
        )}
      </div>

      {/* Controles */}
      <div className="flex items-center gap-2">
        <button
          disabled={!canPrev}
          className={classNames(
            'rounded-md border px-2 py-1 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-label="Primera página"
          title="Primera página"
          onClick={goFirst}
        >
          «
        </button>
        <button
          disabled={!canPrev}
          className="rounded-md border px-2 py-1 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Página anterior"
          title="Página anterior"
          onClick={goPrev}
        >
          ‹
        </button>

        <span className="min-w-[7rem] text-center text-sm text-slate-700">
          Página <span className="font-semibold">{currentPage}</span> de{' '}
          <span className="font-semibold">{totalPages}</span>
        </span>

        <button
          disabled={!canNext}
          className="rounded-md border px-2 py-1 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Página siguiente"
          title="Página siguiente"
          onClick={goNext}
        >
          ›
        </button>
        <button
          disabled={!canNext}
          className="rounded-md border px-2 py-1 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Última página"
          title="Última página"
          onClick={goLast}
        >
          »
        </button>

        {/* Page size */}
        <div className="ml-2 flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm text-slate-600">
            Por página:
          </label>
          <select
            id="page-size"
            className="rounded-md border px-2 py-1 text-sm"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default PaginationBottom
