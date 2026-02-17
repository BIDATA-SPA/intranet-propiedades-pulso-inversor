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
  `https://procanje.com/propiedades/${id}`

const PORTAL_TAG = { id: 'procanje', name: 'Procanje' }

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

  // ProCanje
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
      propertyStatusId: null,
      disableReason: null,
      observations: toStrOrNull(values?.caracteristicas?.observations),
      characteristics: {
        numberOfPrivate: toStr(
          values?.caracteristicas?.characteristics?.numberOfPrivate
        ),
        officeNumber: toStr(
          values?.caracteristicas?.characteristics?.officeNumber
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
        locatedInGallery: toBool(
          values?.caracteristicas?.characteristics?.locatedInGallery
        ),
        locatedFacingTheStreet: toBool(
          values?.caracteristicas?.characteristics?.locatedFacingTheStreet
        ),
        floorLevelLocation: toStr(
          values?.caracteristicas?.characteristics?.floorLevelLocation
        ),
        commonExpenses: toStr(
          values?.caracteristicas?.characteristics?.commonExpenses
        ),
        hasHouse: toBool(values?.caracteristicas?.characteristics?.hasHouse),
        surface: toStr(values?.caracteristicas?.characteristics?.surface),
        constructedSurface: toStr(
          values?.caracteristicas?.characteristics?.constructedSurface
        ),
        floors: toStr(values?.caracteristicas?.characteristics?.floors),
        terraces: toStr(values?.caracteristicas?.characteristics?.terraces),
        terraceM2: toStr(values?.caracteristicas?.characteristics?.terraceM2),
        numberOfFloors: toStr(
          values?.caracteristicas?.characteristics?.numberOfFloors
        ),
        bathrooms: toStr(values?.caracteristicas?.characteristics?.bathrooms),
        surfaceUnit: toStrOrNull(
          values?.caracteristicas?.characteristics?.surfaceUnit
        ),
        bedrooms: toStr(values?.caracteristicas?.characteristics?.bedrooms),
        hasKitchen: toBool(
          values?.caracteristicas?.characteristics?.hasKitchen
        ),
        typeOfKitchen: toStrOrNull(
          values?.caracteristicas?.characteristics?.typeOfKitchen
        ),
        hasHeating: toBool(
          values?.caracteristicas?.characteristics?.hasHeating
        ),
        typeOfHeating: toStrOrNull(
          values?.caracteristicas?.characteristics?.typeOfHeating
        ),
        hasAirConditioning: toBool(
          values?.caracteristicas?.characteristics?.hasAirConditioning
        ),
        hasParking: toBool(
          values?.caracteristicas?.characteristics?.hasParking
        ),
        hasGarage: toBool(values?.caracteristicas?.characteristics?.hasGarage),
        numberOfParkingSpaces: toStrOrNull(
          values?.caracteristicas?.characteristics?.numberOfParkingSpaces
        ),
        hasElevator: toBool(
          values?.caracteristicas?.characteristics?.hasElevator
        ),
        hasGym: toBool(values?.caracteristicas?.characteristics?.hasGym),
        hasSwimmingPool: toBool(
          values?.caracteristicas?.characteristics?.hasSwimmingPool
        ),
        hasSecurity: toBool(
          values?.caracteristicas?.characteristics?.hasSecurity
        ),
        typeOfSecurity: Array.isArray(
          values?.caracteristicas?.characteristics?.typeOfSecurity
        )
          ? values.caracteristicas.characteristics.typeOfSecurity
              .map((x: any) => toStr(x.value))
              .filter(Boolean)
          : [],
        locatedInCondominium: toBool(
          values?.caracteristicas?.characteristics?.locatedInCondominium
        ),
        isFurnished: toBool(
          values?.caracteristicas?.characteristics?.isFurnished
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
      },
      externalLink: toStrOrNull(values?.caracteristicas?.externalLink),
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
      isExchanged: toBool(values?.financialInformation?.isExchanged),
      timeInExchange: {
        start: toISOOrNull(values?.financialInformation?.timeInExchange?.start),
        end: toISOOrNull(values?.financialInformation?.timeInExchange?.end),
      },
      propertyDescriptionInExchange:
        values?.caracteristicas?.characteristics?.propertyDescription ??
        toStrOrNull(
          values?.financialInformation?.propertyDescriptionInExchange
        ),
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
      // 1) traer la propiedad de Procanje
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
          portal: 'procanje' as const,
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
          portal: 'procanje' as const,
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
          portal: 'procanje' as const,
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
              // UPDATE ProCanje
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
              // CREATE ProCanje
              const created = await createProperty(payload as any).unwrap()
              openNotification(
                'success',
                'Propiedad Creada',
                'Propiedad creada exitosamente',
                3
              )

              const newId = created?.id
              if (newId != null) {
                // actualizar externalLink en Procanje
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
                        field.value[0]?.id !== 'procanje'
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
                          value="procanje"
                          onChange={() => {}}
                        >
                          <div className="grid grid-cols-1 gap-3 w-full">
                            <Segment.Item value="procanje">
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
                                        Portal de Portales (Procanje)
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
                    Publicar (Procanje + Portal de Portales)
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
