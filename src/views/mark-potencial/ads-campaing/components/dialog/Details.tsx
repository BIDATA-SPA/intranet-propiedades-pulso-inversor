import { Card } from '@/components/ui'
import Button from '@/components/ui/Button'
import { ServiceRequestRow } from '@/services/marketing/brand/types'
import { formatDateTime } from '@/utils/formatDateTime'
import { useCopyToClipboard } from '@/utils/hooks/useCopyToClipboard'
import { BiLogoZoom } from 'react-icons/bi'
import { BsMicrosoftTeams } from 'react-icons/bs'
import { FaDiscord } from 'react-icons/fa'
import { FiCopy } from 'react-icons/fi'
import { IoMdVideocam } from 'react-icons/io'
import { MdCalendarMonth } from 'react-icons/md'
import { SiGooglemeet } from 'react-icons/si'

interface UpdateExchangeFormProps {
  onClose?: () => void
  brand: ServiceRequestRow
}

const Details = ({ brand }: UpdateExchangeFormProps) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const handleCopyClick = () => {
    if (brand?.meetingUrl) {
      copyToClipboard(brand?.meetingUrl)
    }
  }

  const switchMeetingOption = (option: string) => {
    switch (option) {
      case 'Google Meet':
        return (
          <span className="flex items-center font-semibold text-[#34A853]">
            <SiGooglemeet className="text-xl mr-1.5" />
            Google Meet
          </span>
        )
      case 'Microsoft Teams':
        return (
          <span className="flex items-center font-semibold text-[#7B84EC]">
            <BsMicrosoftTeams className="text-xl mr-1.5" />
            Microsoft Teams
          </span>
        )
      case 'Zoom':
        return (
          <span className="flex items-center font-semibold text-[#008DFF]">
            <BiLogoZoom className="text-xl mr-1.5" />
            Zoom
          </span>
        )
      case 'Discord':
        return (
          <span className="flex items-center font-semibold text-[#5662F7]">
            <FaDiscord className="text-xl mr-1.5" />
            Discord
          </span>
        )
      default:
        return (
          <span className="flex items-center font-semibold">
            <IoMdVideocam className="text-xl mr-1.5" />
            Sin Plataforma
          </span>
        )
    }
  }

  return (
    <>
      <Card className="text-right mt-6 p-2">
        {brand?.meeting && (
          <div className="flex items-center justify-start">
            <MdCalendarMonth className="text-lg mr-1 text-red-400" />{' '}
            <span className="ml-1">
              Fecha programada para el día:{' '}
              <strong>
                {formatDateTime(brand?.meeting) || 'No establecida'}
              </strong>
            </span>
          </div>
        )}

        <div className="w-full flex gap-4 mt-4">
          <div className="w-full">
            <Button
              block
              variant="solid"
              disabled={!brand?.meetingOption}
              color={isCopied ? 'blue-600' : 'blue-500'}
              icon={<FiCopy />}
              onClick={handleCopyClick}
            >
              {isCopied ? 'Enlace copiado' : 'Copiar enlace Videollamada'}
            </Button>
          </div>
          <div className="w-auto">
            <Button>{switchMeetingOption(brand?.meetingOption)}</Button>
          </div>
        </div>
      </Card>
    </>
  )
}

export default Details
