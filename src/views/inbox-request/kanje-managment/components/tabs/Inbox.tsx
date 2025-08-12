import { useState } from 'react'
import useDialog from '../../hooks/useDialog'
import EmailContract from './components/Inbox/EmailContract'
import EmailDetails from './components/Inbox/EmailDetails'
import EmailTable from './components/Inbox/EmailTable'
import EmailUpdate from './components/Inbox/EmailUpdate'
import Meta from './components/Inbox/Meta'
import UserRating from './components/Inbox/UserRating'

const Inbox = () => {
  const [currentEmail, setCurrentEmail] = useState(null)
  const {
    dialogIsOpen,
    openDetailsDialog,
    openUpdateDialog,
    openPreviewDialog,
    openRatingDialog,
    onDialogClose,
  } = useDialog()

  // Show email details dialog
  const handleShowDetails = (email) => {
    setCurrentEmail(email)
    openDetailsDialog()
  }

  const handleShowUpdate = (email) => {
    setCurrentEmail(email)
    openUpdateDialog()
  }

  const handleShowPreview = (email) => {
    setCurrentEmail(email)
    openPreviewDialog()
  }

  const handleRatingUser = (email) => {
    setCurrentEmail(email)
    openRatingDialog()
  }

  return (
    <>
      <Meta />

      <EmailTable
        onShowDetails={handleShowDetails}
        onShowUpdate={handleShowUpdate}
        onShowPreview={handleShowPreview}
        onShowRatingUser={handleRatingUser}
      />

      {dialogIsOpen.details && (
        <EmailDetails
          dialogIsOpen={dialogIsOpen.details}
          currentEmail={currentEmail}
          onClose={onDialogClose}
        />
      )}

      {dialogIsOpen.update && (
        <EmailUpdate
          dialogIsOpen={dialogIsOpen.update}
          currentEmail={currentEmail}
          onClose={onDialogClose}
        />
      )}

      {dialogIsOpen.preview && (
        <EmailContract
          dialogIsOpen={dialogIsOpen.preview}
          currentEmail={currentEmail}
          onClose={onDialogClose}
        />
      )}

      {dialogIsOpen.rating && (
        <UserRating
          dialogIsOpen={dialogIsOpen.rating}
          currentEmail={currentEmail}
          onClose={onDialogClose}
        />
      )}
    </>
  )
}

export default Inbox
