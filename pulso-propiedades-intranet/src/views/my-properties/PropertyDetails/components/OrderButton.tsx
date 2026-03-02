import Tooltip from '@/components/ui/Tooltip'
import { HiMiniArrowsUpDown } from 'react-icons/hi2'

const OrderButton = ({ onOpen }) => {
  return (
    <Tooltip title="Ordenar">
      <button
        type="button"
        className="p-3 rounded-full bg-lime-500 hover:bg-sky-600 dark:bg-gray-600 dark:hover:bg-gray-700 dark:border-gray-600"
        onClick={onOpen}
      >
        <HiMiniArrowsUpDown className="text-2xl text-white dark:text-white" />
      </button>
    </Tooltip>
  )
}

export default OrderButton
