import { useState } from 'react'

type TDialogStatuses = {
  details: boolean
  update: boolean
  delete: boolean
}

const dialogStatuses: TDialogStatuses = {
  details: false,
  update: false,
  delete: false,
}

const useDialog = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(dialogStatuses)

  const openDetailsDialog = () => {
    setDialogIsOpen({
      details: true,
      update: false,
      delete: false,
    })
  }

  const openUpdateDialog = () => {
    setDialogIsOpen({
      details: false,
      update: true,
      delete: false,
    })
  }

  const openDeleteDialog = () => {
    setDialogIsOpen({
      details: false,
      update: false,
      delete: true,
    })
  }

  const onDialogClose = () => {
    setDialogIsOpen({
      details: false,
      update: false,
      delete: false,
    })
  }

  return {
    dialogIsOpen,
    openDetailsDialog,
    openUpdateDialog,
    openDeleteDialog,
    onDialogClose,
  }
}

export default useDialog
