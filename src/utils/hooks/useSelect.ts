import { useCallback } from 'react'

interface SelectChangeEvent {
  value: string | number
  label: string
}

function useSelect(onValueChange: (value: string | number) => void) {
  const onChange = useCallback(
    (e: SelectChangeEvent) => {
      const { value, label } = e
      onValueChange(value)
      return { value, label }
    },
    [onValueChange]
  )

  return { onChange }
}

export default useSelect
