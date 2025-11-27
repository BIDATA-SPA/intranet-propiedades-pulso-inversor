/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@/components/ui'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useUpdateImageOrderMutation } from '@/services/RtkQueryService'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { Suspense, useEffect, useState } from 'react'
import { LuArrowDownUp } from 'react-icons/lu'
import { RiUploadCloudFill } from 'react-icons/ri'
import { useParams } from 'react-router-dom'
import SortableItem from './SortableItem'

interface ImageListProps {
  images: { id: number; path: string; number: number }[]
}

const ImageList = ({ images }: ImageListProps) => {
  const [imageOrder, setImageOrder] = useState(images)
  const [isOrderChanged, setIsOrderChanged] = useState(false)
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
        const newOrder = arrayMove(items, oldIndex, newIndex)
        setIsOrderChanged(true)
        return newOrder
      })
    }
  }

  const handleUpdateOrder = async () => {
    const payload = {
      id: propertyId,
      images: imageOrder // imageOrder
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
        setIsOrderChanged(false)
      }
    } catch (error) {
      openNotification(
        'danger',
        'Error de actualización',
        'Hubo un problema al actualizar las imágenes',
        3
      )
    }
  }

  useEffect(() => {
    if (images?.length > 0) {
      setImageOrder(images)
    }
  }, [images])

  return (
    <div className="my-10">
      <div className="border-b pb-1 dark:border-b-gray-700">
        <h3 className="text-lg flex items-center gap-1">
          <RiUploadCloudFill />
          Imágenes publicadas
        </h3>
        <p>
          Fotos ya subidas y publicadas{' '}
          <strong>{`${
            images?.length > 0 ? `(${images?.length})` : `(${0})`
          }`}</strong>
          .
        </p>
      </div>{' '}
      <Suspense fallback={<p>Cargando imágenes...</p>}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={imageOrder}
            strategy={rectSortingStrategy}
            // imageOrder
          >
            <div className="text-center flex justify-end dark:bg-gray-800 my-4">
              <Button
                variant="solid"
                shape="circle"
                loading={isLoading}
                disabled={!isOrderChanged}
                className="flex items-center gap-1"
                onClick={handleUpdateOrder}
              >
                <LuArrowDownUp />
                {isLoading ? 'Guardando...' : 'Guardar orden'}
              </Button>
            </div>

            {!imageOrder?.length && (
              <div className="flex w-full text-center justify-center">
                <p>Aún no se han publicado Imágenes de esta propiedad</p>
              </div>
            )}

            <div className="w-full overflow-x-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
              {imageOrder?.length > 0
                ? imageOrder?.map((image, index) => (
                    <SortableItem
                      key={image.id}
                      id={image.id}
                      path={image.path}
                      index={index}
                    />
                  ))
                : null}
            </div>
          </SortableContext>
        </DndContext>
      </Suspense>
    </div>
  )
}

export default ImageList
