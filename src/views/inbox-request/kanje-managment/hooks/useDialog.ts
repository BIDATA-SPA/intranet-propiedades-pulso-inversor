import { useState } from 'react'

type TDialogStatuses = {
  details: boolean
  update: boolean
  delete: boolean
  preview: boolean
  rating: boolean
  approveRequest: boolean
  rejectRequest: boolean
}

const dialogStatuses: TDialogStatuses = {
  details: false,
  update: false,
  delete: false,
  preview: false,
  rating: false,
  approveRequest: false,
  rejectRequest: false,
}

const useDialog = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(dialogStatuses)

  const openDetailsDialog = () => {
    setDialogIsOpen({
      details: true,
      update: false,
      delete: false,
      preview: false,
      rating: false,
      approveRequest: false,
      rejectRequest: false,
    })
  }

  const openUpdateDialog = () => {
    setDialogIsOpen({
      details: false,
      update: true,
      delete: false,
      preview: false,
      rating: false,
      approveRequest: false,
      rejectRequest: false,
    })
  }

  const openDeleteDialog = () => {
    setDialogIsOpen({
      details: false,
      update: false,
      delete: true,
      preview: false,
      rating: false,
      approveRequest: false,
      rejectRequest: false,
    })
  }

  const openPreviewDialog = () => {
    setDialogIsOpen({
      details: false,
      update: false,
      delete: false,
      preview: true,
      rating: false,
      approveRequest: false,
      rejectRequest: false,
    })
  }

  const openRatingDialog = () => {
    setDialogIsOpen({
      details: false,
      update: false,
      delete: false,
      preview: false,
      rating: true,
      approveRequest: false,
      rejectRequest: false,
    })
  }

  const onDialogClose = () => {
    setDialogIsOpen({
      details: false,
      update: false,
      delete: false,
      preview: false,
      rating: false,
      approveRequest: false,
      rejectRequest: false,
    })
  }

  return {
    dialogIsOpen,
    openDetailsDialog,
    openUpdateDialog,
    openDeleteDialog,
    openPreviewDialog,
    openRatingDialog,
    onDialogClose,
    setDialogIsOpen,
  }
}

export default useDialog
