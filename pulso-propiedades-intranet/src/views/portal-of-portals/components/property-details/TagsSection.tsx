import { Badge } from '@/components/ui'
import { Property } from '../../types'
import Section from '../ui/Section'

const TagsSection = ({ property }: { property: Property }) => {
  return (
    <Section
      title="Etiquetas"
      right={
        property.tags?.length ? (
          <Badge>{property.tags.length} ítems</Badge>
        ) : null
      }
    >
      {property.tags?.length ? (
        <ul className="flex flex-wrap gap-2">
          {property.tags.map((t, i) => (
            <li
              key={i}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200"
            >
              #{t}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-slate-500">Sin etiquetas.</div>
      )}
    </Section>
  )
}

export default TagsSection
