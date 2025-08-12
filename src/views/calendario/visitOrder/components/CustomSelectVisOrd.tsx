import Select from '@/components/ui/Select'
import { HiCheck } from 'react-icons/hi'

const CustomSelectOption = ({ innerProps, label, isSelected }) => {
  return (
    <div
      className={`flex items-center justify-between p-2 ${
        isSelected
          ? 'bg-gray-100 dark:bg-gray-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
      {...innerProps}
    >
      <div className="flex items-center">
        <span className="ml-2 rtl:mr-2">{label}</span>
      </div>
      {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
    </div>
  )
}

const Custom = ({ options, onChange, defaultValue }) => {
  return (
    <div>
      <Select
        options={options}
        components={{
          Option: CustomSelectOption,
        }}
        defaultValue={defaultValue}
        className="mb-4"
        onChange={onChange}
      />
    </div>
  )
}

export default Custom
