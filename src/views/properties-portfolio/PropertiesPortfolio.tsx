import AdaptableCard from '@/components/shared/AdaptableCard'
import Container from '@/components/shared/Container'
import Tabs from '@/components/ui/Tabs'
import {
  useGetMyInfoQuery,
  useGetPropertyByIdQuery,
} from '@/services/RtkQueryService'
import { injectReducer } from '@/store'
import { isoUtcToLocalDate } from '@/utils/iso-to-locale-date'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { FaHouseSignal } from 'react-icons/fa6'
import { HiOutlineHome } from 'react-icons/hi'
import { useLocation, useNavigate, useParams } from 'react-router'
import UploadImage from '../my-properties/PropertyDetails/components/UploadImage'
import FormStep from './components/FormStep'
import { usePathChangeEffect } from './hooks/use-patch-change-effect'
import reducer, {
  Address,
  FinancialInformation as FinancialInformationType,
  Identification as IdentificationType,
  PersonalInformation as PersonalInformationType,
  PortalOfPortals as PortalOfPortalsType,
  resetFormState,
  setCurrentStep,
  setFormData,
  setStepStatus,
  useAppDispatch,
  useAppSelector,
} from './store'

const { TabNav, TabList, TabContent } = Tabs

injectReducer('accountDetailForm', reducer)

const PersonalInformation = lazy(
  () => import('./components/PersonalInformation')
)
const Identification = lazy(() => import('./components/Identification'))
const AddressInfomation = lazy(() => import('./components/AddressInfomation'))
const AccountReview = lazy(() => import('./components/AccountReview'))
const PortaOfPropertyOverview = lazy(
  () => import('../portal-of-portals/components/property-details/Overview')
)

// Normaliza la forma "property_portales" del GET a lo que guarda el form:
// []  -> sin portal
// [{ portalName: "Procanje" }] -> [{ id:"procanje", name:"Procanje" }]
const normalizePropertyPortales = (
  raw: Array<{ portalName?: string }> | undefined | null
): { id: string; name: string }[] => {
  const hasProcanje =
    Array.isArray(raw) &&
    raw.some(
      (p) =>
        String(p?.portalName ?? '')
          .trim()
          .toLowerCase() === 'pulsoPropiedades'
    )
  return hasProcanje
    ? [{ id: 'pulsoPropiedades', name: 'Pulso Propiedades' }]
    : []
}

const ResetKycFormOnRouteChange = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (location.pathname === '/mis-propiedades/crear-propiedad') {
      dispatch(resetFormState())
    }
  }, [location.pathname, dispatch])

  return null // este componente no renderiza nada
}

