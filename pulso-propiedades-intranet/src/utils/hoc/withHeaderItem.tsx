import classNames from 'classnames'
import type { ComponentType, FC } from 'react'

export type NotificationList = {
    id: string
    target: string
    description: string
    date: string
    image: string
    type: number
    location: string
    locationLabel: string
    status: string
    readed: boolean
}

export type WithHeaderItemProps = {
    className?: string
    hoverable?: boolean
    notifications?: NotificationList[]
}

const withHeaderItem = <T extends WithHeaderItemProps>(
    Component: ComponentType<Omit<T, keyof WithHeaderItemProps>>
): FC<T> => {
    const WithHeaderItem: FC<T> = (props: T) => {
        const { className, hoverable = true } = props
        return (
            <Component
                {...(props as Omit<T, keyof WithHeaderItemProps>)}
                className={classNames(
                    'header-action-item',
                    hoverable && 'header-action-item-hoverable',
                    className
                )}
            />
        )
    }
    WithHeaderItem.displayName = `withHeaderItem(${
        Component.displayName || Component.name || 'Component'
    })`
    return WithHeaderItem
}

export default withHeaderItem
