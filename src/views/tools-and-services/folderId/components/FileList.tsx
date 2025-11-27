import Alert from '@/components/ui/Alert'
import Spinner from '@/components/ui/Spinner'
import { useGetRootFolderByIdQuery } from '@/services/RtkQueryService'
import { useState } from 'react'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router'
import FileItem from './FileItem'

const FileList = () => {
  const { folderId } = useParams()
  const navigate = useNavigate()
  const [selectedFileId, setSelectedFileId] = useState(null)
  const { data, isLoading, isError, isSuccess, error, refetch } =
    useGetRootFolderByIdQuery(folderId)

  const handleSelectFile = (folderId) => {
    setSelectedFileId(folderId)
  }

  const goToPrevPage = () => {
    navigate(-1)
  }

  const renderedChildrenFiles =
    data?.files?.length > 0 ? (
      data?.files?.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          isSelected={selectedFileId === file.id}
          onSelect={handleSelectFile}
        />
      ))
    ) : (
      <div className="w-screen">
        <p className="w-full flex items-center text-gray-400">
          Aún no se han creado archivos.{' '}
          <span
            role="button"
            className="text-sky-400 hover:text-lime-500 mx-2"
            onClick={goToPrevPage}
          >
            Volver
          </span>
        </p>
      </div>
    )

  if (isLoading)
    return (
      <div className="w-100 flex justify-center items-center">
        <Spinner className="mr-4" size="40px" />
      </div>
    )

  if (isError) {
    return (
      <div className="w-100 h-100 flex justify-center items-center">
        <Alert
          showIcon
          type="warning"
          title={`${error}` || 'Error de servidor'}
          className="w-screen flex justify-start items-start"
        >
          <span
            role="button"
            className="hover:underline"
            onClick={() => refetch()}
          >
            Reintentar
          </span>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center">
        <h2 className="text-sm font-normal">Archivos</h2>
        <div className="text-gray-400">
          {data?.name && (
            <span className="flex items-center text-sm font-light">
              <MdKeyboardArrowRight /> {data?.name}
            </span>
          )}
        </div>
      </div>
      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 my-4">
        {isSuccess && renderedChildrenFiles}
      </ul>
    </>
  )
}

export default FileList
