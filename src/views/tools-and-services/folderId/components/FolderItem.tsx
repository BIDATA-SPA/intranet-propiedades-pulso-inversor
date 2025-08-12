import Dropdown from '@/components/ui/Dropdown'
import Tooltip from '@/components/ui/Tooltip'
import { truncateString } from '@/utils/truncateString'
import { FaFolder } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'

const dropdownItems = [{ key: 'a', name: 'Abrir' }]

const FolderItem = ({ folder, isSelected, onSelect }) => {
  const navigate = useNavigate()
  const truncatedFolderName = truncateString(folder.name, 14)

  const handleOnClick = () => {
    onSelect(folder.id)
  }

  const handleDoubleClick = (folderId: number) => {
    navigate(`/mis-recursos/${folderId}/archivos`)
  }

  return (
    <li
      className={`relative flex items-center w-full h-[55px] rounded-xl border-2 cursor-pointer select-none ${
        isSelected
          ? 'border-sky-400 bg-sky-100 border-2'
          : 'border-transparent bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
      }`}
      onClick={handleOnClick}
      onDoubleClick={() => handleDoubleClick(folder.id)}
    >
      <a
        className="w-full h-full flex justify-between items-center p-4 cursor-pointer select-none"
        onClick={(e) => e.preventDefault()}
      >
        <div className="flex items-center">
          <FaFolder className="text-xl text-gray-600 mr-4 dark:text-gray-400" />
          <Tooltip title={folder.name} placement="bottom">
            <span className="text-gray-600 dark:text-gray-300">
              {truncatedFolderName}
            </span>
          </Tooltip>
        </div>
      </a>
      <div
        className={`${
          isSelected
            ? 'hover:bg-sky-300/30 text-sky-500'
            : 'hover:bg-gray-400/30'
        } rounded-full mr-2`}
      >
        <Dropdown>
          {dropdownItems.map((item) => (
            <Dropdown.Item key={item.key} eventKey={item.key}>
              <Link
                to={`/mis-recursos/${folder.id}/archivos`}
                className="flex gap-2 items-center w-full"
              >
                {item.name}
              </Link>
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>
    </li>
  )
}

export default FolderItem
