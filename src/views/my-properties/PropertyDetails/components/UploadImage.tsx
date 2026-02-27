/* eslint-disable react/jsx-sort-props */
import { Button } from '@/components/ui'
import { useCreatePropertyImagesMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { HiOutlineTrash, HiOutlineUpload } from 'react-icons/hi'
import { PiDotsSixVerticalBold } from 'react-icons/pi'
import { useParams } from 'react-router'

import ImageList from './ImageList'

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const MAX_IMAGES = 30
const MIN_RESOLUTION = { w: 800, h: 600 }

export type PropertyType =
  | 'Casa'
  | 'Departamento'
  | 'Parcela'
  | 'Bodega'
  | 'Oficina'
  | 'Estacionamiento'
  | 'Terreno'
  | 'Industrial'
  | 'Local Comercial'
  | 'Agrícola'
  | 'Sitio'
  | 'Departamento Amoblado'
  | 'Casa Amoblada'
  | 'Sepultura'
  | string

type UploadImageProps = {
  images: readonly unknown[]
  propertyType?: PropertyType
}

const getMinImagesByType = (type?: PropertyType) => {
  if (!type) return 12

  switch (type) {
    case 'Estacionamiento':
      return 4
    case 'Local Comercial':
    case 'Agrícola':
    case 'Sitio':
    case 'Terreno':
    case 'Bodega':
      return 6
    case 'Casa':
    case 'Departamento':
    case 'Oficina':
    case 'Parcela':
    case 'Departamento Amoblado':
    case 'Casa Amoblada':
      return 12
    case 'Industrial':
    case 'Sepultura':
      return 6
    default:
      return 12
  }
}

const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png'])

const getImageMeta = (file: File): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const width = img.naturalWidth || img.width
      const height = img.naturalHeight || img.height
      URL.revokeObjectURL(url)
      resolve({ width, height })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen.'))
    }
    img.src = url
  })

/** Helpers */
const isImageFile = (f: File) => f.type?.startsWith('image/')
const fileKey = (f: File) => `${f.name}-${f.size}-${f.lastModified}`

/** Dedupe por nombre + tamaño + lastModified */
const dedupe = (arr: File[]) => {
  const seen = new Set<string>()
  return arr.filter((f) => {
    const key = fileKey(f)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/* ---------------------------
   ✅ SORTABLE PREVIEWS
---------------------------- */

type SortableFile = { id: string; file: File }

const SortableThumb: React.FC<{
  item: SortableFile
  index: number
  onRemove: () => void
  disabled?: boolean
}> = ({ item, index, onRemove, disabled }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.75 : 1,
  }

  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    const u = URL.createObjectURL(item.file)
    setUrl(u)
    return () => URL.revokeObjectURL(u)
  }, [item.file])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative z-0 rounded-2xl border border-neutral-200 bg-white p-2 shadow-sm"
    >
      <div className="absolute left-2 top-2 z-20 rounded-br-lg rounded-tl-xl bg-black/70 py-1 px-3 text-[11px] font-bold text-white">
        {index + 1}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        disabled={disabled}
        className="absolute right-3.5 bottom-12 z-30 pointer-events-auto rounded-md bg-white/80 p-1.5 shadow hover:bg-white disabled:opacity-60"
        aria-label="Eliminar"
        title="Eliminar"
      >
        <HiOutlineTrash className="text-lg text-red-500" />
      </button>

      <div className="aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
        <img
          src={url}
          alt={item.file.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-xs font-semibold text-neutral-700">
          {item.file.name}
        </p>

        <button
          type="button"
          disabled={disabled}
          className="flex items-center justify-center bg-sky-500 text-white cursor-grab rounded-xl border border-sky-200 px-2 py-1 text-xs font-bold hover:bg-sky-600 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Arrastrar para reordenar"
          title="Arrastrar para reordenar"
          {...attributes}
          {...listeners}
        >
          <PiDotsSixVerticalBold className="mr-1.5" />
          Mover
        </button>
      </div>
    </div>
  )
}

