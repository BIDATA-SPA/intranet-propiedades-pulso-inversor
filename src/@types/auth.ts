import { TokenStatusEnum } from '@/enums/token-status.enum'
import { User } from '@/services/user/types/user.type'

export type SignInCredential = {
  username: string
  password: string
}

export type SignInResponse = {
  access_token: string
  refresh_token: string
  expirationInSeconds: number
  type: number
  rol: number
}

export type SignUpResponse = User

export type SignUpCredential = {
  name: string
  email: string
  phone: string
  password: string
}

export type ForgotPassword = {
  email: string
}

export type ResetPassword = {
  password: string
}

export type ValidateSessionResponse = {
  status: TokenStatusEnum
  expirationInSeconds: number
  type: number
}

export type ValidateSession = {
  at: string
}
