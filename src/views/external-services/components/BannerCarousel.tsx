import { useGetAllBannersQuery } from '@/services/RtkQueryService'
import { useEffect, useState } from 'react'

const BannerCarousel = () => {
  const { data, error, isLoading } = useGetAllBannersQuery({})
  const banners = data?.data || []
  const activeBanners = banners.filter((banner) => banner.isActive)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % activeBanners.length)
        setIsFading(false)
      }, 3000)
    }, 5000)

    return () => clearInterval(interval)
  }, [activeBanners.length])

  if (isLoading) return <div>Cargando imagenes...</div>
  if (error) return <div>Error al obtener las imagenes!</div>

  return banners?.length > 0 ? (
    <div className="w-full mx-auto mt-10 relative overflow-hidden border-4 dark:border-gray-600 border-gray-100 rounded-lg">
      <div className="w-full h-[150px] sm:h-[170px] md:h-[250px] relative">
        {activeBanners.map((banner, index) => (
          <div
            key={banner?.id}
            className={`absolute rounded-lg w-full h-full transition-opacity duration-[2000ms] ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <a href={banner?.linkUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={banner?.imageUrl}
                alt={banner?.title}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  ) : null
}

export default BannerCarousel
