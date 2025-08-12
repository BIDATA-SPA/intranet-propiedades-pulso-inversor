export type PaginateSearch = {
  search?: string
  page?: number
  limit?: number
  inExchange?: boolean
  sold?: boolean
  deRegistered?: boolean
  disabled?: boolean
  favorites?: boolean
  orderById?: 'asc' | 'desc'
  orderByPrice?: 'asc' | 'desc'
  currencyId?: ''
  typeServiceId?: number
}
