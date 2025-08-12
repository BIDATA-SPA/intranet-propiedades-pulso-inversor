import EmblaCarousel from '@/components/shared/embla/EmblaCarousel'
import { Avatar, Card, Tooltip } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { formatCurrency, formatThousands } from '@/utils/formatCurrency'
import { truncateString } from '@/utils/truncateString'
import { useDialog } from '@/utils/useDialog'
import { EmblaOptionsType } from 'embla-carousel'
import { FaCheck, FaEye } from 'react-icons/fa'
import {
  currenciesLib,
  dialogIds,
  propertyMatches,
} from '../../lib/placeholder-data'
import ContactFormDialog from './ContactFormDialog'

const PropertyInfo = ({ property, images }) => {
  const { isDialogOpen, openDialog, onDialogClose } = useDialog()
  const { matches, property: propertyData } = property
  const options: EmblaOptionsType = {}
  const slideCount = images?.length
  const slides = Array?.from(Array(slideCount)?.keys())

  // Validate if client is
  const validateUser = (validUser) => {
    if (
      validUser.email === 'procanje@procanje.com' ||
      validUser.name === 'CORREDOR' ||
      validUser.lastName === 'PROCANJE'
    ) {
      return true
    }
  }

  const isCustomerByRealtor = validateUser(property?.property?.user?.session)

  const formatSwitchedCurrency = () => {
    switch (currenciesLib[propertyData?.currencyId]) {
      case 'UF':
        return `UF ${formatThousands(propertyData?.propertyPrice)}`
      case 'CLP':
        return formatCurrency(propertyData?.propertyPrice, {
          currency: 'CLP',
        })
      default:
        break
    }
  }

  const currencyValue = formatSwitchedCurrency()

  const _imgSrc =
    propertyData?.images?.[0]?.path ??
    propertyData?.images?.[1]?.path ??
    propertyData?.images?.[2]?.path ??
    '/img/not-found/not-found-image.png'

  return (
    <>
      <Card className="mb-4 hover:shadow-md border-t-4 border-t-blue-500">
        <div className="flex items-center">
          <div className="flex items-center w-[100%]">
            <div className="relative">
              <Avatar
                size={60}
                src={_imgSrc}
                alt={propertyData?.propertyTitle}
                className="relative cursor-pointer hover:brightness-50 w-[50px] h-[50px]"
              />

              <button
                className="flex absolute top-0 left-0 right-0 bottom-0 mx-auto gap-1 items-center text-white font-bold bg-black bg-opacity-50 p-4 mb-1.5 w-100 h-100 rounded opacity-0 hover:opacity-100 transition-opacity duration-300"
                onClick={() => openDialog(dialogIds.images)}
              >
                <FaEye />
                {propertyData?.images?.length}
              </button>
            </div>

            <div className="ltr:ml-2 rtl:mr-2">
              <h6 className="hover:underline">
                {isCustomerByRealtor ? (
                  <>
                    <Tooltip title="Corredor Procanje">
                      Corredor Procanje
                    </Tooltip>
                  </>
                ) : (
                  <Tooltip title={propertyData?.propertyTitle}>
                    {truncateString(propertyData?.propertyTitle, 50)}
                  </Tooltip>
                )}
              </h6>
              <p className="text-gray-500 dark:text-gray-300">
                Coincidencias de búsqueda:{' '}
                <span className="text-gray-800 dark:text-white">
                  {matches || 0}
                </span>
              </p>

              <ul className="flex flex-wrap pt-3 gap-2 w-[90%]">
                {property?.nameOfFieldsMatches.map((item) => (
                  <li
                    key={item}
                    className="text-[11px] flex items-center flex-row hover:underline"
                  >
                    <Tooltip
                      title={`Tu oportunidad coincide con la búsqueda '${propertyMatches[item]}'`}
                    >
                      <span className="flex items-center flex-row">
                        <FaCheck className="text-[9px] mr-1 text-green-500" />{' '}
                        {propertyMatches[item]}
                      </span>
                    </Tooltip>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <span className="flex flex-col font-semibold w-[25%] justify-start text-start">
            <small className="font-thin text-[10px]">Precio</small>
            {currencyValue}
          </span>
        </div>

        <div className="flex gap-2 justify-between items-center mt-5">
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

      {/* DIALOG IMAGES */}
      <Dialog
        noBackground
        isOpen={isDialogOpen(dialogIds.images)}
        width={1000}
        style={{
          content: {
            marginTop: -60,
          },
        }}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <EmblaCarousel
          slides={slides}
          options={options}
          images={property?.property?.images}
          onClose={onDialogClose}
        />
      </Dialog>

      {/* DIALOG CONTACT TO REALTOR */}
      <Dialog
        isOpen={isDialogOpen(dialogIds.contact)}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        {/* FROM INFORMATION */}
        <h4>Contactar a corredor/a</h4>
        <div className="mt-4">
          <ContactFormDialog
            propertyData={propertyData}
            onClose={onDialogClose}
          />
        </div>

        {/* TO INFORMATION */}
      </Dialog>
    </>
  )
}

export default PropertyInfo
