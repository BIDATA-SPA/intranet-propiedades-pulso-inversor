import { useState } from 'react'

type DialogType = 'create' | 'update' | 'delete' | null

export const useFileDialog = () => {
  const [openDialog, setOpenDialog] = useState<DialogType>(null)

  const openDialogOfType = (dialogType: DialogType): void => {
    setOpenDialog(dialogType)
  }

  const onDialogClose = (): void => {
    setOpenDialog(null)
  }

  return {
    openDialog,
    openDialogOfType,
    onDialogClose,
  }
}
