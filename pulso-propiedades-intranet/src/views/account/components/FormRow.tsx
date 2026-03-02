import { FormItem } from '@/components/ui/Form'
import classNames from 'classnames'
import type { FormikErrors, FormikTouched } from 'formik'
import type { PropsWithChildren } from 'react'

type FormRow<T> = PropsWithChildren<{
  label: string
  errors: FormikErrors<T>
  touched: FormikTouched<T>
  name: keyof T
  border?: boolean
  alignCenter?: boolean
}>

const FormRow = <T extends Record<string, unknown>>(props: FormRow<T>) => {
  const {
    label,
    children,
    errors,
    touched,
    name,
    border = true,
    alignCenter = true,
  } = props

  return (
    <div
      className={classNames(
        'grid py-5',
        border && 'border-b border-gray-200 dark:border-gray-600',
        alignCenter && 'items-center'
      )}
    >
      <div className="font-semibold">{label}</div>
      <div className="col-span-2">
        <FormItem
          className="mb-0 max-w-[700px]"
          invalid={(errors[name] && touched[name]) as boolean}
          errorMessage={errors[name] as string}
        >
          {children}
        </FormItem>
      </div>
    </div>
  )
}

export default FormRow
