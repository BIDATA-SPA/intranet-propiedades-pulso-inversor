export type AppConfig = {
  socketUrl: string
  apiUrl: string
  authenticatedEntryPath: string
  unAuthenticatedEntryPath: string
  tourPath: string
  locale: string
  enableMock: boolean
}

const appConfig: AppConfig = {
  socketUrl: `${import.meta.env.VITE_SOCKET_URL}/`,
  apiUrl: `${import.meta.env.VITE_API_URL}/`,
  authenticatedEntryPath: '/dashboard',
  unAuthenticatedEntryPath: '/iniciar-sesion',
  tourPath: '/',
  locale: 'es',
  enableMock: false,
}

export default appConfig
