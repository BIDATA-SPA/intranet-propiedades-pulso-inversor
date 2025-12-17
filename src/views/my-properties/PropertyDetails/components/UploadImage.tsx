import type { CommonProps } from '@/@types/common'
import { Button } from '@/components/ui'
import {
  useCreatePropertyImagesMutation,
  useLazyFindPortalPublicationsQuery,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { usePdpSecureActions } from '@/utils/hooks/usePdpSecureActions'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { HiOutlineUpload } from 'react-icons/hi'
import { IoCloseOutline } from 'react-icons/io5'
import { VscFile, VscFilePdf, VscFileZip } from 'react-icons/vsc'
import { useParams } from 'react-router'
import ImageList from './ImageList'

/**
 * Reglas:
 * - Máximo global: 30
 * - Mínimo depende del tipo de inmueble (propertyType)
 * - Formatos válidos: jpg, jpeg, png
 * - Resolución mínima: 800x600
 * - Orientación: horizontal (width > height)
 * - Prohibido watermark/logos/banners/textos: no detectable 100% sin CV
 */

const API_BASE = import.meta.env.VITE_API_URL

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

/** Builder genérico para servir imágenes por nombre si el backend lo requiere */
const buildPropertyImageUrl = (name: string) =>
  `${API_BASE}/properties/image/${encodeURIComponent(name)}`

/** Normaliza arreglo de URLs desde la respuesta del backend */
const extractImageUrls = (res: any): string[] => {
  if (Array.isArray(res?.urls)) return res.urls.filter(Boolean)
  if (Array.isArray(res?.data?.urls)) return res.data.urls.filter(Boolean)

  const arr =
    (Array.isArray(res?.images) && res.images) ||
    (Array.isArray(res?.data?.images) && res.data.images) ||
    []

  const urls: string[] = []
  for (const it of arr) {
    const direct = it?.url
    const nameOrPath = it?.name || it?.path
    if (typeof direct === 'string' && direct) {
      urls.push(direct)
    } else if (typeof nameOrPath === 'string' && nameOrPath) {
      const looksAbsolute = /^https?:\/\//i.test(nameOrPath)
      urls.push(looksAbsolute ? nameOrPath : buildPropertyImageUrl(nameOrPath))
    }
  }
  return urls.filter(Boolean)
}

/**
 * Mínimos por tipo (matching exacto según tus labels)
 * - 12: Casa, Departamento, Oficina, Parcela, Amoblados
 * - 6: Local Comercial, Agrícola, Sitio, Terreno, Bodega
 * - 4: Estacionamiento
 * - Industrial / Sepultura: por defecto 6 (ajústalo si negocio define otra cosa)
 * - default: 12
 */
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

/** Ícono genérico para archivos no-imagen (se conserva por si el usuario intenta) */
const FileIcon: React.FC<CommonProps> = ({ children }) => {
  return <span className="text-4xl">{children}</span>
}

/** Item de preview con manejo de URL.createObjectURL seguro */
const PreviewFileItem: React.FC<{
  file: File
  onRemove: () => void
  getKB: (bytes: number) => number
}> = ({ file, onRemove, getKB }) => {
  const isImage = file?.type?.startsWith('image/')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!isImage) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file, isImage])

  const renderThumb = () => {
    if (isImage && previewUrl) {
      return (
        <img
          className="upload-file-image"
          src={previewUrl}
          alt={`vista-previa-${file.name}`}
        />
      )
    }
    if (file?.type === 'application/zip') {
      return (
        <FileIcon>
          <VscFileZip />
        </FileIcon>
      )
    }
    if (file?.type === 'application/pdf') {
      return (
        <FileIcon>
          <VscFilePdf />
        </FileIcon>
      )
    }
    return (
      <FileIcon>
        <VscFile />
      </FileIcon>
    )
  }

  return (
    <div className="upload-file mt-5">
      <div className="flex">
        <div className="upload-file-thumbnail">{renderThumb()}</div>
        <div className="upload-file-info">
          <h6 className="upload-file-name">{file?.name}</h6>
          <span className="upload-file-size">{getKB(file?.size)} kb</span>
        </div>
      </div>
      <div
        className="close-btn upload-file-remove"
        role="button"
        aria-label="Eliminar imagen seleccionada"
        title="Eliminar imagen seleccionada"
        onClick={onRemove}
      >
        <IoCloseOutline />
      </div>
    </div>
  )
}

