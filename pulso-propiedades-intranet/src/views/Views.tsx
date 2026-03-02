import type { LayoutType } from '@/@types/theme'
import AppRoute from '@/components/route/AppRoute'
import AuthorityGuard from '@/components/route/AuthorityGuard'
import ProtectedRoute from '@/components/route/ProtectedRoute'
import PublicRoute from '@/components/route/PublicRoute'
import Loading from '@/components/shared/Loading'
import PageContainer from '@/components/template/PageContainer'
import appConfig from '@/configs/app.config'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import { useAppSelector } from '@/store'
import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

interface ViewsProps {
  pageContainerType?: 'default' | 'gutterless' | 'contained'
  layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
  const userAuthority = [useAppSelector((state) => state.auth.session.rol)]

  return (
    <Routes>
      {/* Rutas protegidas */}
      <Route path="/" element={<ProtectedRoute />}>
        {/* redirección raíz → authenticatedEntryPath (por ejemplo /dashboard) */}
        <Route
          path="/"
          element={<Navigate replace to={authenticatedEntryPath} />}
        />

        {/* Rutas protegidas configuradas en protectedRoutes */}
        {userAuthority[0] !== 1 &&
          userAuthority[0] !== 3 &&
          protectedRoutes.map((route: any, index: number) => (
            <Route
              key={route.key + index}
              path={route.path}
              element={
                <AuthorityGuard
                  userAuthority={userAuthority.map((authority) =>
                    String(authority)
                  )}
                  authority={route.authority}
                >
                  <PageContainer {...props} {...(route.meta || {})}>
                    <AppRoute
                      routeKey={route.key}
                      component={route.component}
                      {...(route.meta || {})}
                    />
                  </PageContainer>
                </AuthorityGuard>
              }
            />
          ))}

        {/* Cualquier ruta protegida desconocida → raíz */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>

      {/* Rutas públicas */}
      <Route path="/" element={<PublicRoute />}>
        {publicRoutes.map((route: any) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppRoute
                routeKey={route.key}
                component={route.component}
                {...(route.meta || {})}
              />
            }
          />
        ))}
      </Route>
    </Routes>
  )
}

const Views = (props: ViewsProps) => {
  return (
    <Suspense fallback={<Loading loading={true} />}>
      <AllRoutes {...props} />
    </Suspense>
  )
}

export default Views
