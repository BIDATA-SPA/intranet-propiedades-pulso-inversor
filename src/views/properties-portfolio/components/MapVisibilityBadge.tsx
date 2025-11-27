import { LuGlobe2, LuMapPin, LuSparkles } from 'react-icons/lu'

type MapVisibilityBadgeProps = {
  className?: string
  onCtaClick?: () => void
}

export default function MapVisibilityBadge({
  className = '',
  onCtaClick,
}: MapVisibilityBadgeProps) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-xl border',
        'border-sky-200/70 bg-gradient-to-br from-sky-50/70 via-white to-sky-50/40',
        'shadow-sm',
        className,
      ].join(' ')}
      role="status"
      aria-live="polite"
    >
      {/* Borde superior acento */}
      <div className="h-1 w-full bg-gradient-to-r from-sky-600 via-lime-500 to-cyan-400" />

      <div className="flex items-start gap-3 p-4">
        {/* Icono principal */}
        <div className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white shadow-sm">
          <LuMapPin className="h-5 w-5" />
        </div>

        <div className="flex-1">
          {/* Título */}
          <h4 className="mb-1 text-sm font-semibold text-slate-900">
            Potencia tu publicación fijando la ubicación en el mapa
          </h4>

          {/* Texto persuasivo */}
          <p className="text-xs leading-5 text-slate-600">
            Activa una{' '}
            <span className="font-medium text-slate-800">
              búsqueda más eficiente
            </span>{' '}
            en Pulso Propiedades y en el Portal de Portales. Al indicar la
            ubicación,{' '}
            <span className="font-semibold text-slate-800 underline">
              aumentas la visibilidad
            </span>{' '}
            y puedes aparecer entre los primeros resultados de búsqueda en ambas
            plataformas.
          </p>

          {/* Badges de beneficios */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-medium text-sky-700">
              <LuSparkles className="h-3.5 w-3.5" />
              Mejor ranking en resultados
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 px-2.5 py-1 text-[11px] font-medium text-cyan-700">
              <LuGlobe2 className="h-3.5 w-3.5" />
              Mayor alcance en Portales
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
              <LuMapPin className="h-3.5 w-3.5" />
              Geolocalización precisa
            </span>
          </div>

          {/* CTA opcional */}
          <div className="mt-3">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-1"
              onClick={onCtaClick}
            >
              Indicar ubicación ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
