import type { Routes } from '@/@types/routes'
import { lazy } from 'react'
import authRoute from './authRoute'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes: Routes = [
  {
    key: 'my-properties-create',
    path: '/mis-propiedades/crear-propiedad',
    component: lazy(() => import('@/views/properties-portfolio')),
    authority: [],
  },
  {
    key: 'my-properties-detail',
    path: '/mis-propiedades/:propertyId',
    component: lazy(() => import('@/views/properties-portfolio')),
    authority: [],
  },
  {
    key: 'visit-order',
    path: '/mis-propiedades/visit/:id',
    component: lazy(() => import('@/views/visit')),
    authority: [],
  },
  {
    key: 'my-properties',
    path: '/mis-propiedades',
    component: lazy(() => import('@/views/my-properties')),
    authority: [],
  },
  {
    key: 'customers',
    path: '/clientes',
    component: lazy(() => import('@/views/customer/Clientes')),
    authority: [],
  },
  {
    key: 'create',
    path: '/clientes/crear',
    component: lazy(() => import('@/views/customer/create')),
    authority: [],
  },
  {
    key: 'clientes-details',
    path: '/clientes/:customerId',
    component: lazy(() => import('@/views/customer/update/UpdateCustomer')),
    authority: [],
  },
  {
    key: 'access-denied',
    path: '/access-denied',
    component: lazy(() => import('@/views/access-denied/AccessDenied')),
    authority: [],
  },
  {
    key: 'calendar',
    path: '/mi-calendario',
    component: lazy(() => import('@/views/my-calendar')),
    authority: [],
  },
  {
    key: 'user-profile',
    path: '/mi-perfil/:userId',
    component: lazy(() => import('@/views/account')),
    authority: [],
  },
]
