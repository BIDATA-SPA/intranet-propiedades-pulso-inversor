import { Spinner } from '@/components/ui'
import { useDeletePropertyImageMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { HiOutlineTrash } from 'react-icons/hi'
import { MdDragIndicator } from 'react-icons/md'

interface SortableItemProps {
  id: number
  path: string
  index: number
  onPreview?: (index: number) => void
}

const SortableItem = ({ id, path, index, onPreview }: SortableItemProps) => {
  const [deletingIndex, setDeletingIndex] = useState(null)
  const { showNotification } = useNotification()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })
  const [deletePropertyImage, { isLoading: isDeleting }] =
    useDeletePropertyImageMutation()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleDeleteImage = async (event, imageUrl) => {
    event.stopPropagation()
    setDeletingIndex(imageUrl)
    const name = imageUrl?.split('/')?.pop() || ''
    if (name) {
      try {
        await deletePropertyImage({
          name,
        }).unwrap()
        showNotification('success', 'Imagen Eliminada exitosamente', '')
      } catch (error) {
        showNotification(
          'danger',
          'Ha ocurrido un error al eliminar la imagen',
          ''
        )
      } finally {
        setDeletingIndex(null)
      }
    }
  }

  const handleImageClick = () => {
    if (onPreview) {
      onPreview(index)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="relative overflow-hidden rounded-lg group"
    >
      <img
        src={path}
        alt={`Imagen ${id}`}
        className="relative w-full h-[150px] rounded-lg object-cover hover:shadow-xl hover:opacity-80 border-4 border-transparent hover:border-sky-500 cursor-pointer transition-all"
        onClick={handleImageClick}
      />

      {/* Drag Handle - Solo visible en hover */}
      <div
        {...listeners}
        className="absolute top-1 right-1 bg-white/90 dark:bg-gray-800/90 rounded-md p-2 cursor-move opacity-0 group-hover:opacity-100 transition-opacity z-40 shadow-lg"
        title="Arrastrar para reordenar"
      >
        <MdDragIndicator className="text-xl text-gray-700 dark:text-gray-300" />
      </div>

      {/* Número de orden */}
      <span className="absolute top-0 left-0 py-1 px-3 font-bold bg-white/90 text-black rounded-br-lg rounded-tl-sm shadow-md">
        {index + 1}
      </span>

      {/* Botón eliminar */}
      <div className="absolute bottom-0 right-0 rounded-lg">
        <button
          className="z-50 mr-2 mb-2 bg-white bg-opacity-75 hover:bg-opacity-95 rounded-md p-2 transition-all shadow-lg hover:shadow-xl"
          color="red-600"
          onClick={(event) => {
            event.preventDefault()
            handleDeleteImage(event, path)
          }}
        >
          {isDeleting && deletingIndex === path ? (
            <Spinner color="red-500" />
          ) : (
            <HiOutlineTrash className="text-2xl text-red-500" />
          )}
        </button>
      </div>
    </div>
  )
}

export default SortableItem

// import { Spinner } from '@/components/ui'
// import { useDeletePropertyImageMutation } from '@/services/RtkQueryService'
// import useNotification from '@/utils/hooks/useNotification'
// import { useSortable } from '@dnd-kit/sortable'
// import { CSS } from '@dnd-kit/utilities'
// import { useState } from 'react'
// import { HiOutlineTrash } from 'react-icons/hi'

// const SortableItem = ({ id, path, index }) => {
//   const [deletingIndex, setDeletingIndex] = useState(null)
//   const { showNotification } = useNotification()
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id })
//   const [deletePropertyImage, { isLoading: isDeleting }] =
//     useDeletePropertyImageMutation()

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//   }

//   const handleDeleteImage = async (event, imageUrl) => {
//     event.stopPropagation()
//     setDeletingIndex(imageUrl)
//     const name = imageUrl?.split('/')?.pop() || ''
//     if (name) {
//       try {
//         await deletePropertyImage({
//           name,
//         }).unwrap()
//         showNotification('success', 'Imagen Eliminada exitosamente', '')
//       } catch (error) {
//         showNotification(
//           'danger',
//           'Ha ocurrido un error al eliminar la imagen',
//           ''
//         )
//       } finally {
//         setDeletingIndex(null) // Resetear el estado después de la eliminación
//       }
//     }
//   }

//   return (
//     <div
//       ref={setNodeRef}
//       style={style}
//       {...attributes}
//       className="relative overflow-hidden rounded-lg"
//     >
//       <img
//         src={path}
//         alt={`Imagen ${id}`}
//         className="relative w-full h-[150px] rounded-lg object-cover hover:shadow-xl hover:opacity-80 border-4 border-transparent hover:border-lime-500"
//         {...listeners}
//       />
//       <span className="absolute top-1 left-1 py-1 px-3 font-bold bg-white/90 text-black rounded-br-lg rounded-tl-sm">
//         {index + 1}
//       </span>
//       <div className="absolute bottom-0 right-0 rounded-lg">
//         <button
//           className="z-50 mr-2 mb-2 bg-white bg-opacity-75 hover:bg-opacity-95 rounded-md p-4"
//           color="red-600"
//           onClick={(event) => handleDeleteImage(event, path)}
//         >
//           {isDeleting && deletingIndex === path ? (
//             <Spinner color="red-500" />
//           ) : (
//             <HiOutlineTrash className="text-2xl text-red-500" />
//           )}
//         </button>
//       </div>
//     </div>
//   )
// }

// export default SortableItem
