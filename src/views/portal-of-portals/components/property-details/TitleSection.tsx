import { useMemo } from 'react'
import { capitalize } from '../../utils'
import { MapPinIcon } from '../ui/Icons'

const TitleSection = ({ property }) => {
  const fullTitle =
    property.title ||
    `${capitalize(property.property_type)} en ${
      property.location?.commune || property.location?.city || ''
    }`

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
    <div className="mb-6">
      <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
        {fullTitle}
      </h1>
      <div className="flex flex-wrap items-center gap-2 text-slate-600">
        <MapPinIcon />
        <span className="text-sm">{addressLine}</span>
      </div>
    </div>
  )
}

export default TitleSection
