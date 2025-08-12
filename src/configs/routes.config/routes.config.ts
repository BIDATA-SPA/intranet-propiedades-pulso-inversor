import type { Routes } from '@/@types/routes'
import { lazy } from 'react'
import authRoute from './authRoute'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
  {
    key: 'my-properties',
    path: '/mis-propiedades',
    component: lazy(() => import('@/views/my-properties')),
    authority: [],
  },
  {
    key: 'my-properties-create',
    path: '/mis-propiedades/crear-propiedad',
    component: lazy(
      () => import('@/views/my-properties/NewProperty/NewProperty')
    ),
    authority: [],
  },
  {
    key: 'my-properties-id',
    path: '/mis-propiedades/:propertyId',
    component: lazy(
      () => import('@/views/my-properties/PropertyDetails/PropertyDetails')
    ),
    authority: [],
  },
  {
    key: 'my-properties-pdf',
    path: '/mis-propiedades/visit/:propertyId',
    component: lazy(
      () => import('@/views/my-properties/PdfDetails/PdfGenerate')
    ),
    authority: [],
  },
  {
    key: 'customers',
    path: '/clientes',
    component: lazy(() => import('@/views/customer/Clientes')),
    authority: [],
  },
  {
    key: 'alied-realtor',
    path: '/corredores-asociados',
    component: lazy(() => import('@/views/alied-realtor')),
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
    key: 'external-services',
    path: '/servicios-externos',
    component: lazy(() => import('@/views/external-services/ExternalServices')),
    authority: [],
  },

  {
    key: 'servicios-externos-folders-id',
    path: '/servicios-externos/:folderId',
    component: lazy(() => import('@/views/external-services/folders')),
    authority: [],
  },
  {
    key: 'lista-servicios-externos',
    path: '/servicios-externos/lista-servicios',
    component: lazy(
      () => import('@/views/external-services/ListServices/ServicesList')
    ),
    authority: [],
  },
  {
    key: 'access-denied',
    path: '/access-denied',
    component: lazy(() => import('@/views/access-denied/AccessDenied')),
    authority: [],
  },
  {
    key: 'customers-mailbox',
    path: '/procanje/buzon-de-clientes',
    component: lazy(
      () => import('@/views/yokanjeo/customer-search/ListCustomerSearch')
    ),
    authority: [],
  },
  {
    key: 'customers-mailbox-create',
    path: '/procanje/buzon-de-clientes/crear',
    component: lazy(
      () => import('@/views/yokanjeo/customer-search/NewCustomerSearch')
    ),
    authority: [],
  },
  {
    key: 'procanje-customers-details',
    path: '/procanje/buzon-de-clientes/:customerSearchId',
    component: lazy(
      () =>
        import(
          '@/views/yokanjeo/customer-search/DetailsCustomerSearch/DetailsCustomerSearch'
        )
    ),
    authority: [],
  },
  {
    key: 'properties-mailbox',
    path: '/procanje/buzon-de-propiedades',
    component: lazy(() => import('@/views/yokanjeo/property-search')),
    authority: [],
  },
  {
    key: 'dashboard',
    path: '/dashboard',
    component: lazy(() => import('@/views/dashboard')),
    authority: [],
  },
  {
    key: 'tools-and-services',
    path: '/mis-recursos',
    component: lazy(() => import('@/views/tools-and-services')),
    authority: [],
  },
  {
    key: 'tools-and-services-folders',
    path: '/mis-recursos/:folderId/archivos',
    component: lazy(
      () => import('@/views/tools-and-services/folderId/folders')
    ),
    authority: [],
  },
  {
    key: 'calendar',
    path: '/mi-calendario',
    component: lazy(() => import('@/views/my-calendar')),
    authority: [],
  },
  // Potencia tu marca
  {
    key: 'ads-campaing',
    path: '/potenciar/crear-campaña',
    component: lazy(() => import('@/views/mark-potencial/ads-campaing')),
    authority: [],
  },
  {
    key: 'mark-design',
    path: '/potenciar/diseñar-marca',
    component: lazy(() => import('@/views/mark-potencial/mark-design')),
    authority: [],
  },
  {
    key: 'web-design',
    path: '/potenciar/diseñar-web',
    component: lazy(() => import('@/views/mark-potencial/web-design')),
    authority: [],
  },

  {
    key: 'user-profile',
    path: '/mi-perfil/:userId',
    component: lazy(() => import('@/views/account')),
    authority: [],
  },

  // Request Inboxs
  {
    key: 'inbox-contact-request',
    path: '/solicitudes-de-contacto',
    component: lazy(() => import('@/views/inbox-request/contact-managment')),
    authority: [],
  },
  {
    key: 'inbox-requests-canje-id',
    path: '/gestion-de-solicitud-de-canjes/:tabId',
    component: lazy(() => import('@/views/inbox-request/kanje-managment')),
    authority: [],
  },
  {
    key: 'inbox-requests-external-services-id',
    path: '/gestion-de-solicitud-de-servicios/:tabId',
    component: lazy(
      () => import('@/views/inbox-request/external-services-managment')
    ),
    authority: [],
  },

  // Support
  {
    key: 'support',
    path: '/ayuda',
    component: lazy(() => import('@/views/support')),
    authority: [],
  },
  {
    key: 'realtor-ideas',
    path: '/ideas-corredor',
    component: lazy(() => import('@/views/realtor-ideas')),
    authority: [],
  },
]

export const protectedRoutesCustomer = [
  {
    key: 'dashboard',
    path: '/dashboard',
    component: lazy(() => import('@/views/dashboard')),
    authority: [],
  },
  // {
  //   key: 'my-properties',
  //   path: '/mis-propiedades',
  //   component: lazy(() => import('@/views/my-properties')),
  //   authority: [],
  // },
  {
    key: 'dashboard',
    path: '/mis-propiedades/crear-propiedad',
    component: lazy(
      () => import('@/views/my-properties/NewProperty/NewProperty')
    ),
    authority: [],
  },
  {
    key: 'dashboard',
    path: '/mis-propiedades/:propertyId',
    component: lazy(
      () => import('@/views/my-properties/PropertyDetails/PropertyDetails')
    ),
    authority: [],
  },
  {
    key: 'user-profile',
    path: '/mi-perfil/:userId',
    component: lazy(() => import('@/views/account')),
    authority: [],
  },
  {
    key: 'dashboard',
    path: '/mis-propiedades/visit/:propertyId',
    component: lazy(
      () => import('@/views/my-properties/PdfDetails/PdfGenerate')
    ),
    authority: [],
  },
]
