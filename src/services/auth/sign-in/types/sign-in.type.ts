type SignInData = {
  access_token: string
  expirationInSeconds: number
  type: number
  rol: number
}

// Body
export type SignInRequest = {
  username: string
  password: string
  grant_type: string
}

// Server response
export type SignInResponse =
  | { data: SignInData }
  | { error: { message: string | unknown } }
