import { Dialog } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '../store'
import { setSelectedRow, toggleEmailDialog } from '../store/aliedRealtorSlice'
import EmailForm from './EmailForm'

const EmailDialog = () => {
  const dispatch = useAppDispatch()

  const emailDialogOpen = useAppSelector(
    (state) => state.aliedRealtorList.data.emailDialogOpen
  )

  const onDialogClose = () => {
    dispatch(toggleEmailDialog(false))
    setTimeout(() => {
      dispatch(setSelectedRow({}))
    }, 500)
  }

  return (
    <Dialog
      isOpen={emailDialogOpen}
      closable={true}
      width={500}
      onRequestClose={onDialogClose}
      onClose={onDialogClose}
    >
      <h5 className="mb-4">Solicitud de contacto</h5>
      <EmailForm />
    </Dialog>
  )
}

export default EmailDialog