const PropertiesPortfolio = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: user } = useGetMyInfoQuery()
  const [currentTab, setCurrentTab] = useState('tab1')

  const userId = Number(user?.id) ?? null

  // --- clave: id y edit mode
  const propertyId = params.propertyId ?? null
  const isEditMode = Boolean(propertyId)

  // --- usa UNA SOLA query, condicionada
  const { data: property, refetch } = useGetPropertyByIdQuery(
    propertyId as string,
    {
      skip: !isEditMode,
      refetchOnMountOrArgChange: true,
    }
  )

  const stepStatus = useAppSelector(
    (state) => state.accountDetailForm.data.stepStatus
  )
  const currentStep = useAppSelector(
    (state) => state.accountDetailForm.data.currentStep
  )
  const formData = useAppSelector(
    (state) => state.accountDetailForm.data.formData
  )

  // --- imágenes ordenadas desde property
  const sortedImages = property?.images
    ? [...property.images].sort((a, b) => Number(a.number) - Number(b.number))
    : []

  const handleNextChange = (
    values:
      | PersonalInformationType
      | IdentificationType
      | Address
      | FinancialInformationType
      | PortalOfPortalsType,
    name: string
  ) => {
    const nextStep = currentStep + 1
    dispatch(setFormData({ [name]: values }))
    dispatch(
      setStepStatus({
        [currentStep]: { status: 'complete' },
        [nextStep]: { status: 'current' },
      })
    )
    dispatch(setCurrentStep(nextStep))
  }

  const handleBackChange = () => {
    const previousStep = currentStep - 1
    dispatch(setCurrentStep(previousStep))
  }

  const currentStepStatus = useMemo(
    () => stepStatus[currentStep].status,
    [stepStatus, currentStep]
  )

  // --- Hidrata el formulario solo en edit mode y cuando property llega
  useEffect(() => {
    if (!isEditMode || !property || propertyId !== property?.id) return

    const apiLat = property?.address?.lat
    const apiLng = property?.address?.lng

    const editedData = {
      personalInformation: {
        customerId: Number(property?.customer?.id),
        typeOfOperationId: property?.typeOfOperationId,
        typeOfPropertyId: property?.typeOfPropertyId,
        currencyId: property?.currencyId,
        propertyPrice: Number(property?.propertyPrice),
        timeAvailable: {
          start: isoUtcToLocalDate(property?.timeAvailableStart),
          end: isoUtcToLocalDate(property?.timeAvailableEnd),
        },
      },
      identification: {
        externalLink: property?.externalLink,
        highlighted: property?.highlighted,
        observations: property?.observations,
        characteristics: {
          locatedInCondominium: property?.characteristics?.locatedInCondominium,
          surface: property?.characteristics?.surface,
          constructedSurface: property?.characteristics?.constructedSurface,
          numberOfPrivate: property?.characteristics?.numberOfPrivate,
          numberOfVacantFloors: property?.characteristics?.numberOfVacantFloors,
          numberOfMeetingRooms: property?.characteristics?.numberOfMeetingRooms,
          hasKitchenet: property?.characteristics?.hasKitchenet,
          hasHouse: property?.characteristics?.hasHouse,
          officeNumber: property?.characteristics?.officeNumber,
          floorLevelLocation: property?.characteristics?.floorLevelLocation,
          locatedInGallery: property?.characteristics?.locatedInGallery,
          locatedFacingTheStreet:
            property?.characteristics?.locatedFacingTheStreet,
          commonExpenses: property?.characteristics?.commonExpenses,
          floors: property?.characteristics?.floors,
          numberOfFloors: property?.characteristics?.numberOfFloors,
          terraces: property?.characteristics?.terraces,
          terraceM2: property?.characteristics?.terraceM2,
          bathrooms: property?.characteristics?.bathrooms,
          bedrooms: property?.characteristics?.bedrooms,
          hasKitchen: property?.characteristics?.hasKitchen,
          typeOfKitchen: property?.characteristics?.typeOfKitchen,
          hasHeating: property?.characteristics?.hasHeating,
          typeOfHeating: property?.characteristics?.typeOfHeating,
          hasSecurity: property?.characteristics?.hasSecurity,
          typeOfSecurity: property?.characteristics?.typeOfSecurity?.map(
            (type) => ({ value: type, label: type })
          ),
          isFurnished: property?.characteristics?.isFurnished,
          hasAirConditioning: property?.characteristics?.hasAirConditioning,
          hasGarage: property?.characteristics?.hasGarage,
          numberOfParkingSpaces:
            property?.characteristics?.numberOfParkingSpaces,
          hasParking: property?.characteristics?.hasParking,
          hasElevator: property?.characteristics?.hasElevator,
          hasGym: property?.characteristics?.hasGym,
          hasSwimmingPool: property?.characteristics?.hasSwimmingPool,
          hasBarbecueArea: property?.characteristics?.hasBarbecueArea,
          propertyTitle: property?.propertyTitle,
          propertyDescription: property?.propertyDescription,
        },
      },
      addressInformation: {
        countryId: property?.address?.country?.id,
        stateId: property?.address?.state?.id,
        cityId: property?.address?.city?.id,
        letter: property?.address?.letter ?? '',
        number: property?.address?.number ?? '',
        references: property?.address?.references ?? '',
        address: property?.address?.address ?? '',
        addressPublic: property?.address?.addressPublic ?? '',
        lat: apiLat ? String(apiLat) : '',
        lng: apiLng ? String(apiLng) : '',
      },
      financialInformation: {
        isExchanged: property?.isExchanged,
        timeInExchange: {
          start: isoUtcToLocalDate(property?.timeInExchangeStart),
          end: isoUtcToLocalDate(property?.timeInExchangeEnd),
        },
        propertyDescriptionInExchange: property?.propertyDescriptionInExchange,
      },
      portalsInformation: {
        portals: normalizePropertyPortales(property?.property_portales),
      },
      owner_id: userId,
    }

    dispatch(setFormData(editedData))
  }, [dispatch, isEditMode, property, propertyId, userId])

  // --- Pasos al entrar en modo edición
  useEffect(() => {
    if (!isEditMode || !property?.id) return

    const hasImages =
      Array.isArray(property?.images) && property.images.length > 0

    dispatch(setCurrentStep(4)) // Tu lógica original dejaba 5 igualmente
    dispatch(
      setStepStatus({
        0: { status: 'complete' },
        1: { status: 'complete' },
        2: { status: 'complete' },
        3: { status: 'complete' },
        4: { status: 'complete' },
        5: { status: hasImages ? 'complete' : 'current' },
        6: { status: hasImages ? 'current' : 'pending' },
      })
    )
  }, [isEditMode, property?.id, property?.images, dispatch])

  // --- Refetch solo en rutas válidas e ID presente
  usePathChangeEffect(() => {
    if (isEditMode && location.pathname.startsWith('/mis-propiedades')) {
      refetch()
    }
  })

  console.log('formData', formData)

  return (
    <Container className="h-full">
      <Tabs
        value={currentTab}
        onChange={(val) => {
          setCurrentTab(String(val))
        }}
      >
        <TabList>
          <TabNav value="tab1" icon={<HiOutlineHome />}>
            {isEditMode ? 'Detalles' : 'Crear Propiedad'}
          </TabNav>

          {/* ℹ️ disable-pdp */}
          {isEditMode && (
            <TabNav value="tab2" icon={<FaHouseSignal />}>
              Portal de Portales
            </TabNav>
          )}
          {/* ℹ️ end disable-pdp */}
        </TabList>
        <div className="p-4">
          <TabContent value="tab1">
            <ResetKycFormOnRouteChange />
            <AdaptableCard className="h-full" bodyClass="h-full">
              <div className="grid lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-5 gap-4 h-full">
                {currentStep !== 6 && (
                  <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-2 py-2 bg-gray-100 border rounded-lg">
                    <FormStep
                      currentStep={currentStep}
                      currentStepStatus={currentStepStatus}
                      stepStatus={stepStatus}
                    />
                  </div>
                )}
                <div
                  className={
                    currentStep !== 6
                      ? '2xl:col-span-4 lg:col-span-3 xl:col-span-2'
                      : 'lg:col-span-5'
                  }
                >
                  <div className="p-4 lg:p-5 border rounded-lg h-[700px] overflow-y-scroll">
                    <Suspense fallback={<></>}>
                      {currentStep === 0 && (
                        <PersonalInformation
                          data={formData.personalInformation}
                          currentStepStatus={currentStepStatus}
                          onNextChange={handleNextChange}
                        />
                      )}
                      {currentStep === 1 && (
                        <Identification
                          data={formData.identification}
                          currentStepStatus={currentStepStatus}
                          onNextChange={handleNextChange}
                          onBackChange={handleBackChange}
                        />
                      )}
                      {currentStep === 2 && (
                        <AddressInfomation
                          data={formData.addressInformation}
                          currentStepStatus={currentStepStatus}
                          onNextChange={handleNextChange}
                          onBackChange={handleBackChange}
                        />
                      )}

                      {currentStep === 3 && (
                        <AccountReview
                          data={formData}
                          onSuccess={(data) => {
                            if (data?.id) {
                              navigate(`/mis-propiedades/${data.id}`)
                              dispatch(setCurrentStep(4))
                              dispatch(
                                setStepStatus({
                                  4: { status: 'complete' },
                                  5: { status: 'current' },
                                })
                              )
                            }
                          }}
                          onError={(error) => {
                            // Maneja error si quieres mostrar feedback
                          }}
                        />
                      )}

                      {currentStep === 4 && (
                        <UploadImage
                          propertyType={
                            formData?.personalInformation?.typeOfPropertyId ??
                            ''
                          }
                          images={sortedImages}
                          onNextChange={() => {
                            dispatch(
                              setStepStatus({
                                5: { status: 'complete' },
                                6: { status: 'current' },
                              })
                            )
                            dispatch(setCurrentStep(5))
                          }}
                        />
                      )}
                    </Suspense>
                  </div>
                </div>
              </div>
            </AdaptableCard>
          </TabContent>

          <TabContent value="tab2">
            <PortaOfPropertyOverview />
          </TabContent>
        </div>
      </Tabs>
    </Container>
  )
}

export default PropertiesPortfolio
