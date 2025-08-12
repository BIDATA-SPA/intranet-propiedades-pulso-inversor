import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

const MainContent = ({ currentEmail = {}, onClose }) => {
  const onSubmit = (e) => {
    e.preventDefault()
    onClose()
  }

  return (
    <>
      <form className="text-right mt-6" onSubmit={onSubmit}>
        <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="solid" type="submit">
          Enviar
        </Button>
      </form>
    </>
  )
}

const RejectedRequest = ({ currentEmail, isOpen, onClose }) => {
  return (
    <Dialog
      isOpen={isOpen}
      width={1000}
      height={250}
      onClose={onClose}
      onRequestClose={onClose}
    >
      <div className="flex flex-col h-full justify-between">
        <h5 className="mb-4">Firmar acuerdo de canje</h5>
        <MainContent currentEmail={currentEmail} onClose={onClose} />
      </div>
    </Dialog>
  )
}

export default RejectedRequest
