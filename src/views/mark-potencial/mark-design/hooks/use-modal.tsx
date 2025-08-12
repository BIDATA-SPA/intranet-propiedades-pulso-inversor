import { useState } from 'react'

export type ModalState = {
  [key: string]: boolean
}

export const useModal = (initialState: ModalState) => {
  const [modalState, setModalState] = useState<ModalState>(initialState)

  const openModal = (key: string) => {
    setModalState((prevState) => ({ ...prevState, [key]: true }))
  }

  const closeModal = (key: string) => {
    setModalState((prevState) => ({ ...prevState, [key]: false }))
  }

  return {
    modalState,
    openModal,
    closeModal,
  }
}
