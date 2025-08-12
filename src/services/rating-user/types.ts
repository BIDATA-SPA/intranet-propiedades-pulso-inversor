export type RatingUser = {
  comment: string
  rating: number
  userId: number
}

export type RatingUserByCustomer = RatingUser & {
  customerId: number
}

export type RatingUserSendEmail = {
  mail: string
  cc: string[]
  subject: string
  link: string
}
