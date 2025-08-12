export type InitialData = {
  requestId: number | null
  statusId: number | null
}

export type UserId = {
  id: number
}

export type InitialRating = {
  comment: string
  rating: number
  userId: UserId['id']
}
