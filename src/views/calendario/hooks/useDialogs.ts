import { useState } from 'react'

type TDialogStatuses = {
  create: boolean
  update: boolean
  see: boolean
}

const dialogStatus: TDialogStatuses = {
    create: false,
    update: false,
    see: false,
  }

const UseDialog = () => {
    const [openDialog, setOpenDialog] = useState(dialogStatus);

    const openCreateDialog = () => {
        setOpenDialog({
            create: true,
            update: false,
            see: false, 
        })
    }
    const openUpdateDialog = () => {
        setOpenDialog({
            create: false,
            update: true,
            see: false, 
        })
    }
    const openSeeDialog = () => {
            setOpenDialog({
                create: false,
                update: false,
                see: true, 
            })
    }

    const closeDialogs = ()=> {
        setOpenDialog({
            create: false,
            update: false,
            see: false, 
        })
    }

    return {
        openDialog,
        openCreateDialog,
        openUpdateDialog,
        openSeeDialog,
        closeDialogs
    }
}

export default UseDialog;