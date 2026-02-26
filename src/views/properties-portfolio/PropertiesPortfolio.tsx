/* eslint-disable import/no-unresolved */
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
import { HiOutlineHome } from 'react-icons/hi'
import { useLocation, useNavigate, useParams } from 'react-router'
import UploadImage from '../my-properties/PropertyDetails/components/UploadImage'
import FormStep from './components/FormStep'
import { usePathChangeEffect } from './hooks/use-patch-change-effect'
import reducer, {
  Address,
  Caracteristicas as CaracteristicasType,
  InformacionPrincipal as InformacionPrincipalType,
  resetFormState,
  setCurrentStep,
  setFormData,
  setStepStatus,
  useAppDispatch,
  useAppSelector,
} from './store'

const { TabNav, TabList, TabContent } = Tabs
injectReducer('accountDetailForm', reducer)

const InformacionPrincipal = lazy(
  () => import('./components/InformacionPrincipal')
)
const Caracteristicas = lazy(() => import('./components/Caracteristicas'))
const AddressInfomation = lazy(() => import('./components/AddressInfomation'))
const CreacionPropiedad = lazy(() => import('./components/CreacionPropiedad'))

const ResetKycFormOnRouteChange = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (location.pathname === '/mis-propiedades/crear-propiedad') {
      dispatch(resetFormState())
    }
  }, [location.pathname, dispatch])

  return null
}

