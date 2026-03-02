import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import ScrollBar from '@/components/ui/ScrollBar'
import {
  LOGO_X_GUTTER,
  NAV_MODE_LIGHT,
  NAV_MODE_THEMED,
  NAV_MODE_TRANSPARENT,
  SIDE_NAV_COLLAPSED_WIDTH,
  SIDE_NAV_CONTENT_GUTTER,
  SIDE_NAV_WIDTH,
} from '@/constants/theme.constant'
import { useAppSelector } from '@/store'
import useResponsive from '@/utils/hooks/useResponsive'
import { useSessionNavigation } from '@/utils/hooks/useSessionNavigation'
import classNames from 'classnames'
import { Link } from 'react-router-dom'

const sideNavStyle = {
  width: SIDE_NAV_WIDTH,
  minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
  width: SIDE_NAV_COLLAPSED_WIDTH,
  minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = () => {
  const themeColor = useAppSelector((state) => state.theme.themeColor)
  const primaryColorLevel = useAppSelector(
    (state) => state.theme.primaryColorLevel
  )
  const navMode = useAppSelector((state) => state.theme.navMode)
  const direction = useAppSelector((state) => state.theme.direction)
  const currentRouteKey = useAppSelector(
    (state) => state.base.common.currentRouteKey
  )
  const sideNavCollapse = useAppSelector(
    (state) => state.theme.layout.sideNavCollapse
  )
  const userAuthority = [useAppSelector((state) => state.auth.session.rol)]
  const { navigationTree } = useSessionNavigation(userAuthority[0])

  const { larger } = useResponsive()

  const sideNavColor = () => {
    if (navMode === NAV_MODE_THEMED) {
      return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
    }
    return `side-nav-${navMode}`
  }

  const logoMode = () => {
    if (navMode === NAV_MODE_THEMED) {
      return NAV_MODE_LIGHT
    }

    if (navMode === NAV_MODE_TRANSPARENT) {
      return NAV_MODE_LIGHT
    }

    return navMode
  }

  const menuContent = (
    <VerticalMenuContent
      navMode={navMode}
      collapsed={sideNavCollapse}
      navigationTree={navigationTree}
      routeKey={currentRouteKey}
      userAuthority={userAuthority.map((authority) => String(authority))}
      direction={direction}
    />
  )

  return (
    <>
      {larger.md && (
        <div
          style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
          className={classNames(
            'side-nav',
            sideNavColor(),
            !sideNavCollapse && 'side-nav-expand'
          )}
        >
          <div className="side-nav-header">
            <Link to="/dashbaord">
              <Logo
                mode={logoMode()}
                type={sideNavCollapse ? 'streamline' : 'full'}
                className={
                  sideNavCollapse ? SIDE_NAV_CONTENT_GUTTER : LOGO_X_GUTTER
                }
                imgClass="w-auto h-[3rem] max-h-[3rem] my-3"
              />
            </Link>
          </div>
          {sideNavCollapse ? (
            menuContent
          ) : (
            <div className="side-nav-content py-2">
              <ScrollBar autoHide direction={direction}>
                {menuContent}
              </ScrollBar>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default SideNav
