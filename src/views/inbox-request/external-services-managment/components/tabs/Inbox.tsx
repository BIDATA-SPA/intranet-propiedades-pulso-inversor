import { useState } from 'react'
import useDialog from '../../hooks/useDialog'
import EmailDetails from './components/Inbox/EmailDetails'
import EmailFeedback from './components/Inbox/EmailFeedback'
import EmailTable from './components/Inbox/EmailTable'
import Meta from './components/Inbox/Meta'

const Inbox = () => {
  const [currentEmail, setCurrentEmail] = useState(null)
  const { dialogIsOpen, openDetailsDialog, openFeedbackDialog, onDialogClose } =
    useDialog()

  // Show email details dialog
  const handleShowDetails = (email) => {
    setCurrentEmail(email)
    openDetailsDialog()
  }

  // Show feedback dialog
  const handleShowFeedback = (email) => {
    setCurrentEmail(email)
    openFeedbackDialog()
  }

  return (
    <>
      <Meta />
      <EmailTable
        onShowDetails={handleShowDetails}
        onShowFeedback={handleShowFeedback}
      />
      {dialogIsOpen.details && (
        <EmailDetails
          dialogIsOpen={dialogIsOpen.details}
          currentEmail={currentEmail}
          onClose={onDialogClose}
        />
      )}
      {dialogIsOpen.feedback && (
        <EmailFeedback
          dialogIsOpen={dialogIsOpen.feedback}
          onClose={onDialogClose}
        />
      )}
    </>
  )
}

export default Inbox
