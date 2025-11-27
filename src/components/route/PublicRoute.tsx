import { Navigate, Outlet, useLocation } from 'react-router-dom'
import appConfig from '@/configs/app.config'
import useAuth from '@/utils/hooks/useAuth'

const { authenticatedEntryPath } = appConfig

const PublicRoute = () => {
  const { authenticated } = useAuth()
  const location = useLocation()

  // Allow some public pages to be accessible even when authenticated
  // e.g. public review page that should be reachable by anyone with the link
  const alwaysPublicPrefixes = ['/califica-a-tu-corredor']

  if (authenticated) {
    const allow = alwaysPublicPrefixes.some((p) => location.pathname.startsWith(p))
    if (allow) return <Outlet />
    return <Navigate to={authenticatedEntryPath} />
  }

  return <Outlet />
}

export default PublicRoute
