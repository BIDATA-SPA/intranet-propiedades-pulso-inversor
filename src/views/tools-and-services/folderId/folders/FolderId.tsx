import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import { IoMdArrowBack } from 'react-icons/io'
import { useNavigate } from 'react-router'
import FileList from '../components/FileList'
import FolderList from '../components/FolderList'

const FolderId = () => {
  const navigate = useNavigate()

  const goToPrevPage = () => {
    navigate(-1)
  }

  return (
    <Container className="h-full">
      <AdaptableCard>
        <div className="w-full flex flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Button
              shape="circle"
              variant="plain"
              size="sm"
              icon={<IoMdArrowBack />}
              className="mr-2"
              onClick={goToPrevPage}
            />
            <h1 className="text-lg md:text-xl">Archivos</h1>
          </div>
        </div>
      </AdaptableCard>

      {/* Folders area */}
      <AdaptableCard className="my-8">
        <FolderList />
      </AdaptableCard>

      {/* Files area */}
      <AdaptableCard className="my-8">
        <FileList />
      </AdaptableCard>
    </Container>
  )
}

export default FolderId
