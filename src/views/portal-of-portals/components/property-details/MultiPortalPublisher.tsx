/* eslint-disable @typescript-eslint/no-explicit-any */
import { SegmentItemOption } from '@/components/shared'
import { Segment, Spinner } from '@/components/ui'
import {
  useCreatePortalPublicationMutation,
  useFindPortalPublicationsQuery,
} from '@/services/RtkQueryService'
import { mapSpcToPortalCreate } from '@/services/portal/mappers/toPortalPublication'
import {
  PORTAL_OPTIONS,
  type PortalId,
  type PortalPublication,
} from '@/services/portal/portalPublication'
import type { SpcProperty } from '@/services/portal/types'
import useNotification from '@/utils/hooks/useNotification'
import { portalErrorToToast } from '@/views/portal-of-portals/utils/error-utils'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useMemo } from 'react'
import { HiCheckCircle } from 'react-icons/hi'
import * as Yup from 'yup'

type Props = {
  spc: SpcProperty
  code: string
  onPublished?: () => void
  pageSize?: number
}

const publishValidation = Yup.object().shape({
  portals: Yup.array<PortalId>()
    .of(Yup.mixed<PortalId>().oneOf(PORTAL_OPTIONS.map((o) => o.value)))
    .min(1, 'Selecciona al menos un portal'),
})

const pickList = (res: any) =>
  Array.isArray(res) ? res : res?.items ?? res?.data ?? []

const MultiPortalPublisher: React.FC<Props> = ({
  spc,
  code,
  onPublished,
  pageSize = 100,
}) => {
  const { showNotification } = useNotification()

  // Presencia actual por code
  const { data, isFetching, isError, error, refetch } =
    useFindPortalPublicationsQuery(
      { code, page: 1, page_size: pageSize },
      { skip: !code }
    )

  const items: PortalPublication[] = pickList(data)

  // Portales ya publicados (dedupe por portal, basta con saber el id del portal)
  const alreadyPublishedPortals = useMemo(() => {
    const set = new Set<string>()
    for (const it of items) {
      if (it?.uuid && it?.portal) set.add(String(it.portal))
    }
    return Array.from(set) as PortalId[]
  }, [items])

  const [createPortalPublication, { isLoading: publishing }] =
    useCreatePortalPublicationMutation()

  // Render
  if (isFetching) {
    return (
      <div className="text-sm text-slate-600 flex items-center">
        <Spinner size={20} className="mr-2" />
        Cargando presencia en portales…
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-rose-600">
        Error consultando presencia. {String((error as any)?.status ?? '')}
      </p>
    )
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{ portals: alreadyPublishedPortals }}
      validationSchema={publishValidation}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        setSubmitting(true)
        try {
          const base = mapSpcToPortalCreate(spc)

          // Evitar 422 comunes (ej: external_url)
          if (!base.external_url || typeof base.external_url !== 'string') {
            showNotification(
              'warning',
              'Falta URL pública',
              'Debes incluir un "external_url" válido para publicar.'
            )
            setSubmitting(false)
            return
          }

          // Solo crear en los portales NUEVOS (no en los ya publicados)
          const toCreate = values.portals.filter(
            (p) => !alreadyPublishedPortals.includes(p)
          )

          if (toCreate.length === 0) {
            showNotification(
              'info',
              'Sin cambios',
              'Ya se encuentra publicada en todos los portales seleccionados.'
            )
            setSubmitting(false)
            return
          }

          const results = await Promise.allSettled(
            toCreate.map(async (portal) => {
              const payload = { ...base, portal }
              // eslint-disable-next-line no-console

              const created = await createPortalPublication(payload).unwrap()
              return { portal, created }
            })
          )

          const ok = results.filter((r) => r.status === 'fulfilled') as Array<
            PromiseFulfilledResult<{ portal: PortalId }>
          >
          const fail = results.filter(
            (r) => r.status === 'rejected'
          ) as Array<PromiseRejectedResult>

          if (ok.length) {
            const portalsOk = ok.map((o) => o.value.portal).join(', ')
            showNotification(
              'success',
              'Publicación creada',
              `Se publicaron ${ok.length}/${toCreate.length}: ${portalsOk}`
            )
          }

          if (fail.length) {
            fail.forEach((f) => {
              const t = portalErrorToToast((f as any).reason ?? f)
              showNotification(t.type, t.title, t.text)
            })
          }

          // Si hubo al menos 1 éxito, refrescamos y reseteamos
          if (ok.length) {
            await refetch()
            await onPublished?.()
            resetForm({
              values: { portals: [...alreadyPublishedPortals, ...toCreate] },
            })
          }
        } catch (err) {
          const t = portalErrorToToast(err)
          showNotification(t.type, t.title, t.text)
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ values, errors, touched, isSubmitting, setFieldValue }) => (
        <Form>
          <div className="mb-2">
            <label className="block text-xs text-slate-500 mb-1">
              Portales
            </label>

            <Field name="portals">
              {({ field, form }: FieldProps<{ portals: PortalId[] }>) => (
                <Segment
                  className="w-full"
                  selectionType="multiple"
                  value={values.portals}
                  onChange={(val) => form.setFieldValue(field.name, val)}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                    {PORTAL_OPTIONS.map((opt) => {
                      const isAlready = alreadyPublishedPortals.includes(
                        opt.value
                      )
                      return (
                        <Segment.Item key={opt.value} value={opt.value}>
                          {({ active, onSegmentItemClick, disabled }) => (
                            <SegmentItemOption
                              hoverable
                              active={active}
                              disabled={disabled || isAlready}
                              defaultGutter={false}
                              className="relative min-h-[92px] w-full"
                              customCheck={
                                <HiCheckCircle className="text-sky-600 absolute top-2 right-2 text-lg" />
                              }
                              onSegmentItemClick={() => {
                                if (isAlready) return
                                onSegmentItemClick()
                              }}
                            >
                              <div className="flex items-center gap-3 p-2 w-full">
                                <img
                                  src={
                                    (opt as any).logo || (opt as any).logoSrc
                                  }
                                  alt={opt.label}
                                  className="h-10 w-10 object-contain shrink-0"
                                />
                                <div className="flex-1">
                                  <h6 className="font-semibold">{opt.label}</h6>
                                  {isAlready && (
                                    <span className="text-xs text-emerald-600">
                                      Publicado
                                    </span>
                                  )}
                                </div>
                              </div>
                            </SegmentItemOption>
                          )}
                        </Segment.Item>
                      )
                    })}
                  </div>
                </Segment>
              )}
            </Field>

            {Boolean(errors.portals && touched.portals) && (
              <p className="mt-1 text-xs text-rose-600">
                {errors.portals as string}
              </p>
            )}
          </div>

          {/* <div className="flex items-center justify-end">
            <Button
              type="submit"
              variant="solid"
              disabled={isSubmitting || publishing}
              loading={isSubmitting || publishing}
            >
              {isSubmitting || publishing
                ? 'Publicando…'
                : 'Publicar en selección'}
            </Button>
          </div> */}
        </Form>
      )}
    </Formik>
  )
}

export default MultiPortalPublisher
