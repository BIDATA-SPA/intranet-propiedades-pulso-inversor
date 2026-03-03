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
import Lightbox from 'yet-another-react-lightbox'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import 'yet-another-react-lightbox/plugins/counter.css'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/plugins/thumbnails.css'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import 'yet-another-react-lightbox/styles.css'
import SortableItem from './SortableItem'

interface ImageListProps {
  images: { id: number; path: string; number: number }[]
  onSyncPortalOrder?: (orderedUrls: string[]) => Promise<void>
  isSyncingPortal?: boolean
}

const ImageList = ({
  images,
  onSyncPortalOrder,
  isSyncingPortal,
}: ImageListProps) => {
  const [imageOrder, setImageOrder] = useState(images)
  const [isOrderChanged, setIsOrderChanged] = useState(false)
  const [updateImageOrder, { isLoading }] = useUpdateImageOrderMutation()
  const { propertyId } = useParams()

  const [previewIndex, setPreviewIndex] = useState<number>(-1)
  const isPreviewOpen = previewIndex >= 0

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
          return { id: imageId, number: index }
        })
        .filter(
          (item): item is { id: number; number: number } => item !== null
        ),
    }

    try {
      // 1) Guardar en Procanje
      await updateImageOrder(payload).unwrap()

      // 2) Sincronizar a PDP en el mismo orden
      if (onSyncPortalOrder) {
        const orderedUrls = imageOrder
          .map((img) => String(img.path || '').trim())
          .filter(Boolean)

        await onSyncPortalOrder(orderedUrls)
      }

      openNotification('success', 'Imágenes actualizadas exitosamente', '', 3)
      setIsOrderChanged(false)
    } catch (error: any) {
      openNotification(
        'danger',
        'Error de actualización',
        error?.data?.message ||
          error?.message ||
          'Hubo un problema al actualizar las imágenes',
        3
      )
    }
  }

  const handlePreviewImage = (index: number) => {
    if (index >= 0 && index < imageOrder.length) {
      setPreviewIndex(index)
    }
  }

  const handleClosePreview = () => {
    setPreviewIndex(-1)
  }

  const slides = imageOrder.map((image) => ({
    src: image.path,
  }))

  useEffect(() => {
    if (isPreviewOpen && previewIndex >= imageOrder.length) {
      const newIndex = Math.max(0, imageOrder.length - 1)
      setPreviewIndex(imageOrder.length > 0 ? newIndex : -1)
    }
  }, [imageOrder.length, isPreviewOpen, previewIndex])

  useEffect(() => {
    const next = images ?? []

    setImageOrder((prev) => {
      const prevIds = prev.map((i) => i.id).join('|')
      const nextIds = next.map((i) => i.id).join('|')
      if (prevIds === nextIds) return prev
      return next
    })

    setIsOrderChanged(false)
  }, [images])

  if (!imageOrder?.length) {
    return (
      <div className="my-10">
        <div className="border-b pb-1 dark:border-b-gray-700">
          <h3 className="text-lg flex items-center gap-1">
            <RiUploadCloudFill />
            Imágenes publicadas
          </h3>
          <p>
            Fotos ya subidas y publicadas <strong>(0)</strong>.
          </p>
        </div>
        <div className="flex w-full text-center justify-center my-4">
          <p>Aún no se han publicado Imágenes de esta propiedad</p>
        </div>
      </div>
    )
  }

  return (
    <div className="my-10">
      <div className="border-b pb-1 dark:border-b-gray-700">
        <h3 className="text-lg flex items-center gap-1">
          <RiUploadCloudFill />
          Imágenes publicadas
        </h3>
        <p>
          Fotos ya subidas y publicadas <strong>({imageOrder.length})</strong>.
        </p>
      </div>{' '}
      <Suspense fallback={<p>Cargando imágenes...</p>}>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={imageOrder} strategy={rectSortingStrategy}>
            <div className="text-center flex justify-end dark:bg-gray-800 my-4">
              <Button
                variant="solid"
                shape="circle"
                loading={isLoading || !!isSyncingPortal}
                disabled={!isOrderChanged || isLoading || !!isSyncingPortal}
                className="flex items-center gap-1"
                onClick={handleUpdateOrder}
              >
                <LuArrowDownUp />
                {isLoading || isSyncingPortal
                  ? 'Guardando...'
                  : 'Guardar orden'}
              </Button>
            </div>

            <div className="w-full overflow-x-hidden grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4">
              {imageOrder.map((image, index) => (
                <SortableItem
                  key={image.id}
                  id={image.id}
                  path={image.path}
                  index={index}
                  onPreview={handlePreviewImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </Suspense>
      <Lightbox
        open={isPreviewOpen}
        close={handleClosePreview}
        index={previewIndex}
        slides={slides}
        plugins={[Zoom, Counter, Fullscreen, Thumbnails]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
          scrollToZoom: true,
        }}
        counter={{
          container: {
            style: {
              top: 'unset',
              bottom: 0,
              fontSize: '16px',
              fontWeight: '600',
              color: '#fff',
            },
          },
        }}
        thumbnails={{
          position: 'bottom',
          width: 120,
          height: 80,
          border: 2,
          borderRadius: 4,
          padding: 4,
          gap: 12,
        }}
        carousel={{
          finite: false,
          preload: 2,
          padding: 0,
          spacing: 0,
        }}
        controller={{
          closeOnBackdropClick: true,
        }}
        on={{
          entered: () => {
            document.body.style.overflow = 'hidden'
          },
          exited: () => {
            document.body.style.overflow = ''
          },
        }}
        styles={{
          container: {
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
          },
          slide: {
            maxWidth: '90vw',
            maxHeight: '90vh',
          },
          thumbnailsContainer: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
          },
        }}
      />
    </div>
  )
}

export default ImageList
