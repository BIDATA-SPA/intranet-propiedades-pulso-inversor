import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tooltip from '@/components/ui/Tooltip'
import { truncateString } from '@/utils/truncateString'
import { FaFolder } from 'react-icons/fa'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar/Avatar'

interface ItemProps {
  item: {
    id: string | number
    name: string
    description: string
    category: {
      id: number
      name: string
      image: string | null
    }
  }
}

const ExternalServiceItem = ({ item }: ItemProps) => {
  const { id, name, description, category } = item
  const maxStringLength = 60
  const maxStringTitleLength = 20
  const truncatedDescription = truncateString(description, maxStringLength)
  const truncatedTitle = truncateString(name, maxStringTitleLength)

  return (
    <li>
      <Card
        key={id}
        bodyClass="p-0"
        footerClass="flex justify-end p-2 bg-gray-50 dark:bg-gray-700"
        footer={
          <Link to={`/servicios-externos/${id}`}>
            <Button
              variant="plain"
              size="sm"
              className="flex items-center font-semobold text-sky-500 hover:text-sky-400"
            >
              Ver servicios
              <MdOutlineKeyboardArrowRight className="ml-0.5 text-lg" />
            </Button>
          </Link>
        }
        className="hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {!category?.image ? (
                <span className="p-2 rounded-full bg-gray-500 dark:bg-gray-600">
                  <FaFolder className="text-white text-md" />
                </span>
              ) : (
                <Avatar
                  className="border-2 border-white"
                  shape="circle"
                  src={category?.image}
                  alt={`icon-${category.image}`}
                />
              )}
              <div className="ltr:ml-2 rtl:mr-2 h-10 flex items-start justify-start flex-col">
                <h6>{truncatedTitle}</h6>
                <Badge
                  className="mr-4 font-semibold"
                  content={category?.name}
                  innerClass="bg-gray-100 text-gray-500 mt-1"
                />
              </div>
            </div>
            {/* <div className="flex items-center">
              <span className="p-2 rounded-full bg-gray-500 dark:bg-gray-600">
                <FaFolder className="text-white text-md" />
              </span>
              <div className="ltr:ml-2 rtl:mr-2 h-10 flex items-center justify-start">
                <h6>{truncatedTitle}</h6>
                <Badge
                  className="mr-4 font-semibold"
                  content={category?.name}
                  innerClass="bg-gray-100 text-gray-500 mt-1"
                />
              </div>
            </div> */}
          </div>
          <Tooltip title={description} placement="bottom">
            <p className="mt-6 cursor-pointer h-12">{truncatedDescription}</p>
          </Tooltip>
        </div>
      </Card>
    </li>
  )
}

export default ExternalServiceItem
