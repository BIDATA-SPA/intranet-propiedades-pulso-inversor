import InputGroup from '@/components/ui/InputGroup'
import React, { ChangeEvent } from 'react'
import { formatNumber } from './format-number'

const { Addon } = InputGroup

interface FormattedNumberInputProps {
  field: any
  form: any
  currencyId: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  field,
  form,
  currencyId,
  placeholder,
  className,
  disabled,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value.replace(/\./g, '').replace(/,/g, '.')
    form.setFieldValue(field.name, Number(rawValue))
  }

  return (
    <>
      <InputGroup>
        <Addon>
          {currencyId === 'UF' ? 'UF' : currencyId === 'CLP' ? '$' : '$'}
        </Addon>
        <input
          disabled={disabled}
          {...field}
          value={formatNumber(field?.value || 0, currencyId)}
          placeholder={placeholder}
          className={`${className} input input-md h-11 focus:ring-sky-400 focus-within:ring-sky-400 focus-within:border-sky-400 focus:border-sky-400`}
          onChange={handleChange}
        />
      </InputGroup>
    </>
  )
}

export default FormattedNumberInput
