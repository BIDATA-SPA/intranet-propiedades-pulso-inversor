import { Button, Dialog } from '@/components/ui'
import { FC, ReactNode } from 'react'

interface ShowDialogProps {
  title: string
  Content: ReactNode
  isOpen: boolean
  onClose: () => void
  onRequestClose: () => void
  closable : boolean
}

const ShowDialog: FC<ShowDialogProps> = ({
  title,
  Content,
  isOpen,
  onClose,
  onRequestClose,
  closable
}) => {
  return (
    <Dialog
      isOpen={isOpen}
      width={1000}
      onClose={onClose}
      onRequestClose={onRequestClose}
      closable={closable} 
    >
      <div className="flex flex-col h-full justify-between">
        <h5 className="mb-4">{title}</h5>
        <div className="max-h-96 overflow-y-auto">{Content}</div>
      </div>

      {/* { closable === true ? 
       <div className="text-right mt-6">
          <Button variant="twoTone" type="button" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="solid" type="button" onClick={onRequestClose}>
            Subir
          </Button>
       </div> :   <Button variant="twoTone" type="button" onClick={onClose}>
          Cerrar
        </Button>} */}

      <div className="text-right mt-6">
        <Button variant="twoTone" type="button" className='m-2' onClick={onClose} >
          Cerrar
        </Button>
        { closable === true ?  <Button variant="solid" type="button" className='m-2' onClick={onRequestClose}>
          Enviar
        </Button> :  " "}
     
      </div>
    </Dialog>
  )
}

export default ShowDialog
