export type Colors =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | string

type ColorOption = {
  value: Colors
  label: string
  color: string
}

export const colorOptions: ColorOption[] = [
  {
    value: 'red',
    label: 'rojo',
    color: 'bg-red-500',
  },
  {
    value: 'orange',
    label: 'naranja',
    color: 'bg-orange-500',
  },
  {
    value: 'amber',
    label: 'ámbar',
    color: 'bg-amber-500',
  },
  {
    value: 'yellow',
    label: 'amarillo',
    color: 'bg-yellow-500',
  },
  {
    value: 'lime',
    label: 'lima',
    color: 'bg-lime-500',
  },
  {
    value: 'green',
    label: 'verde',
    color: 'bg-green-500',
  },
  {
    value: 'emerald',
    label: 'esmeralda',
    color: 'bg-emerald-500',
  },
  {
    value: 'teal',
    label: 'verde azulado',
    color: 'bg-teal-500',
  },
  {
    value: 'cyan',
    label: 'cian',
    color: 'bg-cyan-500',
  },
  {
    value: 'sky',
    label: 'cielo',
    color: 'bg-lime-500',
  },
  {
    value: 'blue',
    label: 'azul',
    color: 'bg-blue-500',
  },
  {
    value: 'indigo',
    label: 'índigo',
    color: 'bg-indigo-500',
  },
  {
    value: 'purple',
    label: 'morado',
    color: 'bg-purple-500',
  },
  {
    value: 'fuchsia',
    label: 'fucsia',
    color: 'bg-fuchsia-500',
  },
  {
    value: 'pink',
    label: 'rosa',
    color: 'bg-pink-500',
  },
  {
    value: 'rose',
    label: 'rosado',
    color: 'bg-rose-500',
  },
]
