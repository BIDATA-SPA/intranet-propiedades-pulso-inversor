import { useState } from 'react'

export const useDialog = () => {
    const [openDialogId, setOpenDialogId] = useState<string | null>(null)

    const openDialog = (id: string) => setOpenDialogId(id)

    const onDialogClose = () => setOpenDialogId(null)

    const isDialogOpen = (id: string) => openDialogId === id

    return { isDialogOpen, openDialog, onDialogClose }
}
