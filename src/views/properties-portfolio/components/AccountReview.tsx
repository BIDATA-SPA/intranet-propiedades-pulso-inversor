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

const PORTAL_TAG = { id: 'pulsoPropiedades', name: 'pulsoPropiedades' }

const AccountReview = ({ data, onSuccess, onError }: AccountReviewProps) => {
  const { propertyId: routePropertyId } = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useAppDispatch()
  const { data: user } = useGetMyInfoQuery()

  const queryPropertyId = searchParams.get('propertyId')
  const id = routePropertyId ?? queryPropertyId ?? null
  const hasPropertyId = Boolean(id)

  // PDP
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
      customerId: toNum(values?.personalInformation?.customerId),
      typeOfOperationId: toStr(values?.personalInformation?.typeOfOperationId),
      timeAvailable: {
        start: toISOOrNull(values?.personalInformation?.timeAvailable?.start),
        end: toISOOrNull(values?.personalInformation?.timeAvailable?.end),
      },
      typeOfPropertyId: toStr(values?.personalInformation?.typeOfPropertyId),
      currencyId: toStr(values?.personalInformation?.currencyId),
      propertyPrice: toNum(values?.personalInformation?.propertyPrice),
    }

    const step2 = {
      externalLink: toStr(values?.identification?.externalLink),
      highlighted: toBool(values?.identification?.highlighted),
      propertyStatusId: toNum(values?.identification?.propertyStatusId),
      observations: toStr(values?.identification?.observations),
      disableReason: toStr(values?.identification?.disableReason),

      characteristics: {
        rol: toStr(values?.identification?.characteristics?.rol),

        locatedInCondominium: toBool(
          values?.identification?.characteristics?.locatedInCondominium
        ),

        numberOfVacantFloors: toStr(
          values?.identification?.characteristics?.numberOfVacantFloors
        ),
        numberOfMeetingRooms: toStr(
          values?.identification?.characteristics?.numberOfMeetingRooms
        ),

        hasKitchenet: toBool(
          values?.identification?.characteristics?.hasKitchenet
        ),
        hasHouse: toBool(values?.identification?.characteristics?.hasHouse),

        officeNumber: toStr(
          values?.identification?.characteristics?.officeNumber
        ),
        floorLevelLocation: toStr(
          values?.identification?.characteristics?.floorLevelLocation
        ),

        commonExpenses: toStr(
          values?.identification?.characteristics?.commonExpenses
        ),

        numberOfFloors: toStr(
          values?.identification?.characteristics?.numberOfFloors
        ),

        terraces: toStr(values?.identification?.characteristics?.terraces),
        terraceM2: toStr(values?.identification?.characteristics?.terraceM2),

        bathrooms: toStr(values?.identification?.characteristics?.bathrooms),
        bedrooms: toStr(values?.identification?.characteristics?.bedrooms),

        surfaceUnit: toStr(
          values?.identification?.characteristics?.surfaceUnit
        ),
        typeOfKitchen: toStr(
          values?.identification?.characteristics?.typeOfKitchen
        ),

        hasHeating: toBool(values?.identification?.characteristics?.hasHeating),
        hasSecurity: toBool(
          values?.identification?.characteristics?.hasSecurity
        ),

        typeOfSecurity: Array.isArray(
          values?.identification?.characteristics?.typeOfSecurity
        )
          ? values.identification.characteristics.typeOfSecurity
              .map((x: any) => toStr(x?.value ?? x))
              .filter(Boolean)
          : [],

        isFurnished: toBool(
          values?.identification?.characteristics?.isFurnished
        ),

        hasAirConditioning: toBool(
          values?.identification?.characteristics?.hasAirConditioning
        ),

        hasGarage: toBool(values?.identification?.characteristics?.hasGarage),
        hasParking: toBool(values?.identification?.characteristics?.hasParking),
        hasElevator: toBool(
          values?.identification?.characteristics?.hasElevator
        ),
        hasGym: toBool(values?.identification?.characteristics?.hasGym),
        hasSwimmingPool: toBool(
          values?.identification?.characteristics?.hasSwimmingPool
        ),
        hasBarbecueArea: toBool(
          values?.identification?.characteristics?.hasBarbecueArea
        ),

        propertyTitle: toStr(
          values?.identification?.characteristics?.propertyTitle
        ),
        propertyDescription: toStr(
          values?.identification?.characteristics?.propertyDescription
        ),

        hasKitchen: toBool(values?.identification?.characteristics?.hasKitchen),

        surface: toStr(values?.identification?.characteristics?.surface),
        constructedSurface: toStr(
          values?.identification?.characteristics?.constructedSurface
        ),

        hasServiceRoom: toBool(
          values?.identification?.characteristics?.hasServiceRoom
        ),
        hasLivingRoom: toBool(
          values?.identification?.characteristics?.hasLivingRoom
        ),

        geography: toStr(values?.identification?.characteristics?.geography),
        storageCount: toNum(
          values?.identification?.characteristics?.storageCount
        ),

        ceilingType: toStr(
          values?.identification?.characteristics?.ceilingType
        ),
        flooringType: toStr(
          values?.identification?.characteristics?.flooringType
        ),

        hasHomeOffice: toBool(
          values?.identification?.characteristics?.hasHomeOffice
        ),
        hasDiningRoom: toBool(
          values?.identification?.characteristics?.hasDiningRoom
        ),
        hasYard: toBool(values?.identification?.characteristics?.hasYard),
        hasGuestBathroom: toBool(
          values?.identification?.characteristics?.hasGuestBathroom
        ),
        hasSuite: toBool(values?.identification?.characteristics?.hasSuite),
        hasWalkInCloset: toBool(
          values?.identification?.characteristics?.hasWalkInCloset
        ),
        hasPlayRoom: toBool(
          values?.identification?.characteristics?.hasPlayRoom
        ),
        hasFireplace: toBool(
          values?.identification?.characteristics?.hasFireplace
        ),
        hasPlayground: toBool(
          values?.identification?.characteristics?.hasPlayground
        ),
        hasPaddleCourt: toBool(
          values?.identification?.characteristics?.hasPaddleCourt
        ),
        hasPartyRoom: toBool(
          values?.identification?.characteristics?.hasPartyRoom
        ),
        hasSoccerField: toBool(
          values?.identification?.characteristics?.hasSoccerField
        ),
        hasTennisCourt: toBool(
          values?.identification?.characteristics?.hasTennisCourt
        ),
        hasBasketballCourt: toBool(
          values?.identification?.characteristics?.hasBasketballCourt
        ),

        contactHours: toStr(
          values?.identification?.characteristics?.contactHours
        ),
        yearOfConstruction: toNum(
          values?.identification?.characteristics?.yearOfConstruction
        ),

        hasJacuzzi: toBool(values?.identification?.characteristics?.hasJacuzzi),
        hasHorseStable: toBool(
          values?.identification?.characteristics?.hasHorseStable
        ),
        landShape: toStr(values?.identification?.characteristics?.landShape),
        distanceToAsphalt: toNum(
          values?.identification?.characteristics?.distanceToAsphalt
        ),

        has24hConcierge: toBool(
          values?.identification?.characteristics?.has24hConcierge
        ),
        hasInternetAccess: toBool(
          values?.identification?.characteristics?.hasInternetAccess
        ),
        hasNaturalGas: toBool(
          values?.identification?.characteristics?.hasNaturalGas
        ),
        hasRunningWater: toBool(
          values?.identification?.characteristics?.hasRunningWater
        ),
        hasTelephoneLine: toBool(
          values?.identification?.characteristics?.hasTelephoneLine
        ),
        hasSewerConnection: toBool(
          values?.identification?.characteristics?.hasSewerConnection
        ),
        hasElectricity: toBool(
          values?.identification?.characteristics?.hasElectricity
        ),

        hasMansard: toBool(values?.identification?.characteristics?.hasMansard),
        hasBalcony: toBool(values?.identification?.characteristics?.hasBalcony),
        hasClosets: toBool(values?.identification?.characteristics?.hasClosets),
        hasVisitorParking: toBool(
          values?.identification?.characteristics?.hasVisitorParking
        ),
        hasGreenAreas: toBool(
          values?.identification?.characteristics?.hasGreenAreas
        ),
        hasMultiSportsCourt: toBool(
          values?.identification?.characteristics?.hasMultiSportsCourt
        ),
        hasRefrigerator: toBool(
          values?.identification?.characteristics?.hasRefrigerator
        ),
        hasCinemaArea: toBool(
          values?.identification?.characteristics?.hasCinemaArea
        ),
        hasSauna: toBool(values?.identification?.characteristics?.hasSauna),

        houseType: toStr(values?.identification?.characteristics?.houseType),

        // DEPTOS
        floorNumber: toNum(
          values?.identification?.characteristics?.floorNumber
        ),
        unitNumber: toStr(values?.identification?.characteristics?.unitNumber),
        apartmentType: toStr(
          values?.identification?.characteristics?.apartmentType
        ),
        unitsPerFloor: toNum(
          values?.identification?.characteristics?.unitsPerFloor
        ),
        hasLaundryRoom: toBool(
          values?.identification?.characteristics?.hasLaundryRoom
        ),
        hasMultipurposeRoom: toBool(
          values?.identification?.characteristics?.hasMultipurposeRoom
        ),
        petsAllowed: toBool(
          values?.identification?.characteristics?.petsAllowed
        ),
        isCommercialUseAllowed: toBool(
          values?.identification?.characteristics?.isCommercialUseAllowed
        ),
        condominiumClosed: toBool(
          values?.identification?.characteristics?.condominiumClosed
        ),
        hasConcierge: toBool(
          values?.identification?.characteristics?.hasConcierge
        ),
        hasWasherConnection: toBool(
          values?.identification?.characteristics?.hasWasherConnection
        ),
        hasElectricGenerator: toBool(
          values?.identification?.characteristics?.hasElectricGenerator
        ),
        hasSolarEnergy: toBool(
          values?.identification?.characteristics?.hasSolarEnergy
        ),
        hasCistern: toBool(values?.identification?.characteristics?.hasCistern),
        hasBolier: toBool(values?.identification?.characteristics?.hasBolier),

        // LOCAL COMERCIAL
        buildingName: toStr(
          values?.identification?.characteristics?.buildingName
        ),
        buildingType: toStr(
          values?.identification?.characteristics?.buildingType
        ),
        hasSecondLevel: toBool(
          values?.identification?.characteristics?.hasSecondLevel
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

    const step5 = {
      portals: [PORTAL_TAG],
    }

    return stripNulls({ step1, step2, step3, step5 })
  }

  // ================== portal seguro ==================
  const publishToPortal = async (
    localId: string | number,
    action: 'create' | 'update'
  ) => {
    try {
      // 1) traer la propiedad de Pulso Propiedades
      const spcRes = await ApiService.fetchData<any, any>({
        url: `properties/${localId}`,
        method: 'get',
      })
      const spc = spcRes?.data
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

                <div className="mt-8 max-w-auto mx-auto">
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

export default AccountReview
