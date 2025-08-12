import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Dropdown from '@/components/ui/Dropdown'
import ScrollBar from '@/components/ui/ScrollBar'
import Tooltip from '@/components/ui/Tooltip'
import { useAppSelector } from '@/store'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useResponsive from '@/utils/hooks/useResponsive'
import useThemeClass from '@/utils/hooks/useThemeClass'
import isLastChild from '@/utils/isLastChild'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { HiOutlineBell, HiOutlineMailOpen } from 'react-icons/hi'

import {
  useGetMyInfoQuery,
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from '@/services/RtkQueryService'
import { Notification as NotificationType } from '@/services/notification/types/notification.type'
import openNotification from '@/utils/openNotification'
import socket from '../../utils/socket'
import { Tabs } from '../ui'
import TabContent from '../ui/Tabs/TabContent'
import TabList from '../ui/Tabs/TabList'
import TabNav from '../ui/Tabs/TabNav'

const NotificationToggle = ({
  className,
  dot,
  content,
}: {
  className?: string
  dot: boolean
  content?: string
}) => {
  return (
    <div className={classNames('text-2xl', className)}>
      {dot ? (
        <Badge content={content} badgeStyle={{ top: '3px', right: '6px' }}>
          <HiOutlineBell />
        </Badge>
      ) : (
        <HiOutlineBell />
      )}
    </div>
  )
}

const _Notification = ({ className }: { className?: string }) => {
  const { data: notificationsData, refetch: refetchNotificationsData } =
    useGetNotificationsQuery(
      { paginated: false },
      { refetchOnMountOrArgChange: true }
    ) as { data: NotificationType[]; refetch: any }
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation()
  const { data: myInfo } = useGetMyInfoQuery({}, {})
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation()

  const [unreadNotifications, setUnreadNotification] = useState([])
  const [readNotifications, setReadNotification] = useState([])
  const [generalNotifications, setGeneralNotifications] = useState([])

  const { bgTheme } = useThemeClass()

  const { larger } = useResponsive()

  const direction = useAppSelector((state) => state.theme.direction)

  const onNotificationOpen = async () => {
    // Fetch NotificationList
  }

  const onMarkAsRead = async (id: string) => {
    markNotificationAsRead({ id })
  }

  const onMarkAllAsRead = async () => {
    markAllNotificationsAsRead({
      notificationsId: unreadNotifications.map(
        (notification) => notification.id
      ),
    })
  }

  const drawNotificationList = ({
    notifications,
    withBadge = true,
    readable = true,
  }: {
    notifications: Array<NotificationType>
    withBadge?: boolean
    readable?: boolean
  }) => {
    if (!notifications.length) {
      return (
        <div className="flex justify-center items-center h-[100%]">
          <span className="text-[16px] font-bold">Sin Notificaciones</span>
        </div>
      )
    }

    return notifications.map((item, index) => (
      <div
        key={item?.id}
        className={`relative flex px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20 ${
          !isLastChild(unreadNotifications, index)
            ? 'border-b border-gray-200 dark:border-gray-600'
            : ''
        }`}
        onClick={() => readable && onMarkAsRead(item?.id)}
      >
        <div className="ltr:ml-3 rtl:mr-3">
          <div>
            {item?.title && (
              <span className="font-semibold heading-text">{item?.title} </span>
            )}
            <span>{item?.description}</span>
          </div>
          <span className="text-xs">
            {new Date(item?.createdAt).toLocaleString('es-ES', {
              timeZone: 'UTC',
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
            hrs
          </span>
        </div>
        {withBadge && (
          <Badge
            className="absolute top-4 ltr:right-3 rtl:left-4 mt-1.5"
            innerClass={`${item?.openAt ? 'bg-gray-300' : bgTheme}`}
          />
        )}
      </div>
    ))
  }

  useEffect(() => {
    if (!socket || !myInfo) return

    const handleNotification = (notification: NotificationType) => {
      if (myInfo.id === notification.user?.id || !notification.user) {
        refetchNotificationsData()

        openNotification(
          'info',
          notification?.title,
          notification?.description,
          5
        )
      }
    }

    socket.on('notification', handleNotification)

    return () => {
      socket.off('notification', handleNotification)
    }
  }, [socket, myInfo, refetchNotificationsData])

  useEffect(() => {
    if (notificationsData) {
      setUnreadNotification(
        notificationsData.filter(
          (notification) => !notification.openAt && notification.user
        )
      )
      setReadNotification(
        notificationsData.filter(
          (notification) => notification.openAt && notification.user
        )
      )

      setGeneralNotifications(
        notificationsData.filter((notification) => !notification.user)
      )
    }
  }, [notificationsData])

  return (
    <Dropdown
      renderTitle={
        <NotificationToggle
          content={`${
            (unreadNotifications as NotificationType[])?.filter(
              (notification) => !notification.openAt
            ).length
          }`}
          dot={Boolean(unreadNotifications.length)}
          className={className}
        />
      }
      menuClass="p-0 min-w-[280px] md:min-w-[340px]"
      placement={larger.md ? 'bottom-end' : 'bottom-center'}
      onOpen={onNotificationOpen}
    >
      <Dropdown.Item variant="header">
        <div className=" dark:border-gray-600 px-4 py-2 flex items-center justify-between">
          <h6>Notificaciones</h6>
          <Tooltip title="Marcar todas como leídas">
            <Button
              variant="plain"
              shape="circle"
              size="sm"
              icon={<HiOutlineMailOpen className="text-xl" />}
              onClick={() => {
                onMarkAllAsRead()
              }}
            />
          </Tooltip>
        </div>
      </Dropdown.Item>
      <div>
        <Tabs defaultValue="tab1">
          <TabList className="justify-center">
            <TabNav value="tab1">Pendientes</TabNav>
            <TabNav value="tab2">Leídas</TabNav>
            <TabNav value="tab3">Generales</TabNav>
          </TabList>
          <div className="p-4">
            <TabContent value="tab1">
              <ScrollBar
                direction={direction}
                style={{ width: '100%', height: '300px' }}
              >
                {drawNotificationList({ notifications: unreadNotifications })}
              </ScrollBar>
            </TabContent>
            <TabContent value="tab2">
              <ScrollBar
                direction={direction}
                style={{ width: '100%', height: '300px' }}
              >
                {drawNotificationList({
                  notifications: readNotifications,
                  readable: false,
                })}
              </ScrollBar>
            </TabContent>
            <TabContent value="tab3">
              <ScrollBar
                direction={direction}
                style={{ width: '100%', height: '300px' }}
              >
                {drawNotificationList({
                  notifications: generalNotifications,
                  withBadge: false,
                  readable: false,
                })}
              </ScrollBar>
            </TabContent>
          </div>
        </Tabs>
      </div>

      <Dropdown.Item variant="header">
        <div className="flex justify-center border-t border-gray-200 dark:border-gray-600 px-4 py-2">
          <Button
            className="font-semibold cursor-pointer border-none p-2 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
            onClick={() => refetchNotificationsData()}
          >
            Actualizar actividad
          </Button>
        </div>
      </Dropdown.Item>
    </Dropdown>
  )
}

const Notification = withHeaderItem(_Notification)

export default Notification