const UploadImage: React.FC<UploadImageProps> = ({ images, propertyType }) => {
  const [files, setFiles] = useState<File[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [inputKey, setInputKey] = useState<string>(() => String(Date.now()))
  const { propertyId } = useParams()
  const { showNotification } = useNotification()

  const minRequired = getMinImagesByType(propertyType)

  // Procanje: subir imágenes
  const [createPropertyImages, { isLoading, error, isSuccess }] =
    useCreatePropertyImagesMutation()

  // PDP: buscar por code
  const [findPortalByCode] = useLazyFindPortalPublicationsQuery()

  // 🔐 hook seguro PDP (para update con token)
  const { ensureToken, secureUpdate } = usePdpSecureActions()
  const [isSyncingPortal, setIsSyncingPortal] = useState(false)

  const BYTE = 1000
  const getKB = (bytes: number) => Math.round(bytes / BYTE)

  const alreadyPublished = images?.length ?? 0
  const currentTotal = alreadyPublished + files.length
  const isMaxReached = currentTotal >= MAX_IMAGES
  const remainingSlots = Math.max(
    0,
    MAX_IMAGES - alreadyPublished - files.length
  )

  /** Eliminar por índice */
  const handleUploadedImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  /** Dedupe por nombre + tamaño + lastModified */
  const dedupe = (arr: File[]) => {
    const seen = new Set<string>()
    return arr.filter((f) => {
      const key = `${f.name}-${f.size}-${f.lastModified}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }

  const validateFile = async (
    file: File
  ): Promise<{ ok: boolean; reason?: string }> => {
    // 0) debe ser imagen (por si alguien forza input)
    if (!file?.type?.startsWith('image/')) {
      return { ok: false, reason: 'Archivo no es una imagen.' }
    }

    // 1) formato
    if (!ALLOWED_MIME.has(file.type)) {
      return { ok: false, reason: 'Formato no permitido. Solo JPG/JPEG/PNG.' }
    }

    // 2) dimensiones + orientación
    const { width, height } = await getImageMeta(file)

    if (width < MIN_RESOLUTION.w || height < MIN_RESOLUTION.h) {
      return {
        ok: false,
        reason: `Resolución insuficiente (${width}x${height}). Mínimo ${MIN_RESOLUTION.w}x${MIN_RESOLUTION.h}px.`,
      }
    }

    // Horizontal estricto: width > height
    if (!(width > height)) {
      return {
        ok: false,
        reason: `La imagen debe ser horizontal. (${width}x${height}).`,
      }
    }

    return { ok: true }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? [])

    if (selected.length === 0) {
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    if (remainingSlots <= 0) {
      showNotification(
        'danger',
        `Ya alcanzaste el máximo de ${MAX_IMAGES} imágenes.`,
        ''
      )
      if (inputRef.current) inputRef.current.value = ''
      setInputKey(String(Date.now()))
      return
    }

    const filesToProcess = selected.slice(0, remainingSlots)

    const accepted: File[] = []
    for (const f of filesToProcess) {
      try {
        const result = await validateFile(f)
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
        showNotification(
          'warning',
          'Imagen rechazada',
          `No se pudo validar la imagen "${f.name}".`
        )
      }
    }

    setFiles((prev) => dedupe([...prev, ...accepted]))

    if (inputRef.current) inputRef.current.value = ''
    setInputKey(String(Date.now()))
  }

  const syncImagesToPortal = async (urls: string[]) => {
    if (!propertyId || urls.length === 0) return

    try {
      setIsSyncingPortal(true)

      // 1) token PDP válido
      const pdpToken = await ensureToken()

      // 2) Buscar publicaciones del portal por code (id local)
      const found = await findPortalByCode({
        code: String(propertyId),
        page: 1,
        page_size: 100,
        pdpToken,
      }).unwrap()

      const items: any[] = Array.isArray(found)
        ? found
        : found?.items ?? found?.data ?? []

      // ⚠️ Ojo: tu filtro anterior mezclaba cases. Dejamos robusto:
      const uuids = items
        .filter((i) => {
          const portal = String(i?.portal ?? '')
            .trim()
            .toLowerCase()
          return portal === 'pulsopropiedades' && typeof i?.uuid === 'string'
        })
        .map((i) => i.uuid as string)

      if (uuids.length === 0) {
        showNotification(
          'warning',
          'Portal de Portales',
          'No se encontró publicación para esta propiedad; se sincronizarán las imágenes cuando esté publicada.'
        )
        return
      }

      const results = await Promise.allSettled(
        uuids.map((uuid) => secureUpdate(uuid, { images: urls }))
      )

      const ok = results.filter((r) => r.status === 'fulfilled').length
      const fail = uuids.length - ok

      if (ok > 0) {
        showNotification(
          'success',
          'Portal de Portales',
          `Imágenes sincronizadas (${ok}/${uuids.length}).`
        )
      }
      if (fail > 0) {
        showNotification(
          'warning',
          'Portal de Portales',
          `Algunas publicaciones no pudieron actualizarse (${fail}/${uuids.length}).`
        )
      }
    } catch (err: any) {
      showNotification(
        'danger',
        'Portal de Portales',
        err?.message || 'No se pudo sincronizar imágenes en el portal.'
      )
    } finally {
      setIsSyncingPortal(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!propertyId) {
      throw new Error('El ID de la propiedad no está definido.')
    }

    if (files.length === 0) return

    // ✅ Regla global: mínimo/máximo considerando ya publicadas + seleccionadas
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

    if (totalAfter > MAX_IMAGES) {
      showNotification(
        'danger',
        'Cantidad excedida',
        `No puedes superar ${MAX_IMAGES} fotos. Actualmente tendrías ${totalAfter}.`
      )
      return
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file, file.name)
    })

    try {
      const res = await createPropertyImages({
        id: propertyId as string,
        body: formData,
      }).unwrap()

      showNotification(
        'success',
        `${
          files.length > 1 ? 'Imágenes publicadas' : 'Imagen publicada'
        } en Procanje`,
        ''
      )

      const urls = extractImageUrls(res)
      if (urls.length > 0) {
        await syncImagesToPortal(urls)
      } else {
        showNotification(
          'warning',
          'Imágenes publicadas, pero sin URLs para el portal',
          'Revisa el payload de respuesta del backend.'
        )
      }

      // Reset UI
      setFiles([])
      if (inputRef.current) inputRef.current.value = ''
      setInputKey(String(Date.now()))
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
      if (inputRef.current) inputRef.current.value = ''
      setInputKey(String(Date.now()))
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
    if (inputRef.current) inputRef.current.value = ''
    setInputKey(String(Date.now()))
  }, [errorMessage, showNotification])

  useEffect(() => {
    // noop
  }, [isSuccess])

  return (
    <form className="w-full" onSubmit={onSubmit}>
      <div className="border-b pb-1 dark:border-b-gray-700">
        <h3 className="text-lg flex items-center gap-1">
          <HiOutlineUpload />
          Cargar imágenes
        </h3>

        <p>
          Tipo: <strong>{String(propertyType ?? 'Sin definir')}</strong>.
          Reglas: mínimo <strong>{minRequired}</strong> fotos, máximo{' '}
          <strong>{MAX_IMAGES}</strong>. Formatos: <strong>JPG/JPEG/PNG</strong>
          . Resolución mínima:{' '}
          <strong>
            {MIN_RESOLUTION.w}x{MIN_RESOLUTION.h}px
          </strong>
          . Solo horizontal.
        </p>
      </div>

      <div className="my-4 px-2 overflow-x-hidden">
        <div className="w-full lg:w-[60%] mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-[70%]">
            <label className="block cursor-pointer" htmlFor="multiple_files">
              <span className="sr-only">Seleccionar imágenes</span>

              <div
                className={`block text-black bg-white dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-700 ${
                  isMaxReached
                    ? 'cursor-not-allowed opacity-70'
                    : 'hover:border-lime-500/50 hover:bg-neutral-50 cursor-pointer'
                } border-2 border-neutral-200 p-1 rounded-full w-full text-sm text-black/50 text-center py-2`}
              >
                {isMaxReached
                  ? 'Límite alcanzado'
                  : remainingSlots === MAX_IMAGES
                  ? 'Seleccionar imágenes...'
                  : `Puedes agregar ${remainingSlots} imagen(es) más...`}
              </div>

              <input
                key={inputKey}
                ref={inputRef}
                multiple
                id="multiple_files"
                type="file"
                className="hidden"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                disabled={isMaxReached}
                onClick={(e) => {
                  ;(e.currentTarget as HTMLInputElement).value = ''
                }}
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="w-full lg:w-[30%] mt-2 lg:mt-0">
            <Button
              block
              type="submit"
              className="mx-2"
              variant="solid"
              shape="circle"
              loading={isLoading || isSyncingPortal}
              disabled={isMaxReached || files.length === 0}
              icon={<HiOutlineUpload />}
            >
              {isSyncingPortal ? 'Sincronizando…' : 'Publicar'}
              {files.length > 0 && !isSyncingPortal && ` (${files.length})`}
            </Button>
          </div>
        </div>

        {/* PREVIEWS SELECCIONADOS */}
        {files.length > 0 &&
          files.map((file, index) => (
            <PreviewFileItem
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              file={file}
              getKB={getKB}
              onRemove={() => handleUploadedImage(index)}
            />
          ))}

        {/* LISTA DE IMÁGENES YA PUBLICADAS */}
        <ImageList images={images as any} />
      </div>
    </form>
  )
}

export default UploadImage

// ✅✅
// import { CommonProps } from '@/@types/common'
// import { Button } from '@/components/ui'
// import {
//   useCreatePropertyImagesMutation,
//   // seguimos usando el find del portal
//   useLazyFindPortalPublicationsQuery,
// } from '@/services/RtkQueryService'
// import useNotification from '@/utils/hooks/useNotification'
// import { usePdpSecureActions } from '@/utils/hooks/usePdpSecureActions'
// import React, { useEffect, useMemo, useRef, useState } from 'react'
// import { HiOutlineUpload } from 'react-icons/hi'
// import { IoCloseOutline } from 'react-icons/io5'
// import { VscFile, VscFilePdf, VscFileZip } from 'react-icons/vsc'
// import { useParams } from 'react-router'
// import ImageList from './ImageList'

// const MAX_IMAGES = 25
// const API_BASE = import.meta.env.VITE_API_URL

// type UploadImageProps = {
//   images: readonly unknown[]
// }

// /** Builder genérico para servir imágenes por nombre si el backend lo requiere */
// const buildPropertyImageUrl = (name: string) =>
//   `${API_BASE}/properties/image/${encodeURIComponent(name)}`

// /** Normaliza arreglo de URLs desde la respuesta del backend */
// const extractImageUrls = (res: any): string[] => {
//   // Caso 1: viene directo
//   if (Array.isArray(res?.urls)) return res.urls.filter(Boolean)

//   // Caso 2: viene en res.data.urls
//   if (Array.isArray(res?.data?.urls)) return res.data.urls.filter(Boolean)

//   // Caso 3: viene como objetos { url } o { path|name }
//   const arr =
//     (Array.isArray(res?.images) && res.images) ||
//     (Array.isArray(res?.data?.images) && res.data.images) ||
//     []
//   const urls: string[] = []

//   for (const it of arr) {
//     const direct = it?.url
//     const nameOrPath = it?.name || it?.path
//     if (typeof direct === 'string' && direct) {
//       urls.push(direct)
//     } else if (typeof nameOrPath === 'string' && nameOrPath) {
//       const looksAbsolute = /^https?:\/\//i.test(nameOrPath)
//       urls.push(looksAbsolute ? nameOrPath : buildPropertyImageUrl(nameOrPath))
//     }
//   }
//   return urls.filter(Boolean)
// }

// /** Ícono genérico para archivos no-imagen */
// const FileIcon: React.FC<CommonProps> = ({ children }) => {
//   return <span className="text-4xl">{children}</span>
// }

// /** Item de preview con manejo de URL.createObjectURL seguro */
// const PreviewFileItem: React.FC<{
//   file: File
//   onRemove: () => void
//   getKB: (bytes: number) => number
// }> = ({ file, onRemove, getKB }) => {
//   const isImage = file?.type?.startsWith('image/')
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null)

//   useEffect(() => {
//     if (!isImage) return
//     const url = URL.createObjectURL(file)
//     setPreviewUrl(url)
//     return () => URL.revokeObjectURL(url)
//   }, [file, isImage])

//   const renderThumb = () => {
//     if (isImage && previewUrl) {
//       return (
//         <img
//           className="upload-file-image"
//           src={previewUrl}
//           alt={`vista-previa-${file.name}`}
//         />
//       )
//     }
//     if (file?.type === 'application/zip') {
//       return (
//         <FileIcon>
//           <VscFileZip />
//         </FileIcon>
//       )
//     }
//     if (file?.type === 'application/pdf') {
//       return (
//         <FileIcon>
//           <VscFilePdf />
//         </FileIcon>
//       )
//     }
//     return (
//       <FileIcon>
//         <VscFile />
//       </FileIcon>
//     )
//   }

//   return (
//     <div className="upload-file mt-5">
//       <div className="flex">
//         <div className="upload-file-thumbnail">{renderThumb()}</div>
//         <div className="upload-file-info">
//           <h6 className="upload-file-name">{file?.name}</h6>
//           <span className="upload-file-size">{getKB(file?.size)} kb</span>
//         </div>
//       </div>
//       <div
//         className="close-btn upload-file-remove"
//         role="button"
//         aria-label="Eliminar imagen seleccionada"
//         title="Eliminar imagen seleccionada"
//         onClick={onRemove}
//       >
//         <IoCloseOutline />
//       </div>
//     </div>
//   )
// }

// const UploadImage: React.FC<UploadImageProps> = ({ images }) => {
//   const [files, setFiles] = useState<File[]>([])
//   const inputRef = useRef<HTMLInputElement | null>(null)
//   const [inputKey, setInputKey] = useState<string>(() => String(Date.now()))
//   const { propertyId } = useParams()
//   const { showNotification } = useNotification()

//   // Procanje: subir imágenes
//   const [createPropertyImages, { isLoading, error, isSuccess }] =
//     useCreatePropertyImagesMutation()

//   // Portal de Portales: buscar por code
//   const [findPortalByCode] = useLazyFindPortalPublicationsQuery()

//   // 🔐 hook seguro PDP (para update con token)
//   const { ensureToken, secureUpdate } = usePdpSecureActions()

//   // Sync visual mientras mandamos al portal
//   const [isSyncingPortal, setIsSyncingPortal] = useState(false)

//   const BYTE = 1000
//   const getKB = (bytes: number) => Math.round(bytes / BYTE)

//   /** Número total actual (publicadas + seleccionadas) */
//   const currentTotal = (images?.length ?? 0) + files.length
//   const isMaxReached = currentTotal >= MAX_IMAGES
//   const remainingSlots = Math.max(
//     0,
//     MAX_IMAGES - (images?.length ?? 0) - files.length
//   )

//   /** Eliminar por índice */
//   const handleUploadedImage = (index: number) => {
//     setFiles((prev) => prev.filter((_, i) => i !== index))
//   }

//   /** Marca de agua (tu misma lógica) */
//   const applyWatermark = async (file: File): Promise<File> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader()
//       reader.onload = (event) => {
//         const img = new Image()
//         img.onload = () => {
//           const canvas = document.createElement('canvas')
//           const ctx = canvas.getContext('2d')

//           if (!ctx) {
//             reject(new Error('No se pudo obtener el contexto del canvas.'))
//             return
//           }

//           canvas.width = img.width
//           canvas.height = img.height

//           ctx.drawImage(img, 0, 0)

//           const watermark = new Image()
//           watermark.onload = () => {
//             const logoWidth = img.width / 5
//             const logoHeight = (watermark.height / watermark.width) * logoWidth
//             const xPosition = img.width - logoWidth - 10
//             const yPosition = img.height - logoHeight - 10

//             ctx.drawImage(
//               watermark,
//               xPosition,
//               yPosition,
//               logoWidth,
//               logoHeight
//             )

//             canvas.toBlob((blob) => {
//               if (blob) {
//                 const watermarkedFile = new File([blob], file.name, {
//                   type: file.type,
//                 })
//                 resolve(watermarkedFile)
//               } else {
//                 reject(
//                   new Error('No se pudo generar el archivo con watermark.')
//                 )
//               }
//             }, file.type)
//           }
//           watermark.onerror = () =>
//             reject(new Error('No se pudo cargar el logo como marca de agua.'))
//           watermark.src = '/img/logo/logo-light-full.png'
//         }

//         img.onerror = () => reject(new Error('No se pudo cargar la imagen.'))
//         img.src = event.target?.result as string
//       }

//       reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
//       reader.readAsDataURL(file)
//     })
//   }

//   /** Dedupe por nombre + tamaño + lastModified */
//   const dedupe = (arr: File[]) => {
//     const seen = new Set<string>()
//     return arr.filter((f) => {
//       const key = `${f.name}-${f.size}-${f.lastModified}`
//       if (seen.has(key)) return false
//       seen.add(key)
//       return true
//     })
//   }

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selected = Array.from(e.target.files ?? [])
//     if (selected.length === 0) {
//       if (inputRef.current) inputRef.current.value = ''
//       return
//     }

//     if (remainingSlots <= 0) {
//       showNotification(
//         'danger',
//         `Ya alcanzaste el máximo de ${MAX_IMAGES} imágenes.`,
//         ''
//       )
//       if (inputRef.current) inputRef.current.value = ''
//       setInputKey(String(Date.now()))
//       return
//     }

//     const filesToProcess = selected.slice(0, remainingSlots)

//     try {
//       const watermarked = await Promise.all(
//         filesToProcess.map((f) => applyWatermark(f))
//       )
//       const next = dedupe([...files, ...watermarked])
//       setFiles(next)
//     } catch {
//       showNotification('danger', 'Error al procesar las imágenes.', '')
//     } finally {
//       if (inputRef.current) inputRef.current.value = ''
//       setInputKey(String(Date.now()))
//     }
//   }

//   /**
//    * 🔐 Ahora sincroniza con Portal usando token PDP
//    */
//   const syncImagesToPortal = async (urls: string[]) => {
//     if (!propertyId || urls.length === 0) return

//     try {
//       setIsSyncingPortal(true)

//       // 1) token PDP válido
//       const pdpToken = await ensureToken()

//       // 2) Buscar publicaciones del portal “procanje” por code (id local) con token
//       const found = await findPortalByCode({
//         code: String(propertyId),
//         page: 1,
//         page_size: 100,
//         pdpToken,
//       }).unwrap()

//       const items: any[] = Array.isArray(found)
//         ? found
//         : found?.items ?? found?.data ?? []

//       const uuids = items
//         .filter(
//           (i) =>
//             String(i?.portal ?? '')
//               .trim()
//               .toLowerCase() === 'pulsoPropiedades' &&
//             typeof i?.uuid === 'string'
//         )
//         .map((i) => i.uuid as string)

//       if (uuids.length === 0) {
//         showNotification(
//           'warning',
//           'Portal de Portales',
//           'No se encontró publicación para esta propiedad; se sincronizarán las imágenes cuando esté publicada.'
//         )
//         return
//       }

//       // 3) Actualizar todas las publicaciones encontradas con el hook seguro
//       const results = await Promise.allSettled(
//         uuids.map((uuid) => secureUpdate(uuid, { images: urls }))
//       )

//       const ok = results.filter((r) => r.status === 'fulfilled').length
//       const fail = uuids.length - ok

//       if (ok > 0) {
//         showNotification(
//           'success',
//           'Portal de Portales',
//           `Imágenes sincronizadas (${ok}/${uuids.length}).`
//         )
//       }
//       if (fail > 0) {
//         showNotification(
//           'warning',
//           'Portal de Portales',
//           `Algunas publicaciones no pudieron actualizarse (${fail}/${uuids.length}).`
//         )
//       }
//     } catch (err: any) {
//       showNotification(
//         'danger',
//         'Portal de Portales',
//         err?.message || 'No se pudo sincronizar imágenes en el portal.'
//       )
//     } finally {
//       setIsSyncingPortal(false)
//     }
//   }

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!propertyId) {
//       throw new Error('El ID de la propiedad no está definido.')
//     }
//     if (files.length === 0) return

//     const formData = new FormData()
//     files.forEach((file) => {
//       formData.append('images', file, file.name)
//     })

//     try {
//       const res = await createPropertyImages({
//         id: propertyId as string,
//         body: formData,
//       }).unwrap()

//       // 1) Notificación local
//       showNotification(
//         'success',
//         `${
//           files.length > 1 ? 'Imágenes publicadas' : 'Imagen publicada'
//         } en Procanje`,
//         ''
//       )

//       // 2) Extraer URLs y sincronizar con Portal
//       const urls = extractImageUrls(res)
//       if (urls.length > 0) {
//         await syncImagesToPortal(urls)
//       } else {
//         showNotification(
//           'warning',
//           'Imágenes publicadas, pero sin URLs para el portal',
//           'Revisa el payload de respuesta del backend.'
//         )
//       }

//       // 3) Reset UI
//       setFiles([])
//       if (inputRef.current) inputRef.current.value = ''
//       setInputKey(String(Date.now()))
//     } catch (err: any) {
//       showNotification(
//         'danger',
//         err?.data?.message ||
//           err?.error ||
//           err?.message ||
//           'Error al publicar imágenes.',
//         ''
//       )
//       setFiles([])
//       if (inputRef.current) inputRef.current.value = ''
//       setInputKey(String(Date.now()))
//     }
//   }

//   const errorMessage = useMemo(() => {
//     if (!error) return null
//     const anyErr = error as any
//     return (
//       anyErr?.data?.message ||
//       anyErr?.error ||
//       anyErr?.message ||
//       'Error al publicar imágenes.'
//     )
//   }, [error])

//   useEffect(() => {
//     if (errorMessage) {
//       showNotification('danger', errorMessage, '')
//       setFiles([])
//       if (inputRef.current) inputRef.current.value = ''
//       setInputKey(String(Date.now()))
//     }
//   }, [errorMessage, showNotification])

//   useEffect(() => {
//     // noop
//   }, [isSuccess])

//   return (
//     <form className="w-full" onSubmit={onSubmit}>
//       <div className="border-b pb-1 dark:border-b-gray-700">
//         <h3 className="text-lg flex items-center gap-1">
//           <HiOutlineUpload />
//           Cargar imágenes
//         </h3>
//         <p>
//           Publica las mejores <strong>{MAX_IMAGES}</strong> imágenes de tu
//           propiedad.
//         </p>
//       </div>

//       <div className="my-4 px-2 overflow-x-hidden">
//         <div className="w-full lg:w-[60%] mx-auto flex flex-col lg:flex-row items-center justify-between">
//           <div className="w-full lg:w-[70%]">
//             <label className="block cursor-pointer" htmlFor="multiple_files">
//               <span className="sr-only">Seleccionar imágenes</span>
//               <div
//                 className={`block text-black bg-white dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-700 ${
//                   isMaxReached
//                     ? 'cursor-not-allowed opacity-70'
//                     : 'hover:border-lime-500/50 hover:bg-neutral-50 cursor-pointer'
//                 } border-2 border-neutral-200 p-1 rounded-full w-full text-sm text-black/50 text-center py-2`}
//               >
//                 {isMaxReached
//                   ? 'Límite alcanzado'
//                   : remainingSlots === MAX_IMAGES
//                   ? 'Seleccionar imágenes...'
//                   : `Puedes agregar ${remainingSlots} imagen(es) más...`}
//               </div>

//               <input
//                 key={inputKey}
//                 ref={inputRef}
//                 multiple
//                 id="multiple_files"
//                 type="file"
//                 className="hidden"
//                 accept="image/*"
//                 disabled={isMaxReached}
//                 onClick={(e) => {
//                   ;(e.currentTarget as HTMLInputElement).value = ''
//                 }}
//                 onChange={handleFileChange}
//               />
//             </label>
//           </div>

//           <div className="w-full lg:w-[30%] mt-2 lg:mt-0">
//             <Button
//               block
//               type="submit"
//               className="mx-2"
//               variant="solid"
//               shape="circle"
//               loading={isLoading || isSyncingPortal}
//               disabled={isMaxReached || files.length === 0}
//               icon={<HiOutlineUpload />}
//             >
//               {isSyncingPortal ? 'Sincronizando…' : 'Publicar'}
//               {files.length > 0 && !isSyncingPortal && ` (${files.length})`}
//             </Button>
//           </div>
//         </div>

//         {/* PREVIEWS SELECCIONADOS */}
//         {files.length > 0 &&
//           files.map((file, index) => (
//             <PreviewFileItem
//               key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
//               file={file}
//               getKB={getKB}
//               onRemove={() => handleUploadedImage(index)}
//             />
//           ))}

//         {/* LISTA DE IMÁGENES YA PUBLICADAS */}
//         <ImageList images={images} />
//       </div>
//     </form>
//   )
// }

// export default UploadImage
