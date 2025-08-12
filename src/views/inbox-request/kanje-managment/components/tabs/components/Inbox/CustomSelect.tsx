import Avatar from '@/components/ui/Avatar'
import Select from '@/components/ui/Select'
import { HiCheck } from 'react-icons/hi'
import { components } from 'react-select'

const { Control } = components

const CustomSelectOption = ({ innerProps, label, data, isSelected }) => {
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
        <Avatar shape="circle" size={20} src={data.imgPath} />
        <span className="ml-2 rtl:mr-2">{label}</span>
      </div>
      {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
    </div>
  )
}

const CustomControl = ({ children, ...props }) => {
  const selected = props.getValue()[0]
  return (
    <Control {...props}>
      {selected && (
        <Avatar
          className="ltr:ml-4 rtl:mr-4"
          shape="circle"
          size={18}
          src={selected.imgPath}
        />
      )}
      {children}
    </Control>
  )
}

const Custom = ({ options, onChange, defaultValue, isDisabled }) => {
  return (
    <div>
      <Select
        isDisabled={isDisabled}
        options={options}
        components={{
          Option: CustomSelectOption,
          Control: CustomControl,
        }}
        defaultValue={defaultValue}
        className="mb-4"
        onChange={onChange}
      />
    </div>
  )
}

export default Custom
