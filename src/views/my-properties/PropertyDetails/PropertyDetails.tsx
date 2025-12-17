/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Button, Card } from '@/components/ui'
import { useGetPropertyByIdQuery } from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import UploadImage from './components/UploadImage'
import PropertyForm from './PropertyForm'
import PropertyResume from './PropertyResume'

const PropertyDetails = () => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const location = useLocation()

  useEffect(() => {
    // Solo realiza scroll si el hash es #scroll-target
    if (location.hash === '#scroll-target') {
      const target = document.getElementById('scroll-target')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location.hash])
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const [isEditingFields, setIsEditingFields] = useState(false)
  const [editingInitialValues, setEditingInitialValues] = useState({
    typeOfOperationId: '',
    typeOfPropertyId: '',
    timeAvailable: {
      start: null,
      end: null,
    },
    currencyId: '',
    propertyPrice: 0,
    highlighted: false,
    observations: '',
    isExchanged: false,
    timeInExchange: {
      start: null,
      end: null,
    },
    propertyDescriptionInExchange: '',
    user: {
      id: '',
      name: '',
      lastName: '',
    },
    customer: {
      id: '',
      name: '',
      lastName: '',
    },
    characteristics: {
      propertyTitle: '',
      propertyDescription: '',
      surface: '',
      surfaceUnit: '',
      constructedSurface: '',
      floors: '',
      numberOfFloors: '',
      terraces: '',
      bedrooms: '',
      bathrooms: '',
      typeOfKitchen: '',
      hasHeating: false,
      hasKitchen: false,
      typeOfHeating: '',
      hasAirConditioning: false,
      hasParking: false,
      hasGarage: false,
      numberOfParkingSpaces: false,
      hasElevator: false,
      hasGym: false,
      hasSwimmingPool: false,
      hasSecurity: false,
      typeOfSecurity: [],
      locatedInCondominium: false,
      isFurnished: false,
      hasBarbecueArea: false,

      numberOfPrivate: '',
      numberOfVacantFloors: '',
      numberOfMeetingRooms: '',
      hasKitchenet: false,
      hasHouse: false,
      locatedInGallery: false,
      locatedFacingTheStreet: false,
      floorLevelLocation: '',
      officeNumber: '',
      commonExpenses: '',
    },
    externalLink: '',
    address: {
      countryId: '',
      stateId: '',
      cityId: '',
      letter: '',
      number: '',
      references: '',
      address: '',
      addressPublic: '',
    },
  })
  const [step, setStep] = useState<number | boolean>(0)
  const { data, isFetching } = useGetPropertyByIdQuery(propertyId, {
    refetchOnMountOrArgChange: true,
  })

  const sortedImages = data?.images
    ? [...data.images].sort((a, b) => Number(a.number) - Number(b.number))
    : []

  const handleBackNavigation = () => {
    if (userAuthority === 2) {
      navigate('/mis-propiedades')
    }

    if (userAuthority === 3) {
      navigate('/dashboard')
    }
  }

  useEffect(() => {
    if (data && !isFetching) {
      setEditingInitialValues({
        typeOfOperationId: data?.typeOfOperationId,
        typeOfPropertyId: data?.typeOfPropertyId,
        timeAvailable: {
          start: data?.timeAvailableStart,
          end: data?.timeAvailableEnd,
        },
        externalLink: data?.externalLink,
        currencyId: data?.currencyId,
        propertyPrice: data?.propertyPrice,
        highlighted: data?.highlighted,
        observations: data?.observations,
        isExchanged: data?.isExchanged,
        timeInExchange: {
          start: data?.timeInExchangeStart,
          end: data?.timeInExchangeEnd,
        },
        propertyDescriptionInExchange: data?.propertyDescriptionInExchange,
        user: {
          id: data?.user?.id,
          name: !data?.user?.name ? '' : data?.user?.name,
          lastName: !data?.user?.lastName ? '' : data?.user?.lastName,
        },
        customer: {
          id: data?.customer?.id,
          name: !data?.customer?.name ? '' : data?.customer?.name,
          lastName: !data?.customer?.lastName ? '' : data?.customer?.lastName,
        },
        characteristics: {
          propertyTitle: data?.propertyTitle,
          propertyDescription: data?.propertyDescription,
          surface: data?.characteristics?.surface,
          surfaceUnit: data?.characteristics?.surfaceUnit,
          constructedSurface: data?.characteristics?.constructedSurface,
          floors: data?.characteristics?.floors,
          numberOfFloors: data?.characteristics?.numberOfFloors,
          terraces: data?.characteristics?.terraces,
          bedrooms: data?.characteristics?.bedrooms,
          bathrooms: data?.characteristics?.bathrooms,
          typeOfKitchen: data?.characteristics?.typeOfKitchen,
          hasHeating: data?.characteristics?.hasHeating,
          typeOfHeating: data?.characteristics?.typeOfHeating,
          hasKitchen: data?.characteristics?.hasKitchen,
          hasAirConditioning: data?.characteristics?.hasAirConditioning,
          hasParking: data?.characteristics?.hasParking,
          hasGarage: data?.characteristics?.hasGarage,
          numberOfParkingSpaces: data?.characteristics?.numberOfParkingSpaces,
          hasElevator: data?.characteristics?.hasElevator,
          hasGym: data?.characteristics?.hasGym,
          hasSwimmingPool: data?.characteristics?.hasSwimmingPool,
          hasSecurity: data?.characteristics?.hasSecurity,
          typeOfSecurity: data?.characteristics?.typeOfSecurity || [],
          locatedInCondominium: data?.characteristics?.locatedInCondominium,
          isFurnished: data?.characteristics?.isFurnished,
          hasBarbecueArea: data?.characteristics?.hasBarbecueArea,
          numberOfPrivate: data?.characteristics?.numberOfPrivate,
          numberOfVacantFloors: data?.characteristics?.numberOfVacantFloors,
          numberOfMeetingRooms: data?.characteristics?.numberOfMeetingRooms,
          hasKitchenet: data?.characteristics?.hasKitchenet,
          hasHouse: data?.characteristics?.hasHouse,
          locatedInGallery: data?.characteristics?.locatedInGallery,
          locatedFacingTheStreet: data?.characteristics?.locatedFacingTheStreet,
          floorLevelLocation: data?.characteristics?.floorLevelLocation,
          officeNumber: data?.characteristics?.officeNumber,
          commonExpenses: data?.characteristics?.commonExpenses,
        },
        address: {
          countryId: data?.address?.country?.id,
          stateId: data?.address?.state?.id, // ⚠️
          cityId: data?.address?.city?.id, // ⚠️
          letter: data?.address?.letter,
          number: data?.address?.number,
          references: data?.address?.references,
          address: data?.address?.address,
          addressPublic: data?.address?.addressPublic,
        },
      })
    } else {
      setEditingInitialValues({
        typeOfOperationId: '',
        typeOfPropertyId: '',
        timeAvailable: {
          start: null,
          end: null,
        },
        externalLink: '',
        currencyId: '',
        propertyPrice: 0,
        highlighted: false,
        observations: '',
        isExchanged: false,
        timeInExchange: {
          start: null,
          end: null,
        },
        propertyDescriptionInExchange: '',
        user: {
          id: '', // ⚠️
          name: '', // ⚠️
          lastName: '', // ⚠️
        },
        customer: {
          id: '', // ⚠️
          name: '', // ⚠️
          lastName: '', // ⚠️
        },
        characteristics: {
          propertyTitle: '',
          propertyDescription: '',
          surface: '',
          surfaceUnit: '',
          constructedSurface: '',
          floors: '',
          numberOfFloors: '',
          terraces: '',
          bedrooms: '',
          bathrooms: '',
          typeOfKitchen: '',
          hasHeating: false,
          hasKitchen: false,
          typeOfHeating: '',
          hasAirConditioning: false,
          hasParking: false,
          hasGarage: false,
          numberOfParkingSpaces: false,
          hasElevator: false,
          hasGym: false,
          hasSwimmingPool: false,
          hasSecurity: false,
          typeOfSecurity: [],
          locatedInCondominium: false,
          isFurnished: false,
          hasBarbecueArea: false,

          numberOfPrivate: '',
          numberOfVacantFloors: '',
          numberOfMeetingRooms: '',
          hasKitchenet: false,
          hasHouse: false,
          locatedInGallery: false,
          locatedFacingTheStreet: false,
          floorLevelLocation: '',
          officeNumber: '',
          commonExpenses: '',
        },
        address: {
          countryId: Number(''),
          stateId: Number(''),
          cityId: Number(''),
          letter: '',
          number: '',
          references: '',
          address: '',
          addressPublic: '',
        },
      })
    }
  }, [data, isFetching])

  const NotImagesAlert = () =>
    data?.images?.length === 0 && (
      <Alert
        showIcon
        closable
        type="info"
        className="mb-2"
        title="Advertencia!"
      >
        Esta Propieda no cuenta con imagenes publicadas {''}
        <a href="#publicar" className="font-bold underline">
          Ir a publicar
        </a>
      </Alert>
    )

  return (
    <div className="bg-gray-100/80 dark:bg-gray-700 p-5 rounded-lg overflow-y-scroll max-h-[800px] h-[800px]">
      <NotImagesAlert />
      <div className="flex items-center justify-between mb-4">
        <h3>Detalles de la propiedad</h3>
        <Button
          size="sm"
          variant="solid"
          icon={<HiArrowLeft />}
          onClick={handleBackNavigation}
        >
          Regresar
        </Button>
      </div>
      <div className="container mx-auto">
        <div className="w-full flex flex-col lg:flex-row gap-5">
          <div className="w-full xl:w-1/2">
            <Card className="w-full lg:w-[100%] border-t-4 border-t-sky-400 dark:border-t-sky-400">
              <PropertyForm
                isEditingFields={isEditingFields}
                setIsEditingFields={setIsEditingFields}
                initialValues={editingInitialValues}
                data={data}
                step={step}
                setStep={setStep}
              />
            </Card>
          </div>
          <div className="w-full xl:w-1/2">
            <PropertyResume data={data} />
          </div>
        </div>

        <div id="scroll-target" className="h-0"></div>
        <div id="publicar" className="my-4">
          <Card className="w-full lg:w-[100%] border-t-4 border-t-sky-400 dark:border-t-sky-400">
            <UploadImage
              images={sortedImages}
              propertyType={data?.typeOfPropertyId ?? ''}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
