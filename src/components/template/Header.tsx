import type { CommonProps } from '@/@types/common'
import { HEADER_HEIGHT_CLASS } from '@/constants/theme.constant'
import classNames from 'classnames'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface HeaderProps extends CommonProps {
  headerStart?: ReactNode
  headerEnd?: ReactNode
  headerMiddle?: ReactNode
  container?: boolean
}

const Header = (props: HeaderProps) => {
  const { headerStart, headerEnd, headerMiddle, className, container } = props
  const LOGO_SRC_PATH = '/img/logo/'

  return (
    <header className={classNames('header', className)}>
      <div
        className={classNames(
          'header-wrapper',
          HEADER_HEIGHT_CLASS,
          container && 'container mx-auto'
        )}
      >
        <div className="header-action header-action-start md:block">
          {headerStart}

          <div className="block xs:hidden sm:hidden mx-1">
            <Link to="/">
              <img
                src={`${LOGO_SRC_PATH}logo-light-streamline.png`}
                className="w-auto h-[2.5rem] max-h-[2.5rem] block sm:hidden"
              />
            </Link>
          </div>
        </div>
        {headerMiddle && (
          <div className="header-action header-action-middle">
            {headerMiddle}
          </div>
        )}
        <div className="header-action header-action-end">{headerEnd}</div>
      </div>
    </header>
  )
}

export default Header
