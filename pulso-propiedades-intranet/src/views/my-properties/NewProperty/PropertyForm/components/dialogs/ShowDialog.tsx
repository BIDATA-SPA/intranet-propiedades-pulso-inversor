import { Button, Dialog } from '@/components/ui'
import { FC, ReactNode } from 'react'

interface ShowDialogProps {
    title?: string
    Content: ReactNode
    isOpen: boolean
    onClose: () => void
    onRequestClose: () => void
    closable?: boolean
    submitted?: boolean
    width?: number
    height?: number
}

const ShowDialog: FC<ShowDialogProps> = ({
    title,
    Content,
    isOpen,
    onClose,
    onRequestClose,
    closable,
    width,
    height,
}) => {
    return (
        <Dialog
            isOpen={isOpen}
            width={width}
            height={height}
            closable={closable}
            onClose={onClose}
            onRequestClose={onRequestClose}
        >
            <div className="flex flex-col h-full justify-between">
                <h5 className="mb-4">{title}</h5>
                <div className="overflow-y-auto">{Content}</div>
            </div>

            <div className="text-right mt-6">
                <Button
                    variant="twoTone"
                    type="button"
                    className="m-2"
                    onClick={onClose}
                >
                    Cancelar
                </Button>

                {closable && (
                    <Button
                        variant="solid"
                        type="button"
                        className="m-2"
                        onClick={onRequestClose}
                    >
                        Confirmar
                    </Button>
                )}
            </div>
        </Dialog>
    )
}

export default ShowDialog
