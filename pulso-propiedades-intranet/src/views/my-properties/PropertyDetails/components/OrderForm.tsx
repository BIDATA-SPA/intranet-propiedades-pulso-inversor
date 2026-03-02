import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useUpdateImageOrderMutation } from '@/services/RtkQueryService'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import SortableItem from './SortableItem'

interface OrderFormProps {
  images: { id: number; path: string; number: number | null }[]
  onClose?: () => void
}

const OrderForm = ({ images, onClose }: OrderFormProps) => {
  const [imageOrder, setImageOrder] = useState(images)
  const [updateImageOrder, { isLoading }] = useUpdateImageOrderMutation()
  const { propertyId } = useParams()

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setImageOrder((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleUpdateOrder = async () => {
    const payload = {
      id: propertyId,
      images: imageOrder
        .map((image, index) => {
          const imageId = Number(image.id)
          if (isNaN(imageId)) {
            openNotification(
              'danger',
              'Id de imagen invalido',
              'Imagen no encontrada',
              3
            )
            return null
          }

          return {
            id: imageId.toString(),
            number: index,
          }
        })
        .filter(Boolean),
    }

    try {
      const response = await updateImageOrder(payload).unwrap()
      if (response) {
        openNotification('success', 'Imágenes actualizadas exitosamente', '', 3)
      }
      if (onClose) onClose()
    } catch (error) {
      openNotification(
        'danger',
        'Error de actualización',
        'Hubo un problema al actualizar las imágenes',
        3
      )
      onClose()
    }
  }

  return (
    <>
      <div className="overflow-y-scroll pr-2 max-h-[600px]">
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={imageOrder} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {imageOrder.map((image) => (
                <SortableItem key={image.id} id={image.id} path={image.path} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>
      <div className="text-right bg-white dark:bg-gray-800 mx-10 pt-6">
        <Button className="ltr:mr-2 rtl:ml-2" variant="plain" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="solid" loading={isLoading} onClick={handleUpdateOrder}>
          Actualizar orden
        </Button>
      </div>
    </>
  )
}

export default OrderForm
