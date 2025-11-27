import { cx } from '../../utils'

const Badge: React.FC<{
  children: React.ReactNode
  tone?: 'default' | 'green' | 'yellow' | 'red' | 'sky' | 'slate'
  className?: string
}> = ({ children, tone = 'default', className }) => {
  const toneMap: Record<string, string> = {
    default: 'bg-slate-100 text-slate-700 ring-slate-200',
    green: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
    yellow: 'bg-amber-100 text-amber-800 ring-amber-200',
    red: 'bg-rose-100 text-rose-700 ring-rose-200',
    sky: 'bg-sky-100 text-sky-700 ring-sky-200',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1',
        toneMap[tone],
        className
      )}
    >
      {children}
    </span>
  )
}

export default Badge
