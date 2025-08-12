import { useState } from 'react'

type TDialogStatuses = {
  create: boolean
  delete: boolean
  details: boolean
}

const dialogStatuses: TDialogStatuses = {
  create: false,
  delete: false,
  details: false,
}

const useDialog = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(dialogStatuses)

  const openCreateDialog = () => {
    setDialogIsOpen({
      create: true,
      delete: false,
      details: false,
    })
  }

  const openDeleteDialog = () => {
    setDialogIsOpen({
      create: false,
      delete: true,
      details: false,
    })
  }

  const openDetailsDialog = () => {
    setDialogIsOpen({
      create: false,
      delete: false,
      details: true,
    })
  }

  const onDialogClose = () => {
    setDialogIsOpen({ create: false, delete: false, details: false })
  }

  return {
    dialogIsOpen,
    openCreateDialog,
    openDeleteDialog,
    openDetailsDialog,
    onDialogClose,
  }
}

export default useDialog
