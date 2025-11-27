import { Property } from '../../types'
import { copyText } from '../../utils'
import Section from '../ui/Section'

const ShareSection = ({ property }: { property: Property }) => {
  return (
    <Section title="Compartir">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50"
          onClick={() => copyText(window.location.href)}
        >
          Copiar enlace
        </button>
        {property?.external_url && (
          <a
            href={property.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-800"
          >
            Ver publicación externa
          </a>
        )}
      </div>
    </Section>
  )
}

export default ShareSection
