import { stripHtml } from '@/utils/stripHTML'
import { truncateString } from '@/utils/truncateString'

const TabMainDescription = ({ property }) => {
  return (
    <div className="border-t dark:border-t-gray-700 py-2">
      <h2 className="flex font-semibold text-[17px]">Descripción</h2>
      <p>
        {truncateString(`${stripHtml(property?.propertyDescription)}`, 4000)}
      </p>
    </div>
  )
}

export default TabMainDescription
