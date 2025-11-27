import { Badge } from '@/components/ui'
import { Property } from '../../types'
import { capitalize } from '../../utils'
import Section from '../ui/Section'

const FeaturesSection = ({ property }: { property: Property }) => {
  return (
    <Section
      title="Características"
      right={
        property.features?.length ? (
          <Badge>{property.features.length} ítems</Badge>
        ) : null
      }
    >
      {property.features?.length ? (
        <ul className="flex flex-wrap gap-2">
          {property.features.map((f, i) => (
            <li
              key={i}
              className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700"
            >
              {capitalize(f)}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-slate-500">
          No se registran características.
        </div>
      )}
    </Section>
  )
}

export default FeaturesSection