const SelectedImagesSortable: React.FC<{
  files: File[]
  setFiles: React.Dispatch<React.SetStateAction<File[]>>
  disabled?: boolean
}> = ({ files, setFiles, disabled }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  const items: SortableFile[] = useMemo(
    () => files.map((f) => ({ id: fileKey(f), file: f })),
    [files]
  )

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((i) => i.id === active.id)
    const newIndex = items.findIndex((i) => i.id === over.id)
    if (oldIndex < 0 || newIndex < 0) return

    setFiles((prev) => arrayMove(prev, oldIndex, newIndex))
  }

  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-extrabold text-neutral-900">
          Orden antes de publicar
        </h4>
        <p className="text-xs font-semibold text-neutral-500">
          Arrastra para ordenar (1 = principal)
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={disabled ? undefined : onDragEnd}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {items.map((it, idx) => (
              <SortableThumb
                key={it.id}
                item={it}
                index={idx}
                onRemove={() =>
                  setFiles((prev) => prev.filter((f) => fileKey(f) !== it.id))
                }
                disabled={disabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

/* ---------------------------
   ✅ MAIN COMPONENT (PULSO ONLY)
---------------------------- */
const UploadImagePulso: React.FC<UploadImageProps> = ({
  images,
  propertyType,
}) => {
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputKey, setInputKey] = useState<string>(() => String(Date.now()))
  const { propertyId } = useParams()
  const { showNotification } = useNotification()

  const [publishedImages, setPublishedImages] = useState<any[]>(() =>
    Array.isArray(images) ? [...(images as any[])] : []
  )

  useEffect(() => {
    setPublishedImages(Array.isArray(images) ? [...(images as any[])] : [])
  }, [images])

  const imageListKey = useMemo(() => {
    const ids = (publishedImages ?? [])
      .map((img) => String(img?.id ?? ''))
      .filter(Boolean)
    return ids.join('|') || 'empty'
  }, [publishedImages])

  // UX
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingText, setProcessingText] = useState<string | null>(null)

  const minRequired = getMinImagesByType(propertyType)

  // ✅ Pulso: subir imágenes
  const [createPropertyImages, { isLoading, error }] =
    useCreatePropertyImagesMutation()

  const alreadyPublished = publishedImages?.length ?? 0
  const isPublishedFull = alreadyPublished >= MAX_IMAGES

  const remainingSlots = Math.max(
    0,
    MAX_IMAGES - alreadyPublished - files.length
  )
  const canPickMore = remainingSlots > 0 && !isPublishedFull
  const willExceedOnPublish = alreadyPublished + files.length > MAX_IMAGES

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = ''
    setInputKey(String(Date.now()))
  }

  const handleCancelSelection = () => {
    if (files.length === 0) return
    setFiles([])
    setIsProcessing(false)
    setProcessingText(null)
    resetInput()
    showNotification(
      'info',
      'Selección cancelada',
      'Se eliminaron las imágenes seleccionadas (aún no publicadas).'
    )
  }

  const validateFile = async (
    file: File
  ): Promise<{ ok: boolean; reason?: string }> => {
    if (!isImageFile(file))
      return { ok: false, reason: 'Archivo no es una imagen.' }
    if (!ALLOWED_MIME.has(file.type))
      return { ok: false, reason: 'Formato no permitido. Solo JPG/JPEG/PNG.' }

    const { width, height } = await getImageMeta(file)

    if (width < MIN_RESOLUTION.w || height < MIN_RESOLUTION.h) {
      return {
        ok: false,
        reason: `Resolución insuficiente (${width}x${height}). Mínimo ${MIN_RESOLUTION.w}x${MIN_RESOLUTION.h}px.`,
      }
    }

    if (!(width > height)) {
      return {
        ok: false,
        reason: `La imagen debe ser horizontal. (${width}x${height}).`,
      }
    }

    return { ok: true }
  }

  const openFilePicker = () => {
    if (isPublishedFull) {
      showNotification(
        'warning',
        'Límite alcanzado',
        `Ya tienes ${MAX_IMAGES}/${MAX_IMAGES} imágenes publicadas. Elimina una imagen publicada para poder subir otra.`
      )
      return
    }
    if (!canPickMore) return
    inputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])
    if (selected.length === 0) return resetInput()

    if (!navigator.onLine) {
      showNotification(
        'warning',
        'Sin conexión',
        'Conéctate a internet para continuar.'
      )
      return resetInput()
    }

    if (remainingSlots <= 0) {
      showNotification(
        'danger',
        `Ya alcanzaste el máximo de ${MAX_IMAGES} imágenes.`,
        ''
      )
      return resetInput()
    }

    const filesToProcess = selected.slice(0, remainingSlots)

    setIsProcessing(true)
    setProcessingText(`Validando 0/${filesToProcess.length}…`)

    const accepted: File[] = []
    let done = 0

    for (const f of filesToProcess) {
      try {
        const result = await validateFile(f)
        done++
        setProcessingText(`Validando ${done}/${filesToProcess.length}…`)

        if (!result.ok) {
          showNotification(
            'warning',
            'Imagen rechazada',
            `La imagen "${f.name}" no cumple requisitos: ${result.reason}`
          )
          continue
        }
        accepted.push(f)
      } catch {
        done++
        setProcessingText(`Validando ${done}/${filesToProcess.length}…`)
        showNotification(
          'warning',
          'Imagen rechazada',
          `No se pudo validar la imagen "${f.name}".`
        )
      }
    }

    setFiles((prev) => dedupe([...prev, ...accepted]))

    setIsProcessing(false)
    setProcessingText(null)
    resetInput()
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!propertyId) {
      showNotification(
        'danger',
        'Error',
        'El ID de la propiedad no está definido.'
      )
      return
    }

    if (files.length === 0) {
      showNotification(
        'warning',
        'Sin imágenes',
        'Selecciona al menos una imagen para publicar.'
      )
      return
    }

    const totalAfter = alreadyPublished + files.length

    if (totalAfter < minRequired) {
      showNotification(
        'danger',
        'Cantidad insuficiente de imágenes',
        `Debes tener al menos ${minRequired} fotos para "${String(
          propertyType ?? 'Inmueble'
        )}". Actualmente tienes ${totalAfter}.`
      )
      return
    }

    if (totalAfter > MAX_IMAGES || willExceedOnPublish) {
      showNotification(
        'danger',
        'Cantidad excedida',
        `No puedes superar ${MAX_IMAGES} fotos. Actualmente tendrías ${totalAfter}.`
      )
      return
    }

    if (!navigator.onLine) {
      showNotification(
        'warning',
        'Sin conexión',
        'Conéctate a internet y reintenta publicar.'
      )
      return
    }

    const formData = new FormData()
    files.forEach((file) => formData.append('images', file, file.name))

    try {
      await createPropertyImages({
        id: String(propertyId),
        body: formData,
      }).unwrap()

      showNotification(
        'success',
        `${
          files.length > 1 ? 'Imágenes publicadas' : 'Imagen publicada'
        } en Pulso Propiedades`,
        ''
      )

      setFiles([])
      resetInput()
    } catch (err: any) {
      showNotification(
        'danger',
        err?.data?.message ||
          err?.error ||
          err?.message ||
          'Error al publicar imágenes.',
        ''
      )
      setFiles([])
      resetInput()
    }
  }

  const errorMessage = useMemo(() => {
    if (!error) return null
    const anyErr = error as any
    return (
      anyErr?.data?.message ||
      anyErr?.error ||
      anyErr?.message ||
      'Error al publicar imágenes.'
    )
  }, [error])

  useEffect(() => {
    if (!errorMessage) return
    showNotification('danger', errorMessage, '')
    setFiles([])
    resetInput()
  }, [errorMessage, showNotification])

  useEffect(() => {
    const onUp = () => setIsOnline(true)
    const onDown = () => setIsOnline(false)
    window.addEventListener('online', onUp)
    window.addEventListener('offline', onDown)
    return () => {
      window.removeEventListener('online', onUp)
      window.removeEventListener('offline', onDown)
    }
  }, [])

  const disabledAll = isLoading || isProcessing
  const totalAfterPublish = alreadyPublished + files.length

  return (
    <form className="w-full" onSubmit={onSubmit}>
      <div className="border-b pb-1 dark:border-b-gray-700">
        <h3 className="text-lg flex items-center gap-1">
          <HiOutlineUpload />
          Cargar imágenes
        </h3>

        <p>
          Tipo: <strong>{String(propertyType ?? 'Sin definir')}</strong>.
          Reglas: mínimo <strong>{minRequired}</strong>, máximo{' '}
          <strong>{MAX_IMAGES}</strong>. Formatos: <strong>JPG/JPEG/PNG</strong>
          . Resolución mínima:{' '}
          <strong>
            {MIN_RESOLUTION.w}x{MIN_RESOLUTION.h}px
          </strong>{' '}
          · Solo horizontal.
        </p>
      </div>

      {!isOnline && (
        <div className="my-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
          Sin conexión. Revisa tu internet antes de validar o publicar imágenes.
        </div>
      )}

      {isPublishedFull && (
        <div className="my-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-900">
          Límite alcanzado: ya hay {MAX_IMAGES}/{MAX_IMAGES} imágenes
          publicadas. Debes eliminar una imagen publicada para subir otra.
        </div>
      )}

      <div className="my-4 px-2 overflow-x-hidden">
        <div className="flex-col w-full mx-auto items-center justify-between gap-2">
          <div className="w-full lg:w-[70%] mx-auto">
            <button
              type="button"
              onClick={openFilePicker}
              disabled={!canPickMore || disabledAll}
              className={[
                'w-full rounded-full border-2 p-2 text-sm font-semibold',
                'transition',
                'bg-white dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-700',
                !canPickMore || disabledAll
                  ? 'cursor-not-allowed opacity-70 border-neutral-200'
                  : 'border-neutral-200 hover:border-sky-500/50 hover:bg-neutral-50',
              ].join(' ')}
              aria-label="Seleccionar imágenes"
              title="Seleccionar imágenes"
            >
              {isPublishedFull
                ? `Límite alcanzado (${MAX_IMAGES}/${MAX_IMAGES} publicadas).`
                : remainingSlots === MAX_IMAGES
                ? 'Seleccionar imágenes...'
                : remainingSlots > 0
                ? `Puedes agregar ${remainingSlots} imagen(es) más...`
                : 'Límite alcanzado'}
            </button>

            <input
              key={inputKey}
              ref={inputRef}
              multiple
              id="multiple_files"
              type="file"
              className="hidden"
              accept=".jpg,.jpeg,.png,image/jpeg,image/png"
              disabled={!canPickMore || disabledAll}
              onClick={(e) => {
                ;(e.currentTarget as HTMLInputElement).value = ''
              }}
              onChange={handleFileChange}
            />

            {isProcessing && (
              <div className="my-3 rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sm font-semibold text-sky-900">
                {processingText ?? 'Validando imágenes…'}
              </div>
            )}

            <p className="my-2 text-xs font-semibold text-neutral-500">
              Publicadas: {alreadyPublished}/{MAX_IMAGES} · Seleccionadas:{' '}
              {files.length} · Total: {totalAfterPublish}/{MAX_IMAGES}
            </p>
          </div>

          <div className="w-full flex-col items-center justify-center flex gap-3">
            <Button
              block
              type="submit"
              variant="solid"
              shape="circle"
              loading={isLoading}
              disabled={
                isPublishedFull ||
                files.length === 0 ||
                disabledAll ||
                !isOnline ||
                willExceedOnPublish
              }
              icon={<HiOutlineUpload />}
            >
              Publicar
              {files.length > 0 && ` (${files.length})`}
            </Button>

            <Button
              block
              type="button"
              variant="default"
              shape="circle"
              disabled={files.length === 0 || disabledAll}
              onClick={handleCancelSelection}
            >
              Cancelar
            </Button>

            <p className="text-xs font-semibold text-neutral-500">
              Mínimo requerido para `{String(propertyType ?? 'Inmueble')}`:{' '}
              {minRequired} · Total al publicar: {totalAfterPublish}
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <SelectedImagesSortable
            files={files}
            setFiles={setFiles}
            disabled={disabledAll}
          />
        )}

        <ImageList
          key={imageListKey}
          images={publishedImages as any}
          onImagesChange={(next: any[]) => setPublishedImages(next)}
        />
      </div>
    </form>
  )
}

export default UploadImagePulso
