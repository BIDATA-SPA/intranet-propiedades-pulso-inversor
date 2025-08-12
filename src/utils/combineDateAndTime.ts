import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const combineDateAndTime = (
  date: Date | string,
  time: string
): string => {
  const parsedDate = dayjs(date)

  if (!parsedDate.isValid()) {
    throw new Error(`Invalid date: ${date}`)
  }

  // Si time es una fecha en formato ISO, extrae la hora
  const parsedTime = dayjs(time)
  const [hours, minutes] = parsedTime.isValid()
    ? [parsedTime.hour(), parsedTime.minute()]
    : time.split(':').map(Number)

  // Combina la fecha y hora
  return parsedDate
    .hour(hours)
    .minute(minutes)
    .second(0)
    .millisecond(0)
    .utc()
    .toISOString()
}

// import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'

// dayjs.extend(utc)

// export const combineDateAndTime = (
//   date: Date | string,
//   time: string
// ): string => {
//   // Asegura que la fecha sea válida
//   const parsedDate = dayjs(date)

//   if (!parsedDate.isValid()) {
//     throw new Error(`Invalid date: ${date}`)
//   }

//   // Valida que la hora sea una cadena con formato HH:mm
//   if (!/^\d{2}:\d{2}$/.test(time)) {
//     throw new Error(`Invalid time format: ${time}`)
//   }

//   // Divide la hora en horas y minutos
//   const [hours, minutes] = time.split(':').map(Number)

//   // Combina fecha y hora, asegurando el formato ISO 8601 en UTC
//   const result = parsedDate
//     .hour(hours) // Establece las horas
//     .minute(minutes) // Establece los minutos
//     .second(0) // Setea los segundos a 0
//     .millisecond(0) // Setea los milisegundos a 0
//     .utc() // Convierte a UTC
//     .toISOString() // Retorna la cadena en formato ISO 8601

//   return result
// }

// // import dayjs from 'dayjs'
// // import utc from 'dayjs/plugin/utc'

// // dayjs.extend(utc)

// // export const combineDateAndTime = (
// //   date: Date | string,
// //   time: string
// // ): string => {
// //   // Asegura que la fecha sea un objeto Date
// //   const parsedDate = dayjs(date)

// //   // Divide la hora en horas y minutos
// //   const [hours, minutes] = time.split(':').map(Number)

// //   // Combina fecha y hora, asegurando el formato ISO 8601 en UTC
// //   return parsedDate
// //     .hour(hours) // Establece las horas
// //     .minute(minutes) // Establece los minutos
// //     .second(0) // Setea los segundos a 0
// //     .millisecond(0) // Setea los milisegundos a 0
// //     .utc() // Convierte a UTC
// //     .toISOString() // Retorna la cadena en formato ISO 8601
// // }
