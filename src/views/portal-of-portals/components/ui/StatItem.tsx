const StatItem: React.FC<{
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
}> = ({ label, value, icon }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
    <div className="shrink-0">{icon}</div>
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-base font-semibold text-slate-900">{value}</div>
    </div>
  </div>
)

export default StatItem
