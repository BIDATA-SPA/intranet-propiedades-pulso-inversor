import { Button } from '@/components/ui'
import useNotification from '@/utils/hooks/useNotification'
import { Property } from '../../types'
import { copyText, formatCLP, formatDate, formatUF } from '../../utils'
import Badge from '../ui/Badge'
import { BathIcon, BedIcon, CarIcon } from '../ui/Icons'
import StatItem from '../ui/StatItem'

const SidebarCard: React.FC<{ property: Property }> = ({ property }) => {
  const { showNotification } = useNotification()

  const portal = property.portal?.replace(/-/g, ' ')

  return (
    <aside className="sticky top-6 space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge tone="sky">{property.listing_type.toUpperCase()}</Badge>
          <Badge tone="slate">{property.property_type}</Badge>
          {/* <Badge
            tone={
              property.status === 'available'
                ? 'green'
                : property.status === 'reserved'
                ? 'yellow'
                : 'red'
            }
          >
            {property.status}
          </Badge> */}
        </div>
        <div className="mb-4">
          <div className="text-3xl font-bold tracking-tight text-slate-900">
            {formatCLP(property.price_clp)}
          </div>
          <div className="text-sm text-slate-500">
            {formatUF(property.price_uf)}
          </div>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2">
          <StatItem
            label="Dorm."
            value={property.bedrooms ?? '—'}
            icon={<BedIcon />}
          />
          <StatItem
            label="Baños"
            value={property.bathrooms ?? '—'}
            icon={<BathIcon />}
          />
          <StatItem
            label="Estac."
            value={property.parking ?? '—'}
            icon={<CarIcon />}
          />
        </div>
        <Button
          variant="solid"
          className="mb-2 w-full rounded-xl bg-slate-900 px-4 py-2.5 text-white hover:bg-slate-800"
          onClick={() => {
            copyText(property.external_url || window.location.href)
            showNotification('success', 'Enlace Copiado', '')
          }}
        >
          Copiar enlace
        </Button>
        {property.external_url && (
          <a
            href={property.external_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex font-semibold w-full items-center justify-center rounded-lg border border-slate-300 bg-lime-500 text-white px-4 py-2 hover:bg-sky-600"
          >
            <div className="flex items-center">
              <img
                src="/img/logo/logo-light-streamline.png"
                className="w-7 h-7"
              />
              <span className="ml-1">Ver publicación en Portal</span>
            </div>
          </a>
        )}
        <div className="mt-4 text-xs text-slate-500">
          <div>
            Portal: <span className="font-medium capitalize">{portal}</span>
          </div>
          <div>
            Código: <span className="font-medium">{property.code || '—'}</span>
          </div>
          <div>
            Actualizada:{' '}
            <span className="font-medium">
              {formatDate(property.updated_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">
          Contacto
        </h3>
        <div className="mb-4 text-sm text-slate-600">
          <div className="font-medium">{property.broker?.name || 'Agente'}</div>
          <div>{property.broker?.phone || '—'}</div>
          <div className="truncate">{property.broker?.email || '—'}</div>
        </div>
        {/* <button className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-white hover:bg-emerald-700">
          Contactar
        </button> */}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-semibold text-slate-900">
          Metadatos
        </h3>
        <ul className="space-y-2 text-xs text-slate-600">
          <li>
            <span className="text-slate-500">UUID:</span>{' '}
            <span className="font-mono">{property.uuid}</span>
          </li>
          <li>
            <span className="text-slate-500">Consolidated ID:</span>{' '}
            <span className="font-mono">{property.consolidated_id}</span>
          </li>
          <li>
            <span className="text-slate-500">Consolidated:</span>{' '}
            {property.consolidated_status}
          </li>
          <li>
            <span className="text-slate-500">Publicado:</span>{' '}
            {formatDate(property.published_at)}
          </li>
          <li>
            <span className="text-slate-500">Scraped:</span>{' '}
            {formatDate(property.scraped_at)}
          </li>
          <li>
            <span className="text-slate-500">Creado:</span>{' '}
            {formatDate(property.created_at)}
          </li>
        </ul>
      </div>
    </aside>
  )
}

export default SidebarCard
