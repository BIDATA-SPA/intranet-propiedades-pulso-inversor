import { useMemo } from 'react'
import { Property } from '../../types'
import { CompassIcon, MapPinIcon } from '../ui/Icons'
import Section from '../ui/Section'

const LocationSection = ({ property }: { property: Property }) => {
  const addressLine = useMemo(() => {
    const L = property.location
    if (!L) return 'Ubicación no disponible'
    const parts = [
      L.address,
      L.neighborhood,
      L.commune,
      L.city,
      L.region,
    ].filter(Boolean)
    return parts.join(', ')
  }, [property.location])

  return (
    <Section title="Ubicación">
      <div className="flex flex-col gap-3 text-sm text-slate-700">
        <div className="flex items-center gap-2">
          <MapPinIcon />
          <span>{addressLine}</span>
        </div>
        <div className="flex items-center gap-2">
          <CompassIcon />
          <span>
            Coordenadas: {property.location?.lat ?? '—'},{' '}
            {property.location?.lng ?? '—'}
          </span>
        </div>
      </div>
    </Section>
  )
}

export default LocationSection
