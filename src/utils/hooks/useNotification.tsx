import { toast } from '@/components/ui'
import Notification from '@/components/ui/Notification'

type NotificationType = 'success' | 'warning' | 'danger' | 'info'

const useNotification = () => {
    const showNotification = (
        type: NotificationType,
        title: string,
        text: string,
        duration = 4
    ) => {
        toast.push(
            <Notification title={title} type={type} duration={duration * 1000}>
                {text}
            </Notification>,
            { placement: 'top-center' }
        )
    }

    return { showNotification }
}

export default useNotification
