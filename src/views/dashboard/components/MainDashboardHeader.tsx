import Button from '@/components/ui/Button'
import { useGetEventsQuery } from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { HiPlusCircle } from 'react-icons/hi'
import { Link } from 'react-router-dom'

type ProjectDashboardHeaderProps = {
  userName?: string
  taskCount?: number
}

const MainDashboardHeader = ({
  userName,
  taskCount,
}: ProjectDashboardHeaderProps) => {
  const { data } = useGetEventsQuery()
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  const [totalEvents, setTotalEvents] = useState(0)
  const [filtered, setFiltered] = useState('')

  useEffect(() => {
    if (Array.isArray(data)) {
      setTotalEvents(data.length)
    }
  }, [data])

  // const handleClickFilter = (filteredSelect: string) =>{
  //     setFiltered(filteredSelect);
  // };

  const today = new Date()

  const getStartEndOfWeek = () => {
    const startWeek = new Date(today) //inicia un domingo;
    startWeek.setDate(today.getDate() - today.getDay()) //inicia un domingo;

    const endWeek = new Date(today) //termina un sábado;
    endWeek.setDate(today.getDate() - today.getDay() + 6) //termina un sábado;

    return { startWeek, endWeek }
  }

  const getStartEndOfMonth = () => {
    // Eventos del mismo mes
    const startMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    return { startMonth, endMonth }
  }

  const filteredEvents = (filtro: string) => {
    const { startWeek, endWeek } = getStartEndOfWeek()
    const { startMonth, endMonth } = getStartEndOfMonth()
    if (!data) return 0
    switch (filtro) {
      case 'diaria':
        return data.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate.toDateString() === today.toDateString()
        }).length
      case 'semanal':
        return data.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= startWeek && eventDate <= endWeek
        }).length
      case 'mensual':
        return data.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= startMonth && eventDate <= endMonth
        }).length
      default:
        return data.filter((event) => {
          const eventDate = new Date(event.date)
          return eventDate >= startMonth && eventDate <= endMonth
        }).length
    }
  }

  return (
    <div className="py-2 flex justify-between items-center w-full">
      <div>
        <h4 className="text-lg lg:text-2xl">Hola, {userName}!</h4>
        {userAuthority === 3 ? null : (
          <p className="mt-1">
            Cuentas con {taskCount !== 0 ? filteredEvents(filtered) : '0'}{' '}
            eventos este mes
          </p>
        )}
      </div>

      {userAuthority === 3 && (
        <Link
          className="block lg:inline-block md:mb-0 mb-4"
          to="/mis-propiedades/crear-propiedad"
        >
          <Button block variant="solid" size="md" icon={<HiPlusCircle />}>
            Publicar Propiedad
          </Button>
        </Link>
      )}
    </div>
  )
}

export default MainDashboardHeader
