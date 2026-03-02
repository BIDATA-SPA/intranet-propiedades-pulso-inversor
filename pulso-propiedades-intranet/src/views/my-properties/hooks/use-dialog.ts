import { useState } from 'react'

export type DialogState = {
  [key: string]: boolean
}

export const useDialog = (initialState: DialogState) => {
  const [dialogState, setDialogState] = useState<DialogState>(initialState)

  const openDialog = (key: string) => {
    setDialogState((prevState) => ({ ...prevState, [key]: true }))
  }

  const closeDialog = (key: string) => {
    setDialogState((prevState) => ({ ...prevState, [key]: false }))
  }

  return {
    dialogState,
    openDialog,
    closeDialog,
  }
}
