import { Property } from '../../types'
import Section from '../ui/Section'

const DescriptionSection = ({ property }: { property: Property }) => {
  return (
    <Section title="Descripción">
      <p className="whitespace-pre-line text-slate-700">
        {property.description || 'Sin descripción.'}
      </p>
    </Section>
  )
}

export default DescriptionSection
