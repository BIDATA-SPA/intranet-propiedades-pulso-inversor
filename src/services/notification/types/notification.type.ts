export type Notification = {
  id: string
  title: string
  description: string
  openAt: Date
  createdAt: Date

  user: { id: string; name: string; lastName: string }
}
