import { CommonProps } from '@/@types/common'
import { Button } from '@/components/ui'
import { useCreatePropertyImagesMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { useEffect, useState } from 'react'
import { HiOutlineUpload } from 'react-icons/hi'
import { IoCloseOutline } from 'react-icons/io5'
import { VscFile, VscFilePdf, VscFileZip } from 'react-icons/vsc'
import { useParams } from 'react-router'
import ImageList from './ImageList'

const MAX_IMAGES = 10

const UploadImage = ({ images }) => {
  const [files, setFiles] = useState<File[]>([])
  const { propertyId } = useParams()
  const { showNotification } = useNotification()
  const [createPropertyImages, { isLoading, error, isSuccess }] =
    useCreatePropertyImagesMutation()

  const BYTE = 1000
  const getKB = (bytes: number) => Math.round(bytes / BYTE)

  const FileIcon = ({ children }: CommonProps) => {
    return <span className="text-4xl">{children}</span>
  }

  const handleUploadedImage = (indexImage: number) => {
    const filtredImages = files?.filter((_, index) => index !== indexImage)
    setFiles(filtredImages)
  }

  const applyWatermark = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          if (!ctx) {
            reject(new Error('No se pudo obtener el contexto del canvas.'));
            return;
          }
  
          canvas.width = img.width;
          canvas.height = img.height;
  
          ctx.drawImage(img, 0, 0);
  
          const watermark = new Image();
          watermark.onload = () => {
            const logoWidth = img.width / 5; 
            const logoHeight = (watermark.height / watermark.width) * logoWidth; 
            const xPosition = img.width - logoWidth - 10; 
            const yPosition = img.height - logoHeight - 10;
  
            ctx.drawImage(watermark, xPosition, yPosition, logoWidth, logoHeight);
  
            canvas.toBlob((blob) => {
              if (blob) {
                const watermarkedFile = new File([blob], file.name, {
                  type: file.type,
                });
                resolve(watermarkedFile);
              } else {
                reject(new Error('No se pudo generar el archivo con watermark.'));
              }
            }, file.type);
          };
  
          watermark.onerror = () =>
            reject(new Error('No se pudo cargar el logo como marca de agua.'));
          watermark.src = '/img/logo2/logo-light-full.png'; 
        };
  
        img.onerror = () => reject(new Error('No se pudo cargar la imagen.'));
        img.src = event.target?.result as string;
      };
  
      reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files)
    const totalFiles = images.length + files.length + selectedFiles.length

    if (totalFiles > MAX_IMAGES) {
      showNotification(
        'danger',
        `El máximo de imágenes permitidas es (${MAX_IMAGES}).`,
        ''
      )
    } else {
      try {
        const watermarkedFiles = await Promise.all(
          selectedFiles.map((file) => applyWatermark(file))
        )

        console.log(watermarkedFiles)
        setFiles((prevFiles) => [...prevFiles, ...watermarkedFiles])
      } catch (error) {
        showNotification('danger', 'Error al procesar las imágenes.', '')
      }
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()

    if (!propertyId) {
      throw new Error('El ID de la propiedad no está definido.')
    }

    const formData = new FormData()
    files.forEach((file) => {
      formData.append('images', file, file.name)
    })

    createPropertyImages({
      id: propertyId,
      body: formData,
    })
  }

  useEffect(() => {
    if (error) {
      showNotification('danger', `${error.message}`, '')
      setFiles([])
    }
  }, [error])

  useEffect(() => {
    if (isSuccess) {
      showNotification(
        'success',
        `${
          files.length > 1
            ? 'Imágenes publicadas exitosamente'
            : 'Imagen publicada exitosamente'
        }`,
        ''
      )
      setFiles([])
    }
  }, [isSuccess])

  const isMaxImagesReached = images?.length >= MAX_IMAGES

  return (
    <div className="w-full">
      <div className="border-b pb-1 dark:border-b-gray-700">
        <h3 className="text-lg flex items-center gap-1">
          <HiOutlineUpload />
          Cargar imágenes
        </h3>
        <p>
          Publica las mejores <strong>{MAX_IMAGES}</strong> imágenes de tu
          propiedad.
        </p>
      </div>{' '}
      <div className="my-4 px-2 overflow-x-hidden">
        <div className="w-full lg:w-[60%] mx-auto flex flex-col lg:flex-row items-center justify-between">
          <div className="w-full lg:w-[70%]">
            <label className="block cursor-pointer" htmlFor="multiple_files">
              <span className="sr-only">Seleccionar imágenes</span>
              <div
                className={`block text-black bg-white dark:bg-gray-600 dark:text-white dark:border-gray-500 dark:hover:bg-gray-700 ${
                  isMaxImagesReached
                    ? 'cursor-not-allowed'
                    : 'hover:border-sky-500/50 hover:bg-neutral-50 cursor-pointer'
                } border-2 border-neutral-200 p-1 rounded-full w-full text-sm text-black/50 text-center py-2`}
              >
                Seleccionar imágenes...
              </div>
              <input
                multiple
                id="multiple_files"
                type="file"
                className="hidden"
                accept="image/*" // Asegurarse de aceptar solo imágenes
                disabled={isMaxImagesReached}
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
              loading={isLoading}
              disabled={isMaxImagesReached || files.length === 0}
              icon={<HiOutlineUpload />}
              onClick={onSubmit}
            >
              Publicar {files.length > 0 && `(${files.length})`}
            </Button>
          </div>
        </div>
        {/* SELECTED FILES */}
        {files.length > 0 &&
          files.map((file, index) => {
            const renderThumbnail = () => {
              const isImageFile = file?.type?.split('/')[0] === 'image'

              if (isImageFile) {
                return (
                  <img
                    className="upload-file-image"
                    src={URL.createObjectURL(file)}
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
              <div key={index} className="upload-file mt-5">
                <div className="flex">
                  <div className="upload-file-thumbnail">
                    {renderThumbnail()}
                  </div>
                  <div className="upload-file-info">
                    <h6 className="upload-file-name">{file?.name}</h6>
                    <span className="upload-file-size">
                      {getKB(file?.size)} kb
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

        <ImageList images={images} />
      </div>
    </div>
  )
}

export default UploadImage