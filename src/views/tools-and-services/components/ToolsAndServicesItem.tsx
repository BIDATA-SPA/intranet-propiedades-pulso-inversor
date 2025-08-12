import { Avatar } from '@/components/ui'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tooltip from '@/components/ui/Tooltip'
import { truncateString } from '@/utils/truncateString'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'

const ToolsAndServicesItem = ({ item }) => {
  const navigate = useNavigate()
  const { id, name, description, image } = item
  const truncateSettings = {
    length: {
      title: 40,
      description: 70,
    },
  }

  const truncatedTitle = truncateString(name, truncateSettings.length.title)
  const truncatedDescription = truncateString(
    description,
    truncateSettings.length.description
  )

  const handleDoubleClick = (folderId: number) => {
    navigate(`/mis-recursos/${folderId}/archivos`)
  }

  return (
    <>
      <li>
        <div
          role="link"
          onClick={(e) => e.preventDefault()}
          onDoubleClick={() => handleDoubleClick(id)}
        >
          <Card
            key={id}
            bodyClass="p-0"
            footerClass="flex justify-end p-2 bg-gray-50 dark:bg-gray-700"
            footer={
              <div className="w-full flex items-center justify-end">
                <Link to={`/mis-recursos/${id}/archivos`}>
                  <Button
                    variant="plain"
                    size="sm"
                    className="flex items-center font-semobold text-sky-500 hover:text-sky-400"
                  >
                    Abrir
                    <MdOutlineKeyboardArrowRight className="ml-0.5 text-lg" />
                  </Button>
                </Link>
              </div>
            }
            className="hover:shadow-lg transition duration-150 ease-in-out cursor-pointer hover:dark:border-gray-400 hover:border-sky-400 hover:bg-sky-100 dark:hover:bg-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar src={image} alt={`icon-${name}`} />
                  <div className="ltr:ml-2 rtl:mr-2 h-10 flex items-center justify-start">
                    <h6>{truncatedTitle}</h6>
                  </div>
                </div>
              </div>
              <Tooltip title={description} placement="bottom">
                <p className="mt-6 cursor-pointer h-12">
                  {truncatedDescription}
                </p>
              </Tooltip>
            </div>
          </Card>
        </div>
      </li>
    </>
  )
}

export default ToolsAndServicesItem
