import EmblaCarousel from '@/components/shared/embla/EmblaCarousel'
import Avatar from '@/components/ui/Avatar'
import Dialog from '@/components/ui/Dialog'
import { EmblaOptionsType } from 'embla-carousel'
import { useState } from 'react'
import { IoHomeSharp } from 'react-icons/io5'

const PropertyAvatarColumn = ({ row }) => {
  const [emblaIsOpen, setIsOpen] = useState(false)
  const slideCount = row?.images?.length
  const options: EmblaOptionsType = {}
  const slides = Array?.from(Array(slideCount)?.keys())

  const sortedImages = row?.images
    ? [...row.images].sort((a, b) => Number(a.number) - Number(b.number))
    : []

  const renderedImages =
    sortedImages?.[0]?.path ??
    sortedImages?.[1]?.path ??
    sortedImages?.[2]?.path

  const avatar =
    renderedImages?.length > 0 ? (
      <Avatar src={renderedImages} className="w-[40px] max-w-[40px]" />
    ) : (
      <Avatar icon={<IoHomeSharp className="w-[40px] max-w-[40px]" />} />
    )

  const openDialog = () => {
    setIsOpen(true)
  }

  const onDialogClose = () => {
    setIsOpen(false)
  }

  return (
    <>
      <div
        role="button"
        className="flex items-center rounded w-full cursor-pointer hover:underline"
        onClick={openDialog}
      >
        <div className="w-[30%]">{avatar}</div>
        <span className={`ml-2 rtl:mr-2 font-semibold w-[70%]`}>
          {row?.propertyTitle}
        </span>
      </div>

      <Dialog
        noBackground
        isOpen={emblaIsOpen}
        width={1000}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <EmblaCarousel
          slides={slides}
          options={options}
          images={sortedImages}
          onClose={onDialogClose}
        />
      </Dialog>
    </>
  )
}

export default PropertyAvatarColumn
