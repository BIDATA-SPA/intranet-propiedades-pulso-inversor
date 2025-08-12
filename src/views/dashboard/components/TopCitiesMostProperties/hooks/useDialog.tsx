import { useState } from 'react'




type TDialogStatuses = {
  see: boolean
}




const dialogStatus: TDialogStatuses = {
    see: false,
  }




const UseDialog = () => {
    const [openDialog, setOpenDialog] = useState(dialogStatus);




    const openSeeDialog = () => {
            setOpenDialog({
                see: true,
            })
    }




    const closeDialogs = ()=> {
        setOpenDialog({
            see: false,
        })
    }




    return {
        openDialog,
        openSeeDialog,
        closeDialogs
    }
}




export default UseDialog;