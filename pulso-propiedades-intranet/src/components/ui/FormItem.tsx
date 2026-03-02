import { ReactNode } from 'react'

interface FormItemProps {
  label?: string
  invalid?: boolean
  errorMessage?: string
  children: ReactNode
  className?: string
}

const FormItem = ({ label, invalid, errorMessage, children, className = '' }: FormItemProps) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-2">
          {label}
        </label>
      )}
      {children}
      {invalid && errorMessage && (
        <div className="text-red-500 text-sm mt-1">{errorMessage}</div>
      )}
    </div>
  )
}

export default FormItem
