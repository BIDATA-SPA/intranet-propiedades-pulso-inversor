import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useState } from 'react'
import { Thumb } from './EmblaCarouselThumbsButton'
import imageByIndex from './ImageByIndex'

type PropType = {
  slides: number[]
  options?: EmblaOptionsType
  images?: { id: string; path: string; number: number }[]
  onClose?: () => void
}

const EmblaCarousel: React.FC<PropType> = ({
  slides,
  options,
  images,
  onClose,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  })

  const notFoundImagePath = '/img/not-found/not-found-image.png'

  const _imagesSrc: string[] = images?.map((image) => image?.path) || [
    notFoundImagePath,
  ]

  const onThumbClick = useCallback(
    (index: number) => {
      if (!emblaMainApi || !emblaThumbsApi) return
      emblaMainApi.scrollTo(index)
    },
    [emblaMainApi, emblaThumbsApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbsApi) return
    setSelectedIndex(emblaMainApi.selectedScrollSnap())
    emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaMainApi) return
    onSelect()
    emblaMainApi.on('select', onSelect)
    emblaMainApi.on('reInit', onSelect)
  }, [emblaMainApi, onSelect])

  return (
    <>
      {!images || images.length === 0 ? (
        <div className="flex flex-col">
          <p className="w-full text-center text-white">
            Esta propiedad no cuenta con imágenes publicadas.
          </p>
          <button
            type="button"
            className="my-2 w-1/6 mx-auto p-2 hover:underline text-white"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      ) : (
        <div className="embla">
          <div ref={emblaMainRef} className="embla__viewport">
            <div className="embla__container">
              {slides &&
                slides.length > 0 &&
                slides?.map((index) => (
                  <div key={index} className="embla__slide">
                    <div className="embla__slide__number">
                      <span>{index + 1}</span>
                    </div>
                    <img
                      className="embla__slide__img"
                      src={imageByIndex(index, _imagesSrc)} // images
                      alt="Your alt text"
                    />
                  </div>
                ))}
            </div>
          </div>

          <div className="embla-thumbs">
            <div ref={emblaThumbsRef} className="embla-thumbs__viewport">
              <div className="embla-thumbs__container">
                {slides.map((index) => (
                  <Thumb
                    key={index}
                    selected={index === selectedIndex}
                    index={index}
                    imgSrc={imageByIndex(index, _imagesSrc)} // images
                    onClick={() => onThumbClick(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default EmblaCarousel
