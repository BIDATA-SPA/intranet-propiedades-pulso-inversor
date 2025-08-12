import { useState } from 'react'
import useDialog from '../../hooks/useDialog'
import EmailDetails from './components/Sent/EmailDetails'
import EmailFeedback from './components/Sent/EmailFeedback'
import EmailTable from './components/Sent/EmailTable'
import Meta from './components/Sent/Meta'

const Sent = () => {
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

export default Sent
