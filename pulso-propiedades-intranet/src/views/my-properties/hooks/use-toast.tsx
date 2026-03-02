import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'

type TNotificationProps = {
  title?: string
  content?: React.ReactNode
  duration?: number
  confirmAction?: () => void
}

export const useToast = () => {
  const closeNotification = (key: string) => toast.remove(key)

  const openNotification = ({
    title = 'Título Toast',
    content = <p>Contenido Toast</p>,
    duration = 0,
  }: TNotificationProps) => {
    toast.push(
      <Notification closable title={title} duration={duration}>
        <div>{content}</div>
      </Notification>
    )
  }

  return { openNotification, closeNotification }
}
