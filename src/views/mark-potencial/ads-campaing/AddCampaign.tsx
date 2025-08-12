import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import CampaignTable from './components/CampaignsTable'
import RequestCreate from './components/RequestCreate'
import useDialog from './hooks/useDialog'

const AddCampaign = () => {
  const { dialogIsOpen, openCreateDialog, onDialogClose } = useDialog()

  const handleShowCreate = () => {
    openCreateDialog()
  }

  return (
    <Container className="h-full">
      <AdaptableCard className="h-full" bodyClass="h-full">
        <div className="w-full flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg md:text-xl">Campaña Publicitaria</h1>
          </div>
          <Button variant="solid" onClick={handleShowCreate}>
            Nueva solicitud
          </Button>
        </div>

        <CampaignTable />
      </AdaptableCard>

      {dialogIsOpen.create && (
        <RequestCreate
          dialogIsOpen={dialogIsOpen.create}
          onClose={onDialogClose}
        />
      )}
    </Container>
  )
}

export default AddCampaign
