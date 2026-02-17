/* eslint-disable import/no-unresolved */
import SegmentItemOption from '@/components/shared/SegmentItemOption'
import SvgIcon from '@/components/shared/SvgIcon'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Segment from '@/components/ui/Segment'
import useThemeClass from '@/utils/hooks/useThemeClass'
import classNames from 'classnames'
import { Field, FieldProps, Form, Formik } from 'formik'
import { useParams } from 'react-router'
import * as Yup from 'yup'
import reducer, {
  setFormData,
  useAppDispatch,
  useAppSelector,
  type PortalOfPortals as PortalOfPortalsType,
} from '../store'

// SVG Icons
import { Input } from '@/components/ui'
import { injectReducer } from '@/store'
import {
  normalizeListingType,
  normalizeTypeOfProperty,
} from '@/utils/normalize-portal-data'
import { MdOutlineCompareArrows } from 'react-icons/md'
import SVGEmol from '../../../../public/img/portals/svg-emol.svg'
import SVGMercadoLibre from '../../../../public/img/portals/svg-mercado-libre.svg'
import SVGPortalInmobiliario from '../../../../public/img/portals/svg-portal-inmobiliario.svg'
import SVGTocToc from '../../../../public/img/portals/svg-toc-toc.svg'

injectReducer('accountDetailForm', reducer)

type FormModel = PortalOfPortalsType

type CaracteristicasProps = {
  data: PortalOfPortalsType
  onNextChange?: (
    values: FormModel,
    formName: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => void
  onBackChange?: () => void
  currentStepStatus?: string
}

const validationSchema = Yup.object().shape({
  portal: Yup.string().required('Este campo es requerido.'),
  listing_type: Yup.string().required('Este campo es requerido.'),
  property_type: Yup.string().required('Este campo es requerido.'),
  external_url: Yup.string()
    .trim()
    .required('Este campo es requerido.')
    .min(1, 'Debe tener al menos 1 carácter.')
    .max(2083, 'No puede exceder 2083 caracteres.'),
  code: Yup.string().required('Este campo es requerido.'),
  title: Yup.string().required('Este campo es requerido.'),
  published_at: Yup.string().required('Este campo es requerido.'),
  //   scraped_at: Yup.string().required('Este campo es requerido.'),
  price_clp: Yup.number().nullable().typeError('Debe ser un número válido.'),
  price_uf: Yup.number().nullable().typeError('Debe ser un número válido.'),
  currency: Yup.string().required('Este campo es requerido.'),
  area_total: Yup.number()
    .typeError('Debe ser un número válido.')
    .min(0, 'No se aceptan valores negativos.')
    .nullable()
    .notRequired(),
  area_useful: Yup.number()
    .typeError('Debe ser un número válido.')
    .min(0, 'No se aceptan valores negativos.')
    .nullable()
    .notRequired(),
  unit: Yup.string().required('Este campo es requerido.'),
})

const documentTypes: {
  value: string
  label: string
  desc: string
  disabled?: boolean
}[] = [{ value: 'procanje', label: 'Procanje', desc: '' }]

const DocumentTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'portal-inmobiliario':
      return (
        <img
          src={SVGPortalInmobiliario}
          alt="svg-portal-inmobiliario"
          width="45"
          height="45"
        />
      )
    case 'emol':
      return <img src={SVGEmol} alt="svg-emol" width="45" height="45" />
    case 'toc-toc':
      return <img src={SVGTocToc} alt="svg-toc-toc" width="45" height="45" />
    case 'mercado-libre':
      return (
        <img
          src={SVGMercadoLibre}
          alt="svg-mercado-libre"
          width="45"
          height="45"
        />
      )
    default:
      return null
  }
}

