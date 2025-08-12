import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

const MainContent = () => {
  return <>Content</>
}

const EmailFeedback = ({ dialogIsOpen, onClose }) => {
  return (
    <Dialog isOpen={dialogIsOpen} onClose={onClose} onRequestClose={onClose}>
      <h5 className="mb-4">Feedback</h5>
      <MainContent />
      <div className="text-right mt-6">
        <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="solid" onClick={onClose}>
          Entendido
        </Button>
      </div>
    </Dialog>
  )
}

export default EmailFeedback
