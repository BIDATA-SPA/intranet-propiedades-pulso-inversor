import { useState } from 'react'

type TDialogStatuses = {
  createVisitOrder: boolean
  updateVisitOrder: boolean
}

const dialogStatus: TDialogStatuses = {
    createVisitOrder: false,
    updateVisitOrder: false,
  
  }

const UseDialogVisitOrd = () => {
    const [openDialogVisOrd, setOpenDialogVisOrd] = useState(dialogStatus);

    const openCreateDialogVisOrd = () => {
        setOpenDialogVisOrd({
            createVisitOrder: true,
            updateVisitOrder: false,
       
        })
    }
    const openUpdateDialogVisOrd = () => {
        setOpenDialogVisOrd({
            createVisitOrder: false,
            updateVisitOrder: true,
         
        })
    }

    const closeDialogsVisOrd = ()=> {
        setOpenDialogVisOrd({
            createVisitOrder: false,
            updateVisitOrder: false, 
        })
    }

    return {
        openDialogVisOrd,
        openCreateDialogVisOrd,
        openUpdateDialogVisOrd,
        closeDialogsVisOrd
    }
}

export default UseDialogVisitOrd;