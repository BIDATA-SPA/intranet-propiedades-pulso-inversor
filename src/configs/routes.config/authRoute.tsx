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
    key: 'rating',
    path: `/calificar-corredor/:userId/:customerId`,
    component: lazy(() => import('@/views/rating')),
    authority: [],
  },
  {
    key: 'rating-realtor',
    path: `/califica-a-tu-corredor/:userId`,
    component: lazy(() => import('@/views/rating-realtor/RatingRealtorForm')),
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
  {
    key: 'signUp-webinar',
    path: `/webinar`,
    component: lazy(() => import('@/views/auth/SignUpWebinar')),
    authority: [],
  },
  {
    key: 'signUp-webinar2',
    path: `/iniciar-sesion?redirectUrl=/webinar`,
    component: lazy(() => import('@/views/auth/SignUpWebinar')),
    authority: [],
  },
]

export default authRoute