const PropertiesPortfolio = () => {
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { data: user } = useGetMyInfoQuery()
  const [currentTab, setCurrentTab] = useState('tab1')

  const userId = Number(user?.id) ?? null

  const propertyId = params.propertyId ?? null
  const isEditMode = Boolean(propertyId)

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

  const sortedImages = property?.images
    ? [...property.images].sort((a, b) => Number(a.number) - Number(b.number))
    : []

  const handleNextChange = (
    values: InformacionPrincipalType | CaracteristicasType | Address,
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
    () => stepStatus?.[currentStep]?.status,
    [stepStatus, currentStep]
  )

  // Hidratación edit mode (solo campos que siguen existiendo en el wizard)
  useEffect(() => {
    if (!isEditMode || !property || propertyId !== property?.id) return

    const editedData = {
      informacionPrincipal: {
        customerId: Number(property?.customer?.id ?? null),
        typeOfOperationId: property?.typeOfOperationId ?? null,
        typeOfPropertyId: property?.typeOfPropertyId ?? null,
        currencyId: (property?.currencyId ?? 'CLP') as 'CLP' | 'UF',
        propertyPrice: Number(property?.propertyPrice ?? 0),
        timeAvailable: {
          start: isoUtcToLocalDate(property?.timeAvailableStart),
          end: isoUtcToLocalDate(property?.timeAvailableEnd),
        },
      },
      caracteristicas: {
        externalLink: property?.externalLink ?? '',
        highlighted: Boolean(property?.highlighted),
        observations: property?.observations ?? '',
        propertyStatusId: Number(property?.propertyStatus?.id ?? 0),
        characteristics: {
          rol: property?.characteristics?.rol ?? '',
          locatedInCondominium: Boolean(
            property?.characteristics?.locatedInCondominium
          ),
          numberOfVacantFloors:
            property?.characteristics?.numberOfVacantFloors ?? '',
          numberOfMeetingRooms:
            property?.characteristics?.numberOfMeetingRooms ?? '',
          hasKitchenet: Boolean(property?.characteristics?.hasKitchenet),
          hasHouse: Boolean(property?.characteristics?.hasHouse),
          officeNumber: property?.characteristics?.officeNumber ?? '',
          floorLevelLocation:
            property?.characteristics?.floorLevelLocation ?? '',
          commonExpenses: property?.characteristics?.commonExpenses ?? '',
          numberOfFloors: property?.characteristics?.numberOfFloors ?? '',
          terraces: property?.characteristics?.terraces ?? '',
          terraceM2: property?.characteristics?.terraceM2 ?? '',
          bathrooms: property?.characteristics?.bathrooms ?? '',
          bedrooms: property?.characteristics?.bedrooms ?? '',
          surfaceUnit: property?.characteristics?.surfaceUnit ?? '',
          typeOfKitchen: property?.characteristics?.typeOfKitchen ?? '',
          hasHeating: Boolean(property?.characteristics?.hasHeating),
          hasSecurity: Boolean(property?.characteristics?.hasSecurity),
          typeOfSecurity: Array.isArray(
            property?.characteristics?.typeOfSecurity
          )
            ? property.characteristics.typeOfSecurity.map((t: string) => ({
                value: t,
                label: t,
              }))
            : [],
          isFurnished: Boolean(property?.characteristics?.isFurnished),
          hasAirConditioning: Boolean(
            property?.characteristics?.hasAirConditioning
          ),
          orientation: property?.characteristics?.orientation,
          typeOfHeating: property?.characteristics?.typeOfHeating,
          locatedInGallery: Boolean(
            property?.characteristics?.locatedInGallery
          ),
          locatedFacingTheStreet: Boolean(
            property?.characteristics?.locatedFacingTheStreet
          ),
          numberOfPrivate: Number(property?.characteristics?.numberOfPrivate),
          numberOfDepartment: property?.characteristics?.numberOfDepartment,
          apartmentsPerFloor: Number(
            property?.characteristics?.apartmentsPerFloor
          ),
          departmentType: property?.characteristics?.departmentType,
          hasRooftop: Boolean(property?.characteristics?.hasRooftop),
          hasBoiler: Boolean(property?.characteristics?.hasBoiler),
          hasLoggia: Boolean(property?.characteristics?.hasLoggia),
          hasGarage: Boolean(property?.characteristics?.hasGarage),
          hasParking: Boolean(property?.characteristics?.hasParking),
          hasElevator: Boolean(property?.characteristics?.hasElevator),
          hasGym: Boolean(property?.characteristics?.hasGym),
          hasSwimmingPool: Boolean(property?.characteristics?.hasSwimmingPool),
          hasBarbecueArea: Boolean(property?.characteristics?.hasBarbecueArea),
          propertyTitle: property?.propertyTitle ?? '',
          propertyDescription: property?.propertyDescription ?? '',
          hasKitchen: Boolean(property?.characteristics?.hasKitchen),
          surface: property?.characteristics?.surface ?? '',
          constructedSurface:
            property?.characteristics?.constructedSurface ?? '',
          numberOfParkingSpaces:
            property?.characteristics?.numberOfParkingSpaces ?? '',
          hasServiceRoom: Boolean(property?.characteristics?.hasServiceRoom),
          hasLivingRoom: Boolean(property?.characteristics?.hasLivingRoom),
          geography: property?.characteristics?.geography ?? '',
          storageCount: Number(property?.characteristics?.storageCount ?? 0),
          ceilingType: property?.characteristics?.ceilingType ?? '',
          flooringType: property?.characteristics?.flooringType ?? '',
          hasHomeOffice: Boolean(property?.characteristics?.hasHomeOffice),
          hasDiningRoom: Boolean(property?.characteristics?.hasDiningRoom),
          hasYard: Boolean(property?.characteristics?.hasYard),
          hasGuestBathroom: Boolean(
            property?.characteristics?.hasGuestBathroom
          ),
          hasSuite: Boolean(property?.characteristics?.hasSuite),
          hasWalkInCloset: Boolean(property?.characteristics?.hasWalkInCloset),
          hasPlayRoom: Boolean(property?.characteristics?.hasPlayRoom),
          hasFireplace: Boolean(property?.characteristics?.hasFireplace),
          hasPlayground: Boolean(property?.characteristics?.hasPlayground),
          hasPaddleCourt: Boolean(property?.characteristics?.hasPaddleCourt),
          hasPartyRoom: Boolean(property?.characteristics?.hasPartyRoom),
          hasSoccerField: Boolean(property?.characteristics?.hasSoccerField),
          hasTennisCourt: Boolean(property?.characteristics?.hasTennisCourt),
          hasBasketballCourt: Boolean(
            property?.characteristics?.hasBasketballCourt
          ),
          contactHours: property?.characteristics?.contactHours ?? '',
          yearOfConstruction: Number(
            property?.characteristics?.yearOfConstruction ?? 0
          ),
          hasJacuzzi: Boolean(property?.characteristics?.hasJacuzzi),
          hasHorseStable: Boolean(property?.characteristics?.hasHorseStable),
          landShape: property?.characteristics?.landShape ?? '',
          distanceToAsphalt: Number(
            property?.characteristics?.distanceToAsphalt ?? 0
          ),
          has24hConcierge: Boolean(property?.characteristics?.has24hConcierge),
          hasInternetAccess: Boolean(
            property?.characteristics?.hasInternetAccess
          ),
          hasNaturalGas: Boolean(property?.characteristics?.hasNaturalGas),
          hasRunningWater: Boolean(property?.characteristics?.hasRunningWater),
          hasTelephoneLine: Boolean(
            property?.characteristics?.hasTelephoneLine
          ),
          hasSewerConnection: Boolean(
            property?.characteristics?.hasSewerConnection
          ),
          hasElectricity: Boolean(property?.characteristics?.hasElectricity),
          hasMansard: Boolean(property?.characteristics?.hasMansard),
          hasBalcony: Boolean(property?.characteristics?.hasBalcony),
          hasClosets: Boolean(property?.characteristics?.hasClosets),
          hasVisitorParking: Boolean(
            property?.characteristics?.hasVisitorParking
          ),
          hasGreenAreas: Boolean(property?.characteristics?.hasGreenAreas),
          hasMultiSportsCourt: Boolean(
            property?.characteristics?.hasMultiSportsCourt
          ),
          hasRefrigerator: Boolean(property?.characteristics?.hasRefrigerator),
          hasCinemaArea: Boolean(property?.characteristics?.hasCinemaArea),
          hasSauna: Boolean(property?.characteristics?.hasSauna),
          houseType: property?.characteristics?.houseType ?? '',
          floorNumber: Number(property?.characteristics?.floorNumber ?? 0),
          unitNumber: property?.characteristics?.unitNumber ?? '',
          apartmentType: property?.characteristics?.apartmentType ?? '',
          unitsPerFloor: Number(property?.characteristics?.unitsPerFloor ?? 0),
          hasLaundryRoom: Boolean(property?.characteristics?.hasLaundryRoom),
          hasMultipurposeRoom: Boolean(
            property?.characteristics?.hasMultipurposeRoom
          ),
          petsAllowed: Boolean(property?.characteristics?.petsAllowed),
          isCommercialUseAllowed: Boolean(
            property?.characteristics?.isCommercialUseAllowed
          ),
          condominiumClosed: Boolean(
            property?.characteristics?.condominiumClosed
          ),
          hasConcierge: Boolean(property?.characteristics?.hasConcierge),
          hasWasherConnection: Boolean(
            property?.characteristics?.hasWasherConnection
          ),
          hasElectricGenerator: Boolean(
            property?.characteristics?.hasElectricGenerator
          ),
          hasSolarEnergy: Boolean(property?.characteristics?.hasSolarEnergy),
          hasCistern: Boolean(property?.characteristics?.hasCistern),
          hasBolier: Boolean(property?.characteristics?.hasBolier),
          buildingName: property?.characteristics?.buildingName ?? '',
          buildingType: property?.characteristics?.buildingType ?? '',
          hasSecondLevel: Boolean(property?.characteristics?.hasSecondLevel),

          //   PARCELA
          frontageMeters: Number(property?.characteristics?.frontageMeters),
          deepMeters: Number(property?.characteristics?.deepMeters),
          isUrbanized: Boolean(property?.characteristics?.isUrbanized),
          hasFlatSurface: Boolean(property?.characteristics?.hasFlatSurface),

          //   POR INTEGRAR
          //   BODEGA
          typeOfBuilding: property?.characteristics?.typeOfBuilding,
          hasControlledAccess: Boolean(
            property?.characteristics?.hasControlledAccess
          ),
          hasThreephaseCurrent: Boolean(
            property?.characteristics?.hasThreephaseCurrent
          ),
          hasSurveillanceCamera: Boolean(
            property?.characteristics?.hasSurveillanceCamera
          ),
          hasScale: Boolean(property?.characteristics?.hasScale),
          hasVentilationSystem: Boolean(
            property?.characteristics?.hasVentilationSystem
          ),
          typeOfWinery: property?.characteristics?.typeOfWinery,
          cellarHeight: Number(property?.characteristics?.cellarHeight),
          cellarHeightUnit: property?.characteristics?.cellarHeightUnit,
          pricePerUnitOfArea: Number(
            property?.characteristics?.pricePerUnitOfArea
          ),
          pricePerUnitOfAreaUnit:
            property?.characteristics?.pricePerUnitOfAreaUnit,
          floorStand: Number(property?.characteristics?.floorStand),
          floorStandUnit: property?.characteristics?.floorStandUnit,
          flatbedTrailers: Number(property?.characteristics?.flatbedTrailers),
          hasAlarm: Boolean(property?.characteristics?.hasAlarm),
          hasFireProtectionSystem: Boolean(
            property?.characteristics?.hasFireProtectionSystem
          ),
        },

        // OFICINA
        hasMeetingRooms: Boolean(property?.characteristics?.hasMeetingRooms),
        hasFreeFloor: Boolean(property?.characteristics?.hasFreeFloor),
        hasValetParking: Boolean(property?.characteristics?.hasValetParking),
        hasLobby: Boolean(property?.characteristics?.hasLobby),
        hasReceptionArea: Boolean(property?.characteristics?.hasReceptionArea),
        bathroomsPerFloor: Number(property?.characteristics?.bathroomsPerFloor),
        officesPerFloor: Number(property?.characteristics?.officesPerFloor),

        // ESTACIONAMIENTO
        hasSimpleParking: Boolean(property?.characteristics?.hasSimpleParking),
        hasDoubleParking: Boolean(property?.characteristics?.hasDoubleParking),
        hasSubway: Boolean(property?.characteristics?.hasSubway),
        typeOfParking: property?.characteristics?.typeOfParking,
        accessToParking: property?.characteristics?.accessToParking,
        typeOfParkingCoverage: property?.characteristics?.typeOfParkingCoverage,

        // TERRENO
        hasReforestation: Boolean(property?.characteristics?.hasReforestation),

        // INDUSTRIAL
        hasWarehouses: Boolean(property?.characteristics?.hasWarehouses),
        hasLocationCentral: Boolean(
          property?.characteristics?.hasLocationCentral
        ),

        // LOCAL COMERCIAL
        hasWheelchairRamp: Boolean(
          property?.characteristics?.hasWheelchairRamp
        ),
        hasFittingRoom: Boolean(property?.characteristics?.hasFittingRoom),

        // AGRICOLA
        hectares: Number(property?.characteristics?.hectares),
        hasDrinkingFountains: Boolean(
          property?.characteristics?.hasDrinkingFountains
        ),
        hasWaterTank: Boolean(property?.characteristics?.hasWaterTank),
        hasBarn: Boolean(property?.characteristics?.hasBarn),
        hasMills: Boolean(property?.characteristics?.hasMills),
        hasCorral: Boolean(property?.characteristics?.hasCorral),
        hasSilos: Boolean(property?.characteristics?.hasSilos),

        typeOfFarm: property?.characteristics?.typeOfFarm,
        coveredHullAread: Number(property?.characteristics?.coveredHullAread),
        coveredHullAreadUnit: property?.characteristics?.coveredHullAreadUnit,
      },

      addressInformation: {
        countryId: property?.address?.country?.id ?? null,
        stateId: property?.address?.state?.id ?? null,
        cityId: property?.address?.city?.id ?? null,
        letter: property?.address?.letter ?? '',
        number: property?.address?.number ?? '',
        references: property?.address?.references ?? '',
        address: property?.address?.address ?? '',
        addressPublic: property?.address?.addressPublic ?? '',
        lat: property?.address?.lat ? String(property.address.lat) : '',
        lng: property?.address?.lng ? String(property.address.lng) : '',
      },

      // Si en tu formData existe financialInformation y lo sigues guardando aunque el step ya no exista:
      financialInformation: {
        isExchanged: false, // Boolean(property?.isExchanged)
        timeInExchange: {
          start: null,
          end: null,
        },
        propertyDescriptionInExchange: '',
      },

      owner_id: userId,
    }

    dispatch(setFormData(editedData))
  }, [dispatch, isEditMode, property, propertyId, userId])

  // Estados iniciales al entrar en edición
  useEffect(() => {
    if (!isEditMode || !property?.id) return

    dispatch(setCurrentStep(4))
    dispatch(
      setStepStatus({
        0: { status: 'complete' },
        1: { status: 'complete' },
        2: { status: 'complete' },
        3: { status: 'complete' },
        4: { status: 'current' },
      })
    )
  }, [isEditMode, property?.id, dispatch])

  usePathChangeEffect(() => {
    if (isEditMode && location.pathname.startsWith('/mis-propiedades')) {
      refetch()
    }
  })

  return (
    <Container className="h-full">
      <Tabs value={currentTab} onChange={(val) => setCurrentTab(String(val))}>
        <TabList>
          <TabNav value="tab1" icon={<HiOutlineHome />}>
            {isEditMode ? 'Detalles' : 'Crear Propiedad'}
          </TabNav>
        </TabList>

        <div className="p-4">
          <TabContent value="tab1">
            <ResetKycFormOnRouteChange />

            <AdaptableCard className="h-full" bodyClass="h-full">
              <div className="grid lg:grid-cols-5 xl:grid-cols-3 2xl:grid-cols-5 gap-4 h-full">
                {/* wizard lateral siempre visible en 0..4 */}
                <div className="2xl:col-span-1 xl:col-span-1 lg:col-span-2 py-2 bg-gray-100 border rounded-lg">
                  <FormStep
                    currentStep={currentStep}
                    currentStepStatus={currentStepStatus}
                    stepStatus={stepStatus}
                  />
                </div>

                <div className="2xl:col-span-4 lg:col-span-3 xl:col-span-2">
                  <div className="p-4 lg:p-5 border rounded-lg h-[650px] max-h-[650px] overflow-y-scroll">
                    <Suspense fallback={<></>}>
                      {currentStep === 0 && (
                        <InformacionPrincipal
                          data={formData.informacionPrincipal}
                          currentStepStatus={currentStepStatus}
                          onNextChange={handleNextChange}
                        />
                      )}

                      {currentStep === 1 && (
                        <Caracteristicas
                          data={formData.caracteristicas}
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

                      {/* ✅ step 3: publicar */}
                      {currentStep === 3 && (
                        <CreacionPropiedad
                          data={formData}
                          onSuccess={(data) => {
                            if (data?.id) {
                              navigate(`/mis-propiedades/${data.id}`)
                              dispatch(setCurrentStep(4))
                              dispatch(
                                setStepStatus({
                                  3: { status: 'complete' },
                                  4: { status: 'current' },
                                })
                              )
                            }
                          }}
                          onError={() => {
                            //
                          }}
                        />
                      )}

                      {/* ✅ step 4: imágenes */}
                      {currentStep === 4 && (
                        <UploadImage images={sortedImages} />
                      )}
                    </Suspense>
                  </div>
                </div>
              </div>
            </AdaptableCard>
          </TabContent>
        </div>
      </Tabs>
    </Container>
  )
}

export default PropertiesPortfolio
