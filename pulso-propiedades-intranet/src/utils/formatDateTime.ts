export const formatDateTime = (createdAt) => {
  const daysOfWeek = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ]
  const monthsOfYear = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ]

  const createdDate = new Date(createdAt)
  const now = new Date()

  const timeDifference = now.getTime() - createdDate.getTime()
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60))
  const isSameDay = now.toDateString() === createdDate.toDateString()

  if (isSameDay && hoursDifference < 24) {
    return hoursDifference === 0
      ? 'Hace menos de 1 hora'
      : `Hace ${hoursDifference} hora${hoursDifference > 1 ? 's' : ''}`
  } else {
    const dayOfWeek = daysOfWeek[createdDate.getDay()]
    const day = String(createdDate.getDate()).padStart(2, '0')
    const month = monthsOfYear[createdDate.getMonth()]
    const year = createdDate.getFullYear()

    const hours = createdDate.getHours()
    const minutes = String(createdDate.getMinutes()).padStart(2, '0')
    const period = hours >= 12 ? 'pm' : 'am'
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12

    return `${dayOfWeek} ${day} de ${month} de ${year} a las ${formattedHours}:${minutes}${period}`
  }
}