const PortalOfPortals = ({
  data = {
    portal: '',
    listing_type: '',
    property_type: '',
    external_url: '',
    code: '',
    title: '',
    published_at: '',
    // scraped_at: '',
    price_clp: null,
    price_uf: null,
    currency: '',
    area_total: null,
    area_useful: null,
    unit: 'mt2',
  },
  onNextChange,
  onBackChange,
  currentStepStatus,
}: CaracteristicasProps) => {
  const dispatch = useAppDispatch()
  const { textTheme } = useThemeClass()
  const params = useParams()

  const formData = useAppSelector(
    (state) => state.accountDetailForm.data.formData
  )

  const onNext = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    onNextChange?.(values, 'caracteristicas', setSubmitting)
  }

  const onBack = () => {
    onBackChange?.()
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Publicar en Portal de Propiedades</h3>
      </div>
      <Formik
        enableReinitialize
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          setTimeout(() => {
            onNext(values, setSubmitting)
          }, 1000)
        }}
      >
        {({ values, touched, errors, isSubmitting }) => {
          return (
            <Form>
              <FormContainer>
                <FormItem
                  label="Selecciona un portal"
                  invalid={errors.portal && touched.portal}
                  errorMessage={errors.portal}
                >
                  <Field name="portal">
                    {({ field, form }: FieldProps) => (
                      <Segment
                        className="flex xl:items-center flex-col xl:flex-row gap-4"
                        value={[field.value]}
                        onChange={(val) =>
                          form.setFieldValue(field.name, val[0])
                        }
                      >
                        <>
                          {documentTypes.map((item) => (
                            <Segment.Item
                              key={item.value}
                              value={item.value}
                              disabled={item.disabled}
                            >
                              {({
                                active,
                                value,
                                onSegmentItemClick,
                                disabled,
                              }) => {
                                return (
                                  <SegmentItemOption
                                    active={active}
                                    disabled={disabled}
                                    className="w-full xl:w-[260px]"
                                    onSegmentItemClick={onSegmentItemClick}
                                  >
                                    <div className="flex items-center">
                                      <SvgIcon
                                        className={classNames(
                                          'text-4xl ltr:mr-3 rtl:ml-3',
                                          active && textTheme
                                        )}
                                      >
                                        <DocumentTypeIcon type={value} />
                                      </SvgIcon>
                                      <h6>{item.label}</h6>
                                    </div>
                                  </SegmentItemOption>
                                )
                              }}
                            </Segment.Item>
                          ))}
                        </>
                      </Segment>
                    )}
                  </Field>
                </FormItem>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem
                      asterisk
                      label="Tipo de anuncio u operación"
                      className="w-full"
                      invalid={errors.listing_type && touched.listing_type}
                      errorMessage={errors.listing_type}
                    >
                      <Field name="listing_type">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Tipo de anuncio u operación..."
                              value={values?.listing_type}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              listing_type: normalizeListingType(
                                formData.informacionPrincipal.typeOfOperationId
                              ),
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar tipo
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem
                      asterisk
                      label="Tipo de Propiedad"
                      className="w-full"
                      invalid={errors.property_type && touched.property_type}
                      errorMessage={errors.property_type}
                    >
                      <Field name="property_type">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Tipo de Propiedad..."
                              value={values?.property_type}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              property_type: normalizeTypeOfProperty(
                                formData.informacionPrincipal.typeOfPropertyId
                              ),
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar tipo
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem
                      asterisk
                      label="Enlace público"
                      className="w-full"
                      invalid={errors.external_url && touched.external_url}
                      errorMessage={errors.external_url}
                    >
                      <Field name="external_url">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Enlace Externo..."
                              value={values?.external_url}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              external_url:
                                formData.caracteristicas.externalLink,
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar enlace
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem asterisk label="Código" className="w-full">
                      <Field name="code">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Codigo de Propiedad..."
                              value={values?.code}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              code: params.propertyId ?? '#', // ⚠️
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar código
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                  <FormItem
                    asterisk
                    label="Titulo de la Propiedad"
                    className="w-full"
                  >
                    <Field name="title">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Input
                            readOnly
                            field={field}
                            size="md"
                            placeholder="Titulo de la Propiedad..."
                            value={values?.title}
                            onChange={(e) =>
                              form.setFieldValue(field.name, e.target.value)
                            }
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                  <Button
                    className="w-full"
                    color="gray-500"
                    variant="solid"
                    icon={<MdOutlineCompareArrows />}
                    onClick={() => {
                      dispatch(
                        setFormData({
                          ...formData,
                          portalOfPortals: {
                            ...formData.portalOfPortals,
                            title:
                              formData.caracteristicas?.characteristics
                                ?.propertyTitle,
                          },
                        })
                      )
                    }}
                  >
                    Sincronizar titulo
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                  <FormItem
                    asterisk
                    label="Fecha de Creación"
                    className="w-full"
                  >
                    <Field name="published_at">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Input
                            readOnly
                            field={field}
                            size="md"
                            placeholder="Fecha de Creación..."
                            value={values?.published_at}
                            onChange={(e) =>
                              form.setFieldValue(field.name, e.target.value)
                            }
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem
                    asterisk
                    label="Fecha de Actualización"
                    className="w-full"
                  >
                    <Field name="scraped_at">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Input
                            readOnly
                            field={field}
                            size="md"
                            placeholder="Fecha de Actualización..."
                            value={values?.scraped_at}
                            onChange={(e) =>
                              form.setFieldValue(field.name, e.target.value)
                            }
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div>

                {/* PRICE */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem
                      asterisk
                      label="Precio CLP"
                      className="w-full"
                      invalid={errors.price_clp && touched.price_clp}
                      errorMessage={errors.price_clp}
                    >
                      <Field name="price_clp">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Precio en CLP..."
                              value={values?.price_clp}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              price_clp: Number(
                                formData.informacionPrincipal.propertyPrice
                              ),
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar precio CLP
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem
                      asterisk
                      label="Precio UF"
                      className="w-full"
                      invalid={errors.price_uf && touched.price_uf}
                      errorMessage={errors.price_uf}
                    >
                      <Field name="price_uf">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Precio UF..."
                              value={values?.price_uf}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              price_uf: 0,
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar precio UF
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem
                      asterisk
                      label="Moneda"
                      className="w-full"
                      invalid={errors.currency && touched.currency}
                      errorMessage={errors.currency}
                    >
                      <Field name="currency">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Moneda..."
                              value={values?.currency}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              currency:
                                formData?.informacionPrincipal?.currencyId,
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar moneda
                    </Button>
                  </div>
                </div>

                {/* AREA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem
                      label="Superficie total"
                      className="w-full"
                      invalid={errors.area_total && touched.area_total}
                      errorMessage={errors.area_total}
                    >
                      <Field name="area_total">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Superficie total..."
                              value={values?.area_total}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              area_total: Number(
                                formData.caracteristicas.characteristics.surface
                              ),
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar Superficie total
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                    <FormItem
                      label="Superficie útil"
                      className="w-full"
                      invalid={errors.area_useful && touched.area_useful}
                      errorMessage={errors.area_useful}
                    >
                      <Field name="area_useful">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              readOnly
                              field={field}
                              size="md"
                              placeholder="Superficie útil..."
                              value={values?.area_useful}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                    <Button
                      className="w-full"
                      color="gray-500"
                      variant="solid"
                      icon={<MdOutlineCompareArrows />}
                      onClick={() => {
                        dispatch(
                          setFormData({
                            ...formData,
                            portalOfPortals: {
                              ...formData.portalOfPortals,
                              area_useful: Number(
                                formData.caracteristicas.characteristics
                                  .constructedSurface
                              ),
                            },
                          })
                        )
                      }}
                    >
                      Sincronizar Superficie útil
                    </Button>
                  </div>
                </div>
                {/* END AREA */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 place-items-center">
                  <FormItem
                    asterisk
                    label="area"
                    className="w-full"
                    invalid={errors.unit && touched.unit}
                    errorMessage={errors.unit}
                  >
                    <Field name="unit">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Input
                            readOnly
                            field={field}
                            size="md"
                            placeholder="Unidad..."
                            value={values?.unit}
                            onChange={(e) =>
                              form.setFieldValue(field.name, e.target.value)
                            }
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                  <Button
                    className="w-full"
                    color="gray-500"
                    variant="solid"
                    icon={<MdOutlineCompareArrows />}
                    onClick={() => {
                      dispatch(
                        setFormData({
                          ...formData,
                          portalOfPortals: {
                            ...formData.portalOfPortals,
                            unit: 'mt2',
                          },
                        })
                      )
                    }}
                  >
                    Sincronizar moneda
                  </Button>
                </div>

                <div className="flex justify-start gap-2">
                  <Button type="button" onClick={onBack}>
                    Volver
                  </Button>
                  <Button loading={isSubmitting} variant="solid" type="submit">
                    {currentStepStatus === 'complete' ? 'Guardar' : 'Siguiente'}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default PortalOfPortals
