import { Dialog } from '@/components/ui'
import CCSentEmailContent from './CCSentEmailContent'

const CCSentEmail = ({
  currentUser,
  dialogIds,
  setCurrentUser,
  isDialogOpen,
  onDialogClose,
}) => {
  return (
    <>
      {dialogIds.showPlans && (
        <Dialog
          isOpen={isDialogOpen(dialogIds.showPlans)}
          onClose={() => {
            onDialogClose()
            setCurrentUser(null)
          }}
          onRequestClose={() => {
            onDialogClose()
            setCurrentUser(null)
          }}
        >
          <CCSentEmailContent
            title="Con copia a:"
            subtitle="Lista de usuarios que recibieron una copia de esta solicitud."
            currentUser={currentUser}
          />
        </Dialog>
      )}
    </>
  )
}

export default CCSentEmail
