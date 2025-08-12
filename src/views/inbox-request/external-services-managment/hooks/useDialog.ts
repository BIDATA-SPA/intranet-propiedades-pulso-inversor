import { useState } from 'react'

type TDialogStatuses = {
  details: boolean
  feedback: boolean
}

const dialogStatuses: TDialogStatuses = { details: false, feedback: false }

const useDialog = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState(dialogStatuses)

  const openDetailsDialog = () => {
    setDialogIsOpen({ details: true, feedback: false })
  }

  const openFeedbackDialog = () => {
    setDialogIsOpen({ details: false, feedback: true })
  }

  const onDialogClose = () => {
    setDialogIsOpen({ details: false, feedback: false })
  }

  return { dialogIsOpen, openDetailsDialog, openFeedbackDialog, onDialogClose }
}

export default useDialog
