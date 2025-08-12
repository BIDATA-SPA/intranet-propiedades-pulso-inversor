export type TDialogIds = {
  contactExternalService: string
}

export type FormModel = {
  to: string
  customerId: number | null
  externalServiceId: number
  realtorFrom: string
  subject: string
  message: string
}

export type ServerError = {
  error: {
    message: string | unknown
  }
}
