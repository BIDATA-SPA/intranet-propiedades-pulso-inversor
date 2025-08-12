import type { AvatarProps } from '@/components/ui/Avatar'
import Avatar from '@/components/ui/Avatar'
import Timeline from '@/components/ui/Timeline'
import { formatDate } from '@fullcalendar/core'
import { MdEmail } from 'react-icons/md'

type TimelineAvatarProps = AvatarProps

const TimelineAvatar = ({ children, ...rest }: TimelineAvatarProps) => {
  return (
    <Avatar {...rest} size={25} shape="circle">
      {children}
    </Avatar>
  )
}

const TimeLineComponent = ({ plan }) => {
  return (
    <>
      <Timeline.Item
        media={
          <TimelineAvatar className={'bg-gray-500'}>
            <MdEmail />
          </TimelineAvatar>
        }
      >
        <div>
          <span
            className={`${'text-gray-800 dark:text-gray-300'}  font-semibold uppercase`}
          >
            {`entel@contacto.cl`}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-gray-500/90 dark:text-gray-400">
            Fecha de recepción: {formatDate(plan?.startDate)}
          </span>
          <span className="text-gray-500/90 dark:text-gray-400">
            Hora de recepción: 14:23:00
          </span>
        </div>
      </Timeline.Item>
    </>
  )
}

const CCSendedEmailContent = ({ title, subtitle, currentUser }) => {
  const timeLinePlans =
    currentUser?.plan?.length > 0 ? (
      currentUser?.plan
        ?.map((plan, index) => <TimeLineComponent key={index} plan={plan} />)
        ?.toReversed() || []
    ) : (
      <p className="w-full text-center flex justify-center items-center">
        Esta solicitud no incluye una copia a destinatarios.
      </p>
    )

  return (
    <div className="h-96 overflow-y-scroll">
      <h4>{!title ? 'Sin título' : title}</h4>
      <p>{subtitle}</p>
      <div className="my-8">
        <Timeline>{timeLinePlans}</Timeline>
      </div>
    </div>
  )
}

export default CCSendedEmailContent
