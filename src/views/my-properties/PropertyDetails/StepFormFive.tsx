import { CommonProps } from '@/@types/common'
import { Button, Notification, Spinner, toast } from '@/components/ui'
import {
  useCreatePropertyImagesMutation,
  useDeletePropertyImageMutation,
} from '@/services/RtkQueryService'
import { useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import { IoCloseOutline } from 'react-icons/io5'
import { VscFile, VscFilePdf, VscFileZip } from 'react-icons/vsc'
import { useParams } from 'react-router-dom'
import '../../../assets/styles/components/_file.css'
import OrderButton from './components/OrderButton'
import OrderDialog from './components/OrderDialog'
import OrderForm from './components/OrderForm'

const StepFormFive = ({ data }) => {
  const { propertyId } = useParams()
  const [createPropertyImages, { isLoading }] =
    useCreatePropertyImagesMutation()
  const [deletePropertyImage, { isLoading: isDeleting }] =
    useDeletePropertyImageMutation()
  const [files, setFiles] = useState([])
  const [deletingIndex, setDeletingIndex] = useState(null)
  const [dialogIsOpen, setIsOpen] = useState(false)
  const { images } = data

  const BYTE = 1000
  const getKB = (bytes: number) => Math.round(bytes / BYTE)

  const FileIcon = ({ children }: CommonProps) => {
    return <span className="text-4xl">{children}</span>
  }

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

  const handleUploadedImage = (indexImage: number) => {
    const filtredImages = files?.filter((_, index) => index !== indexImage)
    setFiles(filtredImages)
  }

  const handleDeleteImage = async (imageUrl) => {
    // Get image's name from url
    setDeletingIndex(imageUrl)
    const name = imageUrl.split('/').pop()

    if (name) {
      try {
        await deletePropertyImage({
          name,
        }).unwrap()
        openNotification('success', 'Imágen eliminada exitosamente', '', 3)
      } catch (error) {
        openNotification(
          'danger',
          'Error de imágen',
          'Hubo un problema al actualizar las imágenes',
          3
        )
      }
    }
  }

  const handleFileChange = (event) => {
    setFiles((prevFiles) => [...prevFiles, ...Array.from(event.target.files)])
  }

  const openOrderDialog = () => {
    setIsOpen(true)
  }

  const closeOrderDialog = () => {
    setIsOpen(false)
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (!propertyId) {
      throw new Error('El ID de la propiedad no está definido.')
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file, file.name)
    })

    try {
      const response = await createPropertyImages({
        id: propertyId,
        body: formData,
      })
      if (response) {
        setFiles([])
        openNotification('success', 'Imágenes actualizadas exitosamente', '', 3)
      }
    } catch (error) {
      openNotification(
        'danger',
        `${error.response?.data?.message}`,
        `${error.message}`,
        3
      )
    }
  }

  return (
    <div>
      <label className="block cursor-pointer" htmlFor="multiple_files">
        <span className="sr-only cursor-pointer">Seleccionar imágenes</span>
        <input
          multiple
          id="multiple_files"
          type="file"
          className="block bg-gray-100/70 hover:bg-gray-200/70 border p-2 rounded-full w-full cursor-pointer text-sm text-black/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-cyan-700 hover:file:bg-cyan-100"
          value={files?.length === 0 ? '' : undefined}
          onChange={handleFileChange}
        />
      </label>

      {/* SELECTED FILES */}
      {files.length > 0 &&
        files.map((file, index) => {
          const renderThumbnail = () => {
            const isImageFile = file.type.split('/')[0] === 'image'

            if (isImageFile) {
              return (
                <img
                  className="upload-file-image"
                  src={URL.createObjectURL(file)}
                  alt={`vista-previa-${file.name}`}
                />
              )
            }

            if (file.type === 'application/zip') {
              return (
                <FileIcon>
                  <VscFileZip />
                </FileIcon>
              )
            }

            if (file.type === 'application/pdf') {
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
            <div key={index} className="upload-file mt-5">
              <div className="flex">
                <div className="upload-file-thumbnail">{renderThumbnail()}</div>
                <div className="upload-file-info">
                  <h6 className="upload-file-name">{file.name}</h6>
                  <span className="upload-file-size">
                    {getKB(file.size)} kb
                  </span>
                </div>
              </div>
              <div
                className="close-btn upload-file-remove"
                role="button"
                onClick={() => handleUploadedImage(index)}
              >
                <IoCloseOutline />
              </div>
            </div>
          )
        })}

      <div className="flex w-full justify-start mt-10">
        <Button
          type="submit"
          className="mx-2"
          variant="solid"
          loading={isLoading}
          disabled={files?.length <= 0}
          onClick={onSubmit}
        >
          Publicar
        </Button>
      </div>

      {images?.length > 0 && (
        <div className="mt-7 flex justify-between items-center border-b pb-2 dark:border-gray-700">
          <div>
            <h4>Propiedades subidas</h4>
            <p>Las siguientes imágenes serán públicas.</p>
          </div>
          <OrderButton onOpen={openOrderDialog} />
        </div>
      )}

      {/* PROPERTIES IMAGES LIST */}
      <div className="grid gap-4 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {images?.map(({ id, path }) => (
          <div
            key={id}
            className="relative overflow-hidden bg-black/40 rounded-lg shadow-lg h-46 w-full mt-5"
          >
            <img
              src={path}
              alt={`Propiedad ${id}`}
              className="relative w-full object-cover h-48 object-center"
            />
            <div className="absolute bottom-0 right-0">
              <Button
                className="mr-2 mb-2"
                variant="twoTone"
                color="red-600"
                onClick={() => handleDeleteImage(path)}
              >
                {isDeleting && deletingIndex === path ? (
                  <Spinner color="red-500" />
                ) : (
                  <HiOutlineTrash />
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {dialogIsOpen && (
        <OrderDialog
          renderComponent={
            <OrderForm images={images || []} onClose={closeOrderDialog} />
          }
          isOpen={dialogIsOpen}
          onClose={closeOrderDialog}
        />
      )}
    </div>
  )
}

export default StepFormFive
