// User avatar form
export type ProfileFormModel = {
  avatar: string
}

export type ProfileProps = {
  data?: ProfileFormModel
}

// User Profile form
export type MyProfileFormModel = {
  name: string
  paternalSurname: string
  maternalSurname: string
  rut: string
  address: {
    country: {
      value: number
      label: string
    }
    state: {
      value: number
      label: string
    }
    city: {
      value: number
      label: string
    }
    street: string
  }
  birthday: Date | string
  height: number
  weight: number
  hand: {
    id: 'diestro' | 'zurdo'
    name: 'Diestro' | 'Zurdp'
  }
  backhand: {
    id: 'reves_a_dos_manos' | 'reves_a_una_mano'
    name: 'Revés a dos manos' | 'Revés a una mano'
  }
  trainersName: string
  instagramProfile: string
  avatar?: string
}

export type SelectOptions = {
  value: string
  label: string
}
