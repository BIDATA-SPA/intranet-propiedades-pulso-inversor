/* eslint-disable @typescript-eslint/no-explicit-any */
import { SegmentItemOption } from '@/components/shared'
import { Segment } from '@/components/ui'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import ApiService from '@/services/ApiService'
import {
  mapSpcToPortalCreate,
  mapSpcToPortalUpdate,
} from '@/services/portal/mappers/toPortalPublication'
import {
  useCreatePropertyMutation,
  useGetMyInfoQuery,
  useLazyFindPortalPublicationsQuery,
  useUpdatePropertyMutation,
} from '@/services/RtkQueryService'
import { injectReducer } from '@/store'
import { usePdpSecureActions } from '@/utils/hooks/usePdpSecureActions'
import openNotification from '@/utils/openNotification'
import {
  stripNulls,
  toBool,
  toISOOrNull,
  toNum,
  toStr,
  toStrOrNull,
} from '@/utils/parsing-types'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useRef, useState } from 'react'
import { HiCheckCircle } from 'react-icons/hi'
import { useParams, useSearchParams } from 'react-router-dom'
import reducer, { resetFormState, setFormData, useAppDispatch } from '../store'

injectReducer('accountDetailForm', reducer)

type AccountReviewProps = {
  data: any
  onSuccess?: (payload?: any) => void
  onError?: (err?: any) => void
}

const computeExternalLink = (id: string | number) =>
  `https://pulsopropiedades.cl/propiedades/${id}`

const PORTAL_TAG = { id: 'pulsoPropiedades', name: 'Pulso Propiedades' }

