import format from 'date-fns/format'

export const formatDate = (date: Date | null, withTime = true) => {
  if (!date) return

  return withTime
    ? format(new Date(date), 'dd-MM-yyyy h:mm:ss a')
    : format(new Date(date), 'dd-MM-yyyy')
}
