import { Avatar, Card } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { truncateString } from '@/utils/truncateString'
import { useDialog } from '@/utils/useDialog'
import { FaCheck, FaPhoneAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import {
  dialogIds,
  propertyMatches,
} from '../../customer-search/lib/placeholder-data'
import ContactFormDialog from './ContactFormDialog'

const RealtorInfo = ({ currentProperty, realtor }) => {
  const { isDialogOpen, openDialog, onDialogClose } = useDialog()
  const { matches, nameOfFieldsMatches, customerSearch } = realtor
  const { createdByUser } = customerSearch

  return (
    <>
      <Card className="mb-4 hover:shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="relative">
              <Avatar
                size={60}
                src={'https://cdn-icons-png.flaticon.com/512/2037/2037844.png'}
                alt={''}
                className="relative cursor-pointer hover:brightness-50 w-[50px] h-[50px]"
                onClick={() => openDialog(dialogIds.contact)}
              />
            </div>

            <div className="ml-4 flex flex-col justify-start items-start">
              <h6 className="text-sm">
                Corredor{' '}
                {truncateString(
                  `${createdByUser?.name} ${createdByUser?.lastName}`,
                  20
                )}
              </h6>

              <div className="flex items-center justify-start text-sm my-0.5 w-100">
                <span className="mr-1 flex items-center w-[15px]">
                  <FaPhoneAlt className="text-xs" />
                </span>
                <span className="mx-1 text-gray-400">|</span>
                <p className="text-sm border-l">{createdByUser?.phone}</p>
              </div>

              <div className="flex items-center justify-start text-sm my-0.5">
                <span className="mr-1 flex items-center w-[15px]">
                  <MdEmail className="text-sm" />
                </span>
                <span className="mx-1 text-gray-400">|</span>
                <p className="text-sm">{createdByUser?.session?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t py-2 dark:border-t-gray-700 my-3">
          <p className="text-gray-500 dark:text-gray-300">
            Características que coinciden con tu búsqueda:{' '}
            <span className="text-gray-800 dark:text-white font-bold">
              {matches || 0}
            </span>
          </p>

          <ul className="flex flex-wrap pt-3 gap-2 w-[95%] ml-2">
            {nameOfFieldsMatches?.map((item) => (
              <li
                key={item}
                className="text-[11px] flex items-center gap-2 rounded-full"
              >
                <FaCheck className="text-[9px] text-green-500" />{' '}
                {propertyMatches[item]}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-2 justify-between items-center">
          <Button
            block
            type="button"
            variant="solid"
            color="blue-500"
            className="w-[50%]"
            onClick={() => openDialog(dialogIds.contact)}
          >
            Contactar corredor
          </Button>
        </div>
      </Card>

      {/* DIALOG CONTACT TO REALTOR */}
      <Dialog
        isOpen={isDialogOpen(dialogIds.contact)}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        {/* FROM INFORMATION */}
        <h4>Contactar a corredor/a</h4>
        <div className="mt-4">
          <p className="my-3">Completa tu información.</p>
          <ContactFormDialog
            realtor={realtor}
            realtorInfo={createdByUser}
            currentProperty={currentProperty}
            onClose={onDialogClose}
          />
        </div>
      </Dialog>
    </>
  )
}

export default RealtorInfo
