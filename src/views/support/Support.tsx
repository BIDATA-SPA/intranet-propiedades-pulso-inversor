import { AdaptableCard, Container } from '@/components/shared'
import { Button } from '@/components/ui'
import { useState } from 'react'
import RequestCreate from './components/RequestCreate'
import RequestDelete from './components/RequestDelete'
import RequestDetails from './components/RequestDetails'
import RequestTable from './components/RequestTable'
import useDialog from './hooks/useDialog'

const Support = () => {
  const [currentRequest, setCurrentRequest] = useState(null)
  const [currentRequestId, setCurrentRequestId] = useState<number | null>(null)
  const {
    dialogIsOpen,
    openCreateDialog,
    openDeleteDialog,
    openDetailsDialog,
    onDialogClose,
  } = useDialog()

  //   show create request dialog
  const handleShowCreate = () => {
    openCreateDialog()
  }

  //   show delete request dialog
  const handleShowDelete = (requestId) => {
    setCurrentRequestId(requestId)
    openDeleteDialog()
  }

  // Show details dialog
  const handleShowDetails = (requestItem) => {
    setCurrentRequest(requestItem)
    openDetailsDialog()
  }

  return (
    <Container className="h-full">
      <AdaptableCard>
        <div className="w-full flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg md:text-xl">Solicitudes de ayuda</h1>
          </div>

          <Button variant="solid" onClick={handleShowCreate}>
            Nueva solicitud
          </Button>
        </div>

        <RequestTable
          onShowDelete={handleShowDelete}
          onShowDetails={handleShowDetails}
        />
      </AdaptableCard>

      {/* Dialogs */}
      {dialogIsOpen.create && (
        <RequestCreate
          dialogIsOpen={dialogIsOpen.create}
          onClose={onDialogClose}
        />
      )}

      {dialogIsOpen.delete && (
        <RequestDelete
          dialogIsOpen={dialogIsOpen.delete}
          onClose={onDialogClose}
        />
      )}

      {dialogIsOpen.details && (
        <RequestDetails
          currentRequest={currentRequest}
          dialogIsOpen={dialogIsOpen.details}
          onClose={onDialogClose}
        />
      )}
    </Container>
  )
}

export default Support
