import Dialog from '@/components/ui/Dialog'

interface OrderDialog {
  render: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

const OrderDialog = ({ renderComponent, isOpen, onClose }) => {
  return (
    <Dialog
      isOpen={isOpen}
      width={800}
      className="relative"
      onClose={onClose}
      onRequestClose={onClose}
    >
      <h5 className="mb-4">Ordenar Imágenes</h5>
      {renderComponent}
    </Dialog>
  )
}

export default OrderDialog
