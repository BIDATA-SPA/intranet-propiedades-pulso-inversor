import type { CommonProps } from '@/@types/common'

export interface SignUpFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

export type SignUpFormSchema = {
  name: string
  lastName: string
  dialCodeId: string
  phone: string
  email: string
  password: string
  referralCode?: string
  origin?: string
}
