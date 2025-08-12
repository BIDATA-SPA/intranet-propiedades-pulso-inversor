import { AdaptableCard, Container } from '@/components/shared'
import { Button } from '@/components/ui'
import { useState } from 'react'
import { FaRegLightbulb } from 'react-icons/fa'
import RequestCreate from './components/RequestCreate'
import RequestDelete from './components/RequestDelete'
import RequestDetails from './components/RequestDetails'
import RequestTable from './components/IdeasTable'
import useDialog from './hooks/useDialog'

const RealtorIdeas = () => {
  const [currentRequest, setCurrentRequest] = useState(null)
  const [_, setCurrentRequestId] = useState<number | null>(null)
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
            <h1 className="text-lg md:text-xl">Envíanos tus ideas</h1>
            <p>
              Tus ideas nos ayudaran a dar un mejor soporte y experiencia dentro
              de la plataforma.
            </p>
          </div>

          <Button
            variant="solid"
            className="flex items-center"
            onClick={handleShowCreate}
          >
            <FaRegLightbulb className="mr-2 text-lg" />
            Nueva idea
          </Button>
        </div>

        <RequestTable onShowDetails={handleShowDetails} />
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

export default RealtorIdeas
