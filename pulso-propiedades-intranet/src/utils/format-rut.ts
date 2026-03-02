export const formatRut = (value: string): string => {
  // Eliminar cualquier caracter que no sea dígito o K/k
  const cleanedValue = value.replace(/[^0-9Kk]/g, '')

  // Extraer la parte numérica y el dígito verificador
  const rut = cleanedValue.slice(0, -1)
  const dv = cleanedValue.slice(-1).toUpperCase()

  // Formatear la parte numérica con puntos
  let formattedRut = ''
  for (let i = rut.length - 1, j = 1; i >= 0; i--, j++) {
    formattedRut = rut[i] + formattedRut
    if (j % 3 === 0 && i !== 0) {
      formattedRut = '.' + formattedRut
    }
  }

  // Añadir el dígito verificador
  const finalRut = `${formattedRut}-${dv}`

  // Limitar a 12 caracteres incluyendo puntos y guion
  return finalRut.length > 12 ? finalRut.slice(0, 12) : finalRut
}
