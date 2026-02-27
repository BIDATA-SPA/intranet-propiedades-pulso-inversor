/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import openNotification from '@/utils/openNotification'
import {
  stripNulls,
  toBool,
  toISOOrNull,
  toNum,
  toStr,
  toStrOrNull,
} from '@/utils/parsing-types'
import { Field, Form, Formik } from 'formik'
import { useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

import {
  useCreatePropertyMutation,
  useGetMyInfoQuery,
  useUpdatePropertyMutation,
} from '@/services/RtkQueryService'

import { injectReducer } from '@/store'
import reducer, { resetFormState, useAppDispatch } from '../store'

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
  useGetMyInfoQuery()

  const queryPropertyId = searchParams.get('propertyId')
  const id = routePropertyId ?? queryPropertyId ?? null
  const hasPropertyId = Boolean(id)

  // ✅ Pulso Propiedades
  const [createProperty, { isLoading: isLoadingCreate }] =
    useCreatePropertyMutation()
  const [updateProperty, { isLoading: isLoadingUpdate }] =
    useUpdatePropertyMutation()

  const isSubmittingAny = isLoadingCreate || isLoadingUpdate

  const [busyToggle] = useState(false)
  const lastValuesRef = useRef<any>(null)

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
        hasCowork: toBool(values?.caracteristicas?.characteristics?.hasCowork),
        hasClosedCondominium: toBool(
          values?.caracteristicas?.characteristics?.hasClosedCondominium
        ),
        hasWashingMachineConnection: toBool(
          values?.caracteristicas?.characteristics?.hasWashingMachineConnection
        ),
        depth: Number(values?.caracteristicas?.characteristics?.depth),
        depthUnit: values?.caracteristicas?.characteristics?.depthUnit,
        cementeryName: values?.caracteristicas?.characteristics?.cementeryName,
        width: Number(values?.caracteristicas?.characteristics?.width),
        typeOfCemeteryPlot:
          values?.caracteristicas?.characteristics?.typeOfCemeteryPlot,
        long: Number(values?.caracteristicas?.characteristics?.width),
        widthUnit: values?.caracteristicas?.characteristics?.widthUnit,
        longUnit: values?.caracteristicas?.characteristics?.longUnit,
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
      isExchanged: false,
      timeInExchange: {
        start: null,
        end: null,
      },
      propertyDescriptionInExchange: '',
    }

    const step5 = {
      portals: [PORTAL_TAG],
    }

    return stripNulls({ step1, step2, step3, step4, step5 })
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Publicar Propiedad</h3>
      </div>

      <Formik
        enableReinitialize
        initialValues={{
          ...data,
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

              dispatch(resetFormState())
              onSuccess?.({ id, action: 'update' })

              window.setTimeout(() => window.location.reload(), 350)
              return
            }

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
            }

            dispatch(resetFormState())
            onSuccess?.({ id: created?.id, action: 'create' })

            window.setTimeout(() => window.location.reload(), 350)
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
                <div className="mt-8 max-w-[350px] mx-auto">
                  <Button
                    block
                    loading={disabled}
                    variant="solid"
                    type="submit"
                    disabled={disabled}
                  >
                    {hasPropertyId
                      ? 'Actualizar Propiedad'
                      : 'Publicar Propiedad'}
                  </Button>
                </div>

                <Field name="__noop" type="hidden" />
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default CreacionPropiedad
