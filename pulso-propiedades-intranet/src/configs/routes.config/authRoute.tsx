import type { Routes } from '@/@types/routes'
import { lazy } from 'react'

const authRoute: Routes = [
  {
    key: 'signIn',
    path: `/iniciar-sesion`,
    component: lazy(() => import('@/views/auth/SignIn')),
    authority: [],
  },
  {
    key: 'signUp',
    path: `/crear-cuenta/:referralCode?`,
    component: lazy(() => import('@/views/auth/SignUp')),
    authority: [],
  },
  {
    key: 'forgotPassword',
    path: `/recuperar-contraseña`,
    component: lazy(() => import('@/views/auth/ForgotPassword')),
    authority: [],
  },
  {
    key: 'resetPassword',
    path: `/reset-password`,
    component: lazy(() => import('@/views/auth/ResetPassword')),
    authority: [],
  },
  {
    key: 'confirmAccount',
    path: `/confirm-account`,
    component: lazy(() => import('@/views/auth/ConfirmAccount')),
    authority: [],
  },
  {
    key: 'resend-confirm-email',
    path: '/resend-confirm-email',
    component: lazy(
      () => import('@/views/auth/SendConfirmEmail/SendConfirmEmail')
    ),
    authority: [],
  },
  {
    key: 'signUp-customer',
    path: '/crear-cuenta/cliente',
    component: lazy(() => import('@/views/auth/SignUpCustomer')),
    authority: [],
  },
]

export default authRoute
