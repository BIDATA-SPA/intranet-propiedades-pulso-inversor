export type Country = {
  id: number
  name: string
}

export type Cities = {
  id: number
  name: string
}

export type States = {
  id: number
  name: string
  cities: Cities[]
}
