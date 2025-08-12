import { Badge } from '@/components/ui'
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
        <Badge className={`roundend-full ${data.path}`}
               />
        <span className="ml-2 rtl:mr-2">{label}</span>
      </div>
      {isSelected && <>
        {/* <Badge className={`roundend-full ${data.path}`}
               /> */}
          <HiCheck className="text-emerald-500 text-xl" />
      </>}

    </div>
  )
}

const CustomControl = ({ children, ...props }) => {
  const selected = props.getValue()[0]
  return (
    <Control {...props}>
      {selected && (
        <Badge
          className={`ltr:ml-4 rtl:mr-4 ${selected.value}`}
        />
      )}
      {children}
    </Control>
  )
}

const Custom = ({ options, onChange, defaultValue }) => {

  let labelVal;

  switch(defaultValue.value) {
    case 'bg-orange-200 text-orange-500 dark:bg-orange-500/20 dark:text-orange-100':
      labelVal = 'Naranja'
      break;
    case 'bg-blue-200 text-blue-500 dark:bg-blue-500/20 dark:text-blue-100':
      labelVal = 'Azul'
      break;
    case 'bg-green-200 text-green-500 dark:bg-green-500/20 dark:text-green-100':
      labelVal = 'Verde'
      break;
    case 'bg-yellow-200 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-100':
      labelVal = 'Amarillo'
      break;
    case 'bg-cyan-200 text-cyan-500 dark:bg-cyan-500/20 dark:text-cyan-100':
        labelVal = 'Cyan'
        break;
    case 'bg-purple-200 text-purple-500 dark:bg-purple-500/20 dark:text-purple-100':
        labelVal = 'Purpura'
      break;
    default:
      labelVal = defaultValue.value;
      break;
      
  }

  const formatedValue = {
    value: defaultValue.value,
    label: labelVal
  }

  return (
    <div>
      <Select
        options={options}
        components={{
          Option: CustomSelectOption,
          Control: CustomControl,
        }}
        defaultValue={formatedValue}
        className="mb-4"
        onChange={onChange}
      />
    </div>
  )
}

export  default  Custom