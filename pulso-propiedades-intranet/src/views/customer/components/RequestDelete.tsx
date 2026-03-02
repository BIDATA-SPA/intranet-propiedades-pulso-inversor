import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

const MainContent = () => {
  return (
    <>
      <div className="flex flex-col h-full justify-between">
        <h5 className="mb-4">Confirmar Eliminación</h5>
        <p>¿Estás seguro de que quieres eliminar este cliente?</p>
        <div className="text-right mt-6"></div>
      </div>
    </>
  )
}

const RequestDelete = ({ dialogIsOpen, onClose }) => {
  return (
    <Dialog isOpen={dialogIsOpen} onClose={onClose} onRequestClose={onClose}>
      <MainContent />
      <div className="text-right mt-6">
        <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          variant="solid"
          color="red-500"
          loading={false}
          onClick={onClose}
        >
          Eliminar
        </Button>
      </div>
    </Dialog>
  )
}

export default RequestDelete
