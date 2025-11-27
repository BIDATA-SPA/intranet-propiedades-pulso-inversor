import type {
  ForgotPassword,
  ResetPassword,
  SignInCredential,
  SignInResponse,
  SignUpCredential,
  SignUpResponse,
} from '@/@types/auth'
import ApiService from './ApiService'

export async function apiSignIn(data: SignInCredential) {
  return ApiService.fetchData<SignInResponse>({
    url: '/auth/login',
    method: 'post',
    data,
  })
}

export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: '/users',
    method: 'post',
    data,
  })
}

export async function apiSignUpCustomer(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: '/customer-access',
    method: 'post',
    data,
  })
}

export async function apiSignUpWebinar(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: '/users/seminario',
    method: 'post',
    data,
  })
}

export async function apiSignOut() {
  return ApiService.fetchData({
    url: '/auth/logout',
    method: 'delete',
  })
}

export async function apiForgotPassword(data: ForgotPassword) {
  return ApiService.fetchData({
    url: '/forgot-password',
    method: 'post',
    data,
  })
}

export async function apiResetPassword(data: ResetPassword) {
  return ApiService.fetchData({
    url: '/reset-password',
    method: 'post',
    data,
  })
}