const CreacionPropiedad = ({
  data,
  onSuccess,
  onError,
}: AccountReviewProps) => {
  const { propertyId: routePropertyId } = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { data: user } = useGetMyInfoQuery()

  const queryPropertyId = searchParams.get('propertyId')
  const id = routePropertyId ?? queryPropertyId ?? null
  const hasPropertyId = Boolean(id)

  // Pulso Propiedades
  const [createProperty, { isLoading: isLoadingCreate }] =
    useCreatePropertyMutation()
  const [updateProperty, { isLoading: isLoadingUpdate }] =
    useUpdatePropertyMutation()

  // Portal de Portales (para buscar por code)
  const [findPortalByCode] = useLazyFindPortalPublicationsQuery()

  // 🔐 acciones seguras PDP
  const { ensureToken, secureCreate, secureUpdate } = usePdpSecureActions()

  const isSubmittingAny = isLoadingCreate || isLoadingUpdate

  // ================== helpers ==================
  const buildPayload = (values: any) => {
    const step1 = {
      customerId: toNum(values?.informacionPrincipal?.customerId),
      typeOfOperationId: toStr(values?.informacionPrincipal?.typeOfOperationId),
      timeAvailable: {
        start: toISOOrNull(values?.informacionPrincipal?.timeAvailable?.start),
        end: toISOOrNull(values?.informacionPrincipal?.timeAvailable?.end),
      },
      typeOfPropertyId: toStr(values?.informacionPrincipal?.typeOfPropertyId),
      currencyId: toStr(values?.informacionPrincipal?.currencyId),
      propertyPrice: toNum(values?.informacionPrincipal?.propertyPrice),
    }

    const step2 = {
      highlighted: toBool(values?.caracteristicas?.highlighted),
      propertyStatusId: 4,
      disableReason: '',
      observations: toStrOrNull(values?.caracteristicas?.observations),
      externalLink: toStrOrNull(values?.caracteristicas?.externalLink),
      characteristics: {
        rol: toStr(values?.caracteristicas?.characteristics?.rol),
        locatedInCondominium: toBool(
          values?.caracteristicas?.characteristics?.locatedInCondominium
        ),
        numberOfVacantFloors: toStr(
          values?.caracteristicas?.characteristics?.numberOfVacantFloors
        ),
        numberOfMeetingRooms: toStr(
          values?.caracteristicas?.characteristics?.numberOfMeetingRooms
        ),
        hasKitchenet: toBool(
          values?.caracteristicas?.characteristics?.hasKitchenet
        ),
        hasHouse: toBool(values?.caracteristicas?.characteristics?.hasHouse),
        officeNumber: toStr(
          values?.caracteristicas?.characteristics?.officeNumber
        ),
        floorLevelLocation: toStr(
          values?.caracteristicas?.characteristics?.floorLevelLocation
        ),
        commonExpenses: toStr(
          values?.caracteristicas?.characteristics?.commonExpenses
        ),
        numberOfFloors: toStr(
          values?.caracteristicas?.characteristics?.numberOfFloors
        ),
        terraces: toStr(values?.caracteristicas?.characteristics?.terraces),
        terraceM2: toStr(values?.caracteristicas?.characteristics?.terraceM2),
        bathrooms: toStr(values?.caracteristicas?.characteristics?.bathrooms),
        bedrooms: toStr(values?.caracteristicas?.characteristics?.bedrooms),
        surfaceUnit: toStr(
          values?.caracteristicas?.characteristics?.surfaceUnit
        ),
        typeOfKitchen: toStr(
          values?.caracteristicas?.characteristics?.typeOfKitchen
        ),
        hasHeating: toBool(
          values?.caracteristicas?.characteristics?.hasHeating
        ),
        hasSecurity: toBool(
          values?.caracteristicas?.characteristics?.hasSecurity
        ),
        typeOfSecurity: Array.isArray(
          values?.caracteristicas?.characteristics?.typeOfSecurity
        )
          ? values.caracteristicas.characteristics.typeOfSecurity
              .map((x: any) => toStr(x?.value ?? x))
              .filter(Boolean)
          : [],
        isFurnished: toBool(
          values?.caracteristicas?.characteristics?.isFurnished
        ),
        hasAirConditioning: toBool(
          values?.caracteristicas?.characteristics?.hasAirConditioning
        ),
        hasGarage: toBool(values?.caracteristicas?.characteristics?.hasGarage),
        hasParking: toBool(
          values?.caracteristicas?.characteristics?.hasParking
        ),
        hasElevator: toBool(
          values?.caracteristicas?.characteristics?.hasElevator
        ),
        hasGym: toBool(values?.caracteristicas?.characteristics?.hasGym),
        hasSwimmingPool: toBool(
          values?.caracteristicas?.characteristics?.hasSwimmingPool
        ),
        hasBarbecueArea: toBool(
          values?.caracteristicas?.characteristics?.hasBarbecueArea
        ),
        propertyTitle: toStr(
          values?.caracteristicas?.characteristics?.propertyTitle
        ),
        propertyDescription: toStr(
          values?.caracteristicas?.characteristics?.propertyDescription
        ),
        hasKitchen: toBool(
          values?.caracteristicas?.characteristics?.hasKitchen
        ),
        surface: toStr(values?.caracteristicas?.characteristics?.surface),
        constructedSurface: toStr(
          values?.caracteristicas?.characteristics?.constructedSurface
        ),
        hasServiceRoom: toBool(
          values?.caracteristicas?.characteristics?.hasServiceRoom
        ),
        hasLivingRoom: toBool(
          values?.caracteristicas?.characteristics?.hasLivingRoom
        ),
        geography: toStr(values?.caracteristicas?.characteristics?.geography),
        storageCount: toNum(
          values?.caracteristicas?.characteristics?.storageCount
        ),
        ceilingType: toStr(
          values?.caracteristicas?.characteristics?.ceilingType
        ),
        flooringType: toStr(
          values?.caracteristicas?.characteristics?.flooringType
        ),
        hasHomeOffice: toBool(
          values?.caracteristicas?.characteristics?.hasHomeOffice
        ),
        hasDiningRoom: toBool(
          values?.caracteristicas?.characteristics?.hasDiningRoom
        ),
        hasYard: toBool(values?.caracteristicas?.characteristics?.hasYard),
        hasGuestBathroom: toBool(
          values?.caracteristicas?.characteristics?.hasGuestBathroom
        ),
        hasSuite: toBool(values?.caracteristicas?.characteristics?.hasSuite),
        hasWalkInCloset: toBool(
          values?.caracteristicas?.characteristics?.hasWalkInCloset
        ),
        hasPlayRoom: toBool(
          values?.caracteristicas?.characteristics?.hasPlayRoom
        ),
        hasFireplace: toBool(
          values?.caracteristicas?.characteristics?.hasFireplace
        ),
        hasPlayground: toBool(
          values?.caracteristicas?.characteristics?.hasPlayground
        ),
        hasPaddleCourt: toBool(
          values?.caracteristicas?.characteristics?.hasPaddleCourt
        ),
        hasPartyRoom: toBool(
          values?.caracteristicas?.characteristics?.hasPartyRoom
        ),
        hasSoccerField: toBool(
          values?.caracteristicas?.characteristics?.hasSoccerField
        ),
        hasTennisCourt: toBool(
          values?.caracteristicas?.characteristics?.hasTennisCourt
        ),
        hasBasketballCourt: toBool(
          values?.caracteristicas?.characteristics?.hasBasketballCourt
        ),

        contactHours: toStr(
          values?.caracteristicas?.characteristics?.contactHours
        ),
        yearOfConstruction: toNum(
          values?.caracteristicas?.characteristics?.yearOfConstruction
        ),

        hasJacuzzi: toBool(
          values?.caracteristicas?.characteristics?.hasJacuzzi
        ),
        hasHorseStable: toBool(
          values?.caracteristicas?.characteristics?.hasHorseStable
        ),
        landShape: toStr(values?.caracteristicas?.characteristics?.landShape),
        distanceToAsphalt: toNum(
          values?.caracteristicas?.characteristics?.distanceToAsphalt
        ),

        has24hConcierge: toBool(
          values?.caracteristicas?.characteristics?.has24hConcierge
        ),
        hasInternetAccess: toBool(
          values?.caracteristicas?.characteristics?.hasInternetAccess
        ),
        hasNaturalGas: toBool(
          values?.caracteristicas?.characteristics?.hasNaturalGas
        ),
        hasRunningWater: toBool(
          values?.caracteristicas?.characteristics?.hasRunningWater
        ),
        hasTelephoneLine: toBool(
          values?.caracteristicas?.characteristics?.hasTelephoneLine
        ),
        hasSewerConnection: toBool(
          values?.caracteristicas?.characteristics?.hasSewerConnection
        ),
        hasElectricity: toBool(
          values?.caracteristicas?.characteristics?.hasElectricity
        ),

        hasMansard: toBool(
          values?.caracteristicas?.characteristics?.hasMansard
        ),
        hasBalcony: toBool(
          values?.caracteristicas?.characteristics?.hasBalcony
        ),
        hasClosets: toBool(
          values?.caracteristicas?.characteristics?.hasClosets
        ),
        hasVisitorParking: toBool(
          values?.caracteristicas?.characteristics?.hasVisitorParking
        ),
        hasGreenAreas: toBool(
          values?.caracteristicas?.characteristics?.hasGreenAreas
        ),
        hasMultiSportsCourt: toBool(
          values?.caracteristicas?.characteristics?.hasMultiSportsCourt
        ),
        hasRefrigerator: toBool(
          values?.caracteristicas?.characteristics?.hasRefrigerator
        ),
        hasCinemaArea: toBool(
          values?.caracteristicas?.characteristics?.hasCinemaArea
        ),
        hasSauna: toBool(values?.caracteristicas?.characteristics?.hasSauna),
        houseType: toStr(values?.caracteristicas?.characteristics?.houseType),
        floorNumber: toNum(
          values?.caracteristicas?.characteristics?.floorNumber
        ),
        unitNumber: toStr(values?.caracteristicas?.characteristics?.unitNumber),
        apartmentType: toStr(
          values?.caracteristicas?.characteristics?.apartmentType
        ),
        unitsPerFloor: toNum(
          values?.caracteristicas?.characteristics?.unitsPerFloor
        ),
        hasLaundryRoom: toBool(
          values?.caracteristicas?.characteristics?.hasLaundryRoom
        ),
        hasMultipurposeRoom: toBool(
          values?.caracteristicas?.characteristics?.hasMultipurposeRoom
        ),
        petsAllowed: toBool(
          values?.caracteristicas?.characteristics?.petsAllowed
        ),
        isCommercialUseAllowed: toBool(
          values?.caracteristicas?.characteristics?.isCommercialUseAllowed
        ),
        condominiumClosed: toBool(
          values?.caracteristicas?.characteristics?.condominiumClosed
        ),
        hasConcierge: toBool(
          values?.caracteristicas?.characteristics?.hasConcierge
        ),
        hasWasherConnection: toBool(
          values?.caracteristicas?.characteristics?.hasWasherConnection
        ),
        hasElectricGenerator: toBool(
          values?.caracteristicas?.characteristics?.hasElectricGenerator
        ),
        hasSolarEnergy: toBool(
          values?.caracteristicas?.characteristics?.hasSolarEnergy
        ),
        hasCistern: toBool(
          values?.caracteristicas?.characteristics?.hasCistern
        ),
        hasBolier: toBool(values?.caracteristicas?.characteristics?.hasBolier),
        buildingName: toStr(
          values?.caracteristicas?.characteristics?.buildingName
        ),
        buildingType: toStr(
          values?.caracteristicas?.characteristics?.buildingType
        ),
        hasSecondLevel: toBool(
          values?.caracteristicas?.characteristics?.hasSecondLevel
        ),
        orientation: toStr(
          values?.caracteristicas?.characteristics?.orientation
        ),
        typeOfHeating: toStr(
          values?.caracteristicas?.characteristics?.typeOfHeating
        ),
        locatedInGallery: toBool(
          values?.caracteristicas?.characteristics?.locatedInGallery
        ),
        locatedFacingTheStreet: toBool(
          values?.caracteristicas?.characteristics?.locatedFacingTheStreet
        ),
        numberOfPrivate: toNum(
          values?.caracteristicas?.characteristics?.numberOfPrivate
        ),
        numberOfDepartment: toStr(
          values?.caracteristicas?.characteristics?.numberOfDepartment
        ),
        apartmentsPerFloor: toNum(
          values?.caracteristicas?.characteristics?.apartmentsPerFloor
        ),
        departmentType: toStr(
          values?.caracteristicas?.characteristics?.departmentType
        ),
        hasRooftop: toBool(
          values?.caracteristicas?.characteristics?.hasRooftop
        ),
        hasBoiler: toBool(values?.caracteristicas?.characteristics?.hasBoiler),
        hasLoggia: toBool(values?.caracteristicas?.characteristics?.hasLoggia),
        frontageMeters: toNum(
          values?.caracteristicas?.characteristics?.frontageMeters
        ),
        deepMeters: Number(
          values?.caracteristicas?.characteristics?.deepMeters
        ),
        isUrbanized: Boolean(
          values?.caracteristicas?.characteristics?.isUrbanized
        ),
        hasFlatSurface: Boolean(
          values?.caracteristicas?.characteristics?.hasFlatSurface
        ),

        // POR INTEGRAR
        // BODEGA
        typeOfBuilding: toStr(
          values?.caracteristicas?.characteristics?.typeOfBuilding
        ),

        hasControlledAccess: toBool(
          values?.caracteristicas?.characteristics?.hasControlledAccess
        ),
        hasThreephaseCurrent: toBool(
          values?.caracteristicas?.characteristics?.hasThreephaseCurrent
        ),
        hasSurveillanceCamera: toBool(
          values?.caracteristicas?.characteristics?.hasSurveillanceCamera
        ),
        hasScale: toBool(values?.caracteristicas?.characteristics?.hasScale),
        hasVentilationSystem: toBool(
          values?.caracteristicas?.characteristics?.hasVentilationSystem
        ),
        typeOfWinery: toStr(
          values?.caracteristicas?.characteristics?.typeOfWinery
        ),
        cellarHeight: toNum(
          values?.caracteristicas?.characteristics?.cellarHeight
        ),
        cellarHeightUnit: toStr(
          values?.caracteristicas?.characteristics?.cellarHeightUnit
        ),
        pricePerUnitOfArea: toNum(
          values?.caracteristicas?.characteristics?.pricePerUnitOfArea
        ),
        pricePerUnitOfAreaUnit: toStr(
          values?.caracteristicas?.characteristics?.pricePerUnitOfAreaUnit
        ),
        floorStand: toNum(values?.caracteristicas?.characteristics?.floorStand),
        floorStandUnit: toStr(
          values?.caracteristicas?.characteristics?.floorStandUnit
        ),
        flatbedTrailers: toNum(
          values?.caracteristicas?.characteristics?.flatbedTrailers
        ),
        hasAlarm: toBool(values?.caracteristicas?.characteristics?.hasAlarm),
        hasFireProtectionSystem: toBool(
          values?.caracteristicas?.characteristics?.hasFireProtectionSystem
        ),

        // OFICINA
        hasMeetingRooms: toBool(
          values?.caracteristicas?.characteristics?.hasMeetingRooms
        ),
        hasFreeFloor: toBool(
          values?.caracteristicas?.characteristics?.hasFreeFloor
        ),
        hasValetParking: toBool(
          values?.caracteristicas?.characteristics?.hasValetParking
        ),
        hasLobby: toBool(values?.caracteristicas?.characteristics?.hasLobby),
        hasReceptionArea: toBool(
          values?.caracteristicas?.characteristics?.hasReceptionArea
        ),
        bathroomsPerFloor: toNum(
          values?.caracteristicas?.characteristics?.bathroomsPerFloor
        ),
        officesPerFloor: toNum(
          values?.caracteristicas?.characteristics?.officesPerFloor
        ),

        // ESTACIONAMIENTO
        hasSimpleParking: toBool(
          values?.caracteristicas?.characteristics?.hasSimpleParking
        ),
        hasDoubleParking: toBool(
          values?.caracteristicas?.characteristics?.hasDoubleParking
        ),
        hasSubway: toBool(values?.caracteristicas?.characteristics?.hasSubway),
        typeOfParking: toStr(
          values?.caracteristicas?.characteristics?.typeOfParking
        ),
        accessToParking: toStr(
          values?.caracteristicas?.characteristics?.accessToParking
        ),
        typeOfParkingCoverage: toStr(
          values?.caracteristicas?.characteristics?.typeOfParkingCoverage
        ),

        // TERRENO
        hasReforestation: Boolean(
          values?.caracteristicas?.characteristics?.hasReforestation
        ),

        // INDUSTRIAL
        hasWarehouses: Boolean(
          values?.caracteristicas?.characteristics?.hasWarehouses
        ),
        hasLocationCentral: Boolean(
          values?.caracteristicas?.characteristics?.hasLocationCentral
        ),

        // LOCAL COMERCIAL
        hasWheelchairRamp: Boolean(
          values?.caracteristicas?.characteristics?.hasWheelchairRamp
        ),
        hasFittingRoom: Boolean(
          values?.caracteristicas?.characteristics?.hasFittingRoom
        ),

        // AGRICOLA
        hectares: Number(values?.caracteristicas?.characteristics?.hectares),
        hasDrinkingFountains: toBool(
          values?.caracteristicas?.characteristics?.hasDrinkingFountains
        ),
        hasWaterTank: toBool(
          values?.caracteristicas?.characteristics?.hasWaterTank
        ),
        hasBarn: toBool(values?.caracteristicas?.characteristics?.hasBarn),
        hasMills: toBool(values?.caracteristicas?.characteristics?.hasMills),
        hasCorral: toBool(values?.caracteristicas?.characteristics?.hasCorral),
        hasSilos: toBool(values?.caracteristicas?.characteristics?.hasSilos),

        typeOfFarm: toStr(values?.caracteristicas?.characteristics?.typeOfFarm),
        coveredHullAread: toNum(
          values?.caracteristicas?.characteristics?.coveredHullAread
        ),
        coveredHullAreadUnit: toStr(
          values?.caracteristicas?.characteristics?.coveredHullAreadUnit
        ),
      },
    }

    const step3 = {
      countryId: toNum(values?.addressInformation?.countryId),
      stateId: toNum(values?.addressInformation?.stateId),
      cityId: toNum(values?.addressInformation?.cityId),
      letter: toStr(values?.addressInformation?.letter),
      number: toStr(values?.addressInformation?.number),
      references: toStr(values?.addressInformation?.references),
      address: toStr(values?.addressInformation?.address),
      addressPublic: toStr(values?.addressInformation?.addressPublic),
      lat: toStr(values?.addressInformation?.lat),
      lng: toStr(values?.addressInformation?.lng),
    }

    const step4 = {
      isExchanged: false, // toBool(values?.financialInformation?.isExchanged)
      timeInExchange: {
        start: null, // toISOOrNull(values?.financialInformation?.timeInExchange?.start)
        end: null, // toISOOrNull(values?.financialInformation?.timeInExchange?.end)
      },
      propertyDescriptionInExchange: '',
      // propertyDescriptionInExchange:
      // values?.caracteristicas?.characteristics?.propertyDescription ??
      // toStrOrNull(
      //   values?.financialInformation?.propertyDescriptionInExchange
      // ),
    }

    const step5 = {
      portals: [PORTAL_TAG],
    }

    return stripNulls({ step1, step2, step3, step4, step5 })
  }

  // ================== portal seguro ==================
  const publishToPortal = async (
    localId: string | number,
    action: 'create' | 'update'
  ) => {
    try {
      // 1) traer la propiedad de Pulso
      const spcRes = await ApiService.fetchData<any, any>({
        url: `properties/${localId}`,
        method: 'get',
      })

      const spc = {
        ...spcRes?.data,
        user: {
          ...spcRes?.data?.user,
          phone: `${user?.dialCode?.dialCode + user?.phone}`,
        },
      }

      if (!spc) {
        openNotification(
          'danger',
          'Portal',
          'No se pudo leer la propiedad para publicar en el Portal',
          4
        )
        return
      }

      if (action === 'create') {
        const base = mapSpcToPortalCreate(spc)
        const payload = {
          ...base,
          portal: 'pulsoPropiedades' as const,
          owner_id: String(user?.id),
        }
        await secureCreate(payload)
        openNotification(
          'success',
          'Portal',
          `Publicación creada (code: ${payload.code})`,
          3
        )
        return
      }

      // action === 'update'
      const code = String(localId)

      // token para el find
      const pdpToken = await ensureToken()

      const found = await findPortalByCode({
        code,
        page: 1,
        page_size: 50,
        pdpToken,
      }).unwrap()

      const items: any[] = Array.isArray(found)
        ? found
        : found?.items ?? found?.data ?? []

      if (items.length > 0) {
        const body = {
          ...mapSpcToPortalUpdate(spc),
          portal: 'pulsoPropiedades' as const,
          owner_id: String(user?.id),
        }

        const results = await Promise.allSettled(
          items
            .filter((i) => typeof i.uuid === 'string' && i.uuid.length > 0)
            .map((i) => secureUpdate(i.uuid, body))
        )
        const ok = results.filter((r) => r.status === 'fulfilled').length

        openNotification(
          'success',
          'Portal',
          `Actualizadas ${ok}/${items.length} publicaciones`,
          3
        )
        setTimeout(() => {
          window.location.reload()
        }, 2500)
      } else {
        // si no había publicaciones, creamos una nueva
        const base = mapSpcToPortalCreate(spc)
        const payload = {
          ...base,
          portal: 'pulsoPropiedades' as const,
          owner_id: String(user?.id),
        }
        await secureCreate(payload)
        openNotification(
          'success',
          'Portal',
          `No había publicaciones. Se creó una nueva (code: ${payload.code})`,
          4
        )
        setTimeout(() => {
          window.location.reload()
        }, 2500)
      }
    } catch (err: any) {
      const text =
        err?.data?.detail && Array.isArray(err.data.detail)
          ? err.data.detail
              .map((d: any) => d?.msg || JSON.stringify(d))
              .join(' • ')
          : (err?.data && JSON.stringify(err.data)) ||
            err?.message ||
            'Error desconocido en el Portal'
      openNotification('danger', 'Portal', text, 5)
    }
  }

  // estados UI
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busyToggle, setBusyToggle] = useState(false)
  const lastValuesRef = useRef<any>(null)

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Publicar Propiedad</h3>
      </div>

      <Formik
        enableReinitialize
        initialValues={{
          ...data,
          portalsInformation: {
            portals: [PORTAL_TAG],
          },
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            setSubmitting(true)
            const payload = buildPayload(values)

            if (hasPropertyId) {
              // UPDATE Pulso
              await updateProperty({ id, ...payload }).unwrap()
              openNotification(
                'success',
                'Propiedad Actualizada',
                'Propiedad actualizada correctamente',
                3
              )

              // portal seguro
              await publishToPortal(id!, 'update')

              dispatch(resetFormState())
              onSuccess?.({ id, action: 'update' })
            } else {
              // CREATE Pulso
              const created = await createProperty(payload as any).unwrap()
              openNotification(
                'success',
                'Propiedad Creada',
                'Propiedad creada exitosamente',
                3
              )

              const newId = created?.id
              if (newId != null) {
                // actualizar externalLink en Pulso
                const fastLink = computeExternalLink(newId)
                try {
                  await updateProperty({
                    id: newId,
                    step2: { externalLink: fastLink },
                  } as any).unwrap()
                } catch {
                  openNotification(
                    'warning',
                    'Aviso',
                    'Se creó la propiedad, pero no se pudo actualizar el enlace externo.',
                    4
                  )
                }

                // portal seguro create
                await publishToPortal(newId, 'create')
              }

              dispatch(resetFormState())
              onSuccess?.({ id: created?.id, action: 'create' })
            }
          } catch (err: any) {
            openNotification(
              'danger',
              'Error',
              `${err?.message || 'Ha ocurrido un error'}`,
              3
            )
            onError?.(err)
          } finally {
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting, values }) => {
          lastValuesRef.current = values

          const disabled = isSubmitting || isSubmittingAny || busyToggle

          return (
            <Form>
              <FormContainer>
                <FormItem label="Publicar también en Portal de Portales">
                  <Field name="portalsInformation.portals">
                    {({ field }: FieldProps<any>) => {
                      if (
                        !Array.isArray(field.value) ||
                        field.value.length === 0 ||
                        field.value[0]?.id !== 'pulsoPropiedades'
                      ) {
                        const next = [PORTAL_TAG]
                        setTimeout(() => {
                          field.form.setFieldValue(field.name, next, false)
                          dispatch(
                            setFormData({
                              portalsInformation: { portals: next },
                            })
                          )
                        }, 0)
                      }

                      return (
                        <Segment
                          selectionType="single"
                          value="pulsoPropiedades"
                          onChange={() => {}}
                        >
                          <div className="grid grid-cols-1 gap-3 w-full">
                            <Segment.Item value="pulsoPropiedades">
                              {() => (
                                <SegmentItemOption
                                  active
                                  disabled
                                  hoverable={false}
                                  className="relative min-h-[72px] w-full cursor-not-allowed opacity-100"
                                  customCheck={
                                    <HiCheckCircle className="text-sky-600 absolute top-2 right-2 text-lg" />
                                  }
                                  defaultGutter={false}
                                  onSegmentItemClick={() => {}}
                                >
                                  <div className="flex items-center gap-3 p-2 w-full">
                                    <div className="h-18 w-28 rounded-md bg-transparent flex items-center justify-center shrink-0">
                                      <img
                                        src="/img/portals/logo-portal-de-portales.svg"
                                        alt="Logo Portal de Portales"
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <h6 className="font-semibold">
                                        Portal de Portales
                                      </h6>
                                      <p className="text-xs text-slate-500">
                                        Siempre activo para sincronizar con
                                        Portal de Portales (Pulso Propiedades)
                                      </p>
                                    </div>
                                  </div>
                                </SegmentItemOption>
                              )}
                            </Segment.Item>
                          </div>
                        </Segment>
                      )
                    }}
                  </Field>
                </FormItem>

                <div className="mt-8 max-w-[350px] mx-auto">
                  <Button
                    block
                    loading={disabled}
                    variant="solid"
                    type="submit"
                    disabled={disabled}
                  >
                    Publicar (Pulso Propiedades + Portal de Portales)
                  </Button>
                </div>
              </FormContainer>

              <Dialog
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onRequestClose={() => setConfirmOpen(false)}
              >
                <h5 className="mb-3">Remover de Portal de Portales</h5>
                <p className="text-sm text-slate-600">
                  (Control deshabilitado - no se puede desmarcar desde aquí)
                </p>
                <div className="text-right mt-6">
                  <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={() => setConfirmOpen(false)}
                  >
                    Cerrar
                  </Button>
                  <Button disabled variant="solid" color="red-500">
                    Acción deshabilitada
                  </Button>
                </div>
              </Dialog>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default CreacionPropiedad
