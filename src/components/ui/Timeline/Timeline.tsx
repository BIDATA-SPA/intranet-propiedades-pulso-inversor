import { forwardRef, Children, isValidElement } from 'react'
import classNames from 'classnames'
import mapCloneElement from '../utils/mapCloneElement'
import type { DetailedReactHTMLElement } from 'react'
import type { CommonProps } from '../@types/common'
import React from 'react'

export type TimelineProps = CommonProps

const Timeline = forwardRef<HTMLUListElement, TimelineProps>((props, ref) => {
  const { children, className } = props
  const count = Children.count(children)

  const items = mapCloneElement(
    children,

    (item: DetailedReactHTMLElement<any, HTMLElement>, index: number) => {
      if (isValidElement(item)) {
        return React.cloneElement(item, {
          isLast: index === count - 1,
        })
      }
      return item
    }
  )

  return (
    <ul ref={ref} className={classNames('timeline', className)}>
      {items}
    </ul>
  )
})

Timeline.displayName = 'Timeline'

export default Timeline
