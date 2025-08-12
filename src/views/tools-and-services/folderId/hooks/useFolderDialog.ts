import { useState } from 'react'

export const useFolderDialog = () => {
  const [dialogIsOpen, setDialogIsOpen] = useState({
    add: false,
    edit: false,
    delete: false,
  })

  const openFolderAdd = () => {
    setDialogIsOpen({ add: true, edit: false, delete: false })
  }

  const openFolderEdit = () => {
    setDialogIsOpen({ add: false, edit: true, delete: false })
  }

  const openFolderDelete = () => {
    setDialogIsOpen({ add: false, edit: false, delete: true })
  }

  const onFolderClose = () => {
    setDialogIsOpen({ add: false, edit: false, delete: false })
  }

  const onFolderOk = () => {
    setDialogIsOpen({ add: false, edit: false, delete: false })
  }

  return {
    dialogIsOpen,
    openFolderAdd,
    openFolderEdit,
    openFolderDelete,
    onFolderClose,
    onFolderOk,
  }
}
