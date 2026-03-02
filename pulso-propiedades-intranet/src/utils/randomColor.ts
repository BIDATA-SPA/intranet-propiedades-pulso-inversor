export const DEFAULT_TAILWIND_COLORS = [
  'bg-red-600',
  'bg-blue-600',
  'bg-green-600',
  'bg-orange-600',
  'bg-purple-600',
  'bg-pink-600',
  'bg-indigo-600',
  'bg-lime-600',
  'bg-gray-600',
  'bg-sky-600',
  'bg-rose-600',
]

type RandomBackgroundColorArgs = {
  colors?: string[]
}

// Función para obtener un color aleatorio
export const getRandomBackgroundColor = ({
  colors = DEFAULT_TAILWIND_COLORS,
}: RandomBackgroundColorArgs): string => {
  if (!colors.length) {
    throw new Error('El arreglo de colores no puede estar vacío.')
  }
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}
