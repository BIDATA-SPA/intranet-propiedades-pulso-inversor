import classNames from 'classnames'
import React from 'react'

type NotificationProps = {
  title: string
  type: 'success' | 'warning' | 'danger' | 'info'
  children: React.ReactNode
}

const Notification: React.FC<NotificationProps> = ({
  title,
  type,
  children,
}) => {
  const notificationClass = classNames('p-4 rounded shadow-md mb-4', {
    'bg-green-100 text-green-800': type === 'success',
    'bg-yellow-100 text-yellow-800': type === 'warning',
    'bg-red-100 text-red-800': type === 'danger',
    'bg-blue-100 text-blue-800': type === 'info',
  })

  return (
    <div className={notificationClass}>
      <strong>{title}</strong>
      <p>{children}</p>
    </div>
  )
}

export default Notification
