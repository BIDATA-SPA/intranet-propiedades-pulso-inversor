/* eslint-disable @typescript-eslint/no-explicit-any */
import InputGroup from '@/components/ui/InputGroup'
import React, { ChangeEvent, FocusEvent, useEffect, useState } from 'react'
import { formatPriceInput, parsePriceInput } from './format-number'

const { Addon } = InputGroup

interface FormattedNumberInputProps {
  field: any
  form: any
  currencyId: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

const isValidPriceInput = (value: string) => {
  return /^[0-9.,]*$/.test(value)
}

const getCurrencyAddon = (currencyId: string) => {
  if (currencyId === 'UF') return 'UF'
  if (currencyId === 'M2') return 'M²'
  if (currencyId === 'CLP') return '$'

  return '$'
}

const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  field,
  form,
  currencyId,
  placeholder,
  className = '',
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    setDisplayValue(formatPriceInput(field.value, currencyId))
  }, [field.value, currencyId])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value

    if (!isValidPriceInput(inputValue)) return

    setDisplayValue(inputValue)

    const parsedValue = parsePriceInput(inputValue)

    form.setFieldValue(field.name, parsedValue)
  }

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    field.onBlur(event)

    const parsedValue = parsePriceInput(displayValue)

    if (parsedValue === '') {
      setDisplayValue('')
      form.setFieldValue(field.name, '')
      return
    }

    form.setFieldValue(field.name, parsedValue)
    setDisplayValue(formatPriceInput(parsedValue, currencyId))
  }

  return (
    <InputGroup>
      <Addon>{getCurrencyAddon(currencyId)}</Addon>

      <input
        name={field.name}
        disabled={disabled}
        value={displayValue}
        placeholder={placeholder}
        inputMode="decimal"
        autoComplete="off"
        className={`${className} input input-md h-11 focus:ring-sky-400 focus-within:ring-sky-400 focus-within:border-sky-400 focus:border-sky-400`}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </InputGroup>
  )
}

export default FormattedNumberInput

// import InputGroup from '@/components/ui/InputGroup'
// import React, { ChangeEvent } from 'react'
// import { formatNumber } from './format-number'

// const { Addon } = InputGroup

// interface FormattedNumberInputProps {
//   field: any
//   form: any
//   currencyId: string
//   placeholder?: string
//   className?: string
//   disabled?: boolean
// }

// const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
//   field,
//   form,
//   currencyId,
//   placeholder,
//   className,
//   disabled,
// }) => {
//   const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const rawValue = event.target.value.replace(/\./g, '').replace(/,/g, '.')
//     form.setFieldValue(field.name, Number(rawValue))
//   }

//   return (
//     <>
//       <InputGroup>
//         <Addon>
//           {currencyId === 'UF' ? 'UF' : currencyId === 'CLP' ? '$' : '$'}
//         </Addon>
//         <input
//           disabled={disabled}
//           {...field}
//           value={formatNumber(field?.value || 0, currencyId)}
//           placeholder={placeholder}
//           className={`${className} input input-md h-11 focus:ring-sky-400 focus-within:ring-sky-400 focus-within:border-sky-400 focus:border-sky-400`}
//           onChange={handleChange}
//         />
//       </InputGroup>
//     </>
//   )
// }

// export default FormattedNumberInput
