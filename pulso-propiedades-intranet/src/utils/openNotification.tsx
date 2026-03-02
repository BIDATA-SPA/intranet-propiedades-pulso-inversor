import { Notification, toast } from '@/components/ui'

export default function openNotification(
  type: 'success' | 'warning' | 'danger' | 'info',
  title: string,
  text: string,
  duration = 5
) {
  toast.push(
    <Notification title={title} type={type} duration={duration * 1000}>
      {text}
    </Notification>,
    { placement: 'top-center' }
  )
}
