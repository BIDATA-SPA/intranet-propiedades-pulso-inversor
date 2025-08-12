import Dropdown from '@/components/ui/Dropdown'
import Tooltip from '@/components/ui/Tooltip'
import { truncateString } from '@/utils/truncateString'
import FilePreviewer from '../../components/FilePreviewer'

const FileItem = ({ file, onSelect, isSelected }) => {
  const truncatedFolderName = truncateString(file?.name, 20)
  const dropdownItems = [{ key: '1', name: 'Visualizar', path: file?.path }]
  const isVideoFile = file?.path?.endsWith('.mp4')

  const handleOnClick = () => {
    onSelect(file?.id)
  }

  return (
    <li
      className={`${
        isSelected
          ? 'border-sky-400 bg-sky-100 border-2'
          : 'border-transparent bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
      } relative flex items-center w-full cursor-pointer h-[250px] rounded-xl border-2`}
      onClick={handleOnClick}
    >
      <div className="absolute top-0 w-full p-4 rounded-t-xl flex justify-between items-center">
        <Tooltip title={file.name} placement="bottom">
          <span className="text-gray-600 dark:text-gray-300">
            {truncatedFolderName}
          </span>
        </Tooltip>

        <div
          className={`${
            isSelected
              ? 'hover:bg-sky-300/30 text-sky-500'
              : 'hover:bg-gray-400/30'
          } rounded-full mr-2`}
        >
          <Dropdown>
            {dropdownItems?.map((item) => (
              <Dropdown.Item
                key={item.key}
                eventKey={item.key}
                className="mb-1 px-0"
              >
                <a
                  href={item.path}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full w-full px-2"
                >
                  <span className="flex gap-2 items-center w-full">
                    {item.name}
                  </span>
                </a>
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
      </div>
      <div className="relative w-[90%] h-[60%] mt-6 flex items-center justify-center p-1 bg-white mx-auto rounded-md">
        {isVideoFile ? (
          <video controls src={file?.path} className="rounded-md" />
        ) : (
          <Tooltip title={file?.description} placement="bottom">
            <FilePreviewer url={file?.path} />
          </Tooltip>
        )}
      </div>
    </li>
  )
}

export default FileItem
