import { useState } from 'react'
import useDialog from '../../hooks/useDialog'
import EmailContract from './components/Inbox/EmailContract'
import EmailDetails from './components/Sent/EmailDetails'
import EmailTable from './components/Sent/EmailTable'
import Meta from './components/Sent/Meta'
import UserRating from './components/Sent/UserRating'

const Sent = () => {
  const [currentEmail, setCurrentEmail] = useState(null)
  const {
    dialogIsOpen,
    openDetailsDialog,
    openPreviewDialog,
    onDialogClose,
    openRatingDialog,
  } = useDialog()

  // Show email details dialog
  const handleShowDetails = (email) => {
    setCurrentEmail(email)
    openDetailsDialog()
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

export default Sent
