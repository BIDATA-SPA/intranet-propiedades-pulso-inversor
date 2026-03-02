const Section: React.FC<{
  title: string
  right?: React.ReactNode
  children: React.ReactNode
  id?: string
}> = ({ title, right, children, id }) => (
  <section
    id={id}
    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
  >
    <div className="mb-4 flex items-start justify-between gap-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {right}
    </div>
    {children}
  </section>
)

export default Section
