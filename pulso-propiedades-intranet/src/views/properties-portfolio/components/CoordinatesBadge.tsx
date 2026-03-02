type CoordinatesBadgeProps = {
  lat?: string | number | null
  lng?: string | number | null
  className?: string
}

export default function CoordinatesBadge({
  lat,
  lng,
  className = '',
}: CoordinatesBadgeProps) {
  const hasCoords =
    lat !== '' &&
    lat !== null &&
    lat !== undefined &&
    lng !== '' &&
    lng !== null &&
    lng !== undefined

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {!hasCoords ? (
        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
          Sin coordenadas establecidas.
        </span>
      ) : (
        <>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            Latitud: {String(lat)}
          </span>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            Longitud: {String(lng)}
          </span>
        </>
      )}
    </div>
  )
}
