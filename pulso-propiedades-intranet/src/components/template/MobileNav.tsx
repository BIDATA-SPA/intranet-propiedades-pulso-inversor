import NavToggle from '@/components/shared/NavToggle'
import Drawer from '@/components/ui/Drawer'
// import navigationConfig from '@/configs/navigation.config'
import {
  DIR_RTL,
  NAV_MODE_THEMED,
  NAV_MODE_TRANSPARENT,
} from '@/constants/theme.constant'
import { useAppSelector } from '@/store'
import withHeaderItem, { WithHeaderItemProps } from '@/utils/hoc/withHeaderItem'
import useResponsive from '@/utils/hooks/useResponsive'
import { useSessionNavigation } from '@/utils/hooks/useSessionNavigation'
import classNames from 'classnames'
import { Suspense, lazy, useState } from 'react'

const VerticalMenuContent = lazy(
  () => import('@/components/template/VerticalMenuContent')
)

type MobileNavToggleProps = {
  toggled?: boolean
}

const MobileNavToggle = withHeaderItem<
  MobileNavToggleProps & WithHeaderItemProps
>(NavToggle)

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false)
  const openDrawer = () => {
    setIsOpen(true)
  }

  const onDrawerClose = () => {
    setIsOpen(false)
  }

  const themeColor = useAppSelector((state) => state.theme.themeColor)
  const primaryColorLevel = useAppSelector(
    (state) => state.theme.primaryColorLevel
  )
  const navMode = useAppSelector((state) => state.theme.navMode)
  const mode = useAppSelector((state) => state.theme.mode)
  const direction = useAppSelector((state) => state.theme.direction)
  const currentRouteKey = useAppSelector(
    (state) => state.base.common.currentRouteKey
  )
  const sideNavCollapse = useAppSelector(
    (state) => state.theme.layout.sideNavCollapse
  )
  const userAuthority = [useAppSelector((state) => state.auth.session.rol)]
  const { navigationTree } = useSessionNavigation(userAuthority[0])

  const { smaller } = useResponsive()

  const navColor = () => {
    if (navMode === NAV_MODE_THEMED) {
      return `bg-${themeColor}-${primaryColorLevel} side-nav-${navMode}`
    }

    if (navMode === NAV_MODE_TRANSPARENT) {
      return `side-nav-${mode}`
    }

    return `side-nav-${navMode}`
  }

  return (
    <>
      {smaller.md && (
        <>
          <div className="text-2xl" onClick={openDrawer}>
            <MobileNavToggle toggled={isOpen} />
          </div>
          <Drawer
            title=""
            isOpen={isOpen}
            bodyClass={classNames(navColor(), 'p-0')}
            width={330}
            placement={direction === DIR_RTL ? 'right' : 'left'}
            onClose={onDrawerClose}
            onRequestClose={onDrawerClose}
          >
            <Suspense fallback={<></>}>
              {isOpen && (
                <VerticalMenuContent
                  navMode={navMode}
                  collapsed={sideNavCollapse}
                  navigationTree={navigationTree} // navigationConfig
                  routeKey={currentRouteKey}
                  userAuthority={userAuthority.map((authority) =>
                    String(authority)
                  )}
                  direction={direction}
                  onMenuItemClick={onDrawerClose}
                />
              )}
            </Suspense>
          </Drawer>
          {/* <ConverseDiviseMobile/> */}
        </>
      )}
    </>
  )
}

export default MobileNav
