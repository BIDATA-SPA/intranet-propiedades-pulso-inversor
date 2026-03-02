import { useState } from 'react'
import { cx } from '../../utils'
import { ChevronLeftIcon, ChevronRightIcon } from '../ui/Icons'

const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [index, setIndex] = useState(0)
  const hasImages = images && images.length > 0

  const safeImages = hasImages ? images : []

  const prev = () =>
    setIndex((i) => (i - 1 + safeImages.length) % safeImages.length)
  const next = () => setIndex((i) => (i + 1) % safeImages.length)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
      <img
        src={safeImages[index]}
        alt={`Imagen ${index + 1}`}
        className="h-[360px] w-full object-cover sm:h-[420px]"
      />
      <button
        aria-label="Anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2 backdrop-blur hover:bg-white"
        onClick={prev}
      >
        <ChevronLeftIcon />
      </button>
      <button
        aria-label="Siguiente"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/60 bg-white/80 p-2 backdrop-blur hover:bg-white"
        onClick={next}
      >
        <ChevronRightIcon />
      </button>
      <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {safeImages.map((_, i) => (
          <span
            key={i}
            className={cx(
              'h-1.5 w-6 rounded-full',
              i === index ? 'bg-white' : 'bg-white/60'
            )}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageGallery
