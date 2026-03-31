import Button from '@/components/ui/Button'
import DatePicker from '@/components/ui/DatePicker'
import FormItem from '@/components/ui/FormItem'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import Select from '@/components/ui/Select'
import TimeInput from '@/components/ui/TimeInput'
import toast from '@/components/ui/toast'
import {
  useGetAllCustomersQuery,
  useGetAllPropertiesQuery,
  useGetMyInfoQuery,
} from '@/services/RtkQueryService'
import { Field, Form, Formik, type FormikHelpers } from 'formik'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import {
  generateCommercialRentVisitPdf,
  generateRentVisitPdf,
  generateSaleVisitPdf,
} from '../features/visit-order/pdf/generators'
import type { VisitPdfPayload } from '../features/visit-order/pdf/types'

interface VisitFormProps {
  propertyId?: string
}

type VisitOrderTemplateType = 'sale' | 'rent' | 'commercial-rent'

interface VisitFormValues {
  eventType: string
  title: string
  customerId: string
  propertyId: string
  customerRut: string
  customerEmail: string
  customerPhone: string
  customerAddress: string
  propertyAddress: string
  price: string
  currency: string
  startDate: Date | null
  startTime: string
  endDate: Date | null
  endTime: string
  observations: string
}

type SelectOption = {
  value: string | number | null
  label: string
}

const COMMERCIAL_PROPERTY_KEYWORDS = [
  'LOCAL',
  'OFICINA',
  'BODEGA',
  'GALPON',
  'CONSULTA',
  'CONSULTORIO',
  'COMERCIAL',
  'INDUSTRIAL',
]

const validationSchema = Yup.object({
  eventType: Yup.string(),
  title: Yup.string().trim().required('El título del evento es obligatorio'),
  customerId: Yup.string().trim().required('Debes seleccionar un cliente'),
  propertyId: Yup.string(),
  customerRut: Yup.string(),
  customerEmail: Yup.string().email('Email inválido'),
  customerPhone: Yup.string(),
  customerAddress: Yup.string(),
  price: Yup.string(),
  currency: Yup.string(),
  startDate: Yup.date().nullable(),
  startTime: Yup.string(),
  endDate: Yup.date().nullable(),
  endTime: Yup.string(),
  observations: Yup.string(),
})

const normalizeValue = (value?: string | number | null) => {
  return String(value ?? '')
    .trim()
    .toUpperCase()
}

const formatDate = (date: Date | null) => {
  if (!date) return ''
  return date.toLocaleDateString('es-CL')
}

const parseNumeric = (value: string): number | null => {
  if (!value) return null

  const cleaned = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
  const num = Number(cleaned)

  return Number.isNaN(num) ? null : num
}

const formatPriceForPdf = (
  value: string | number | null | undefined,
  currency?: string
) => {
  if (value === null || value === undefined || value === '') return ''

  let num: number | null

  if (typeof value === 'string') {
    num = parseNumeric(value)
  } else {
    num = value
  }

  if (num === null || Number.isNaN(num)) return String(value)

  if (currency === 'CLP') {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(num)
  }

  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: currency === 'UF' ? 2 : 0,
  }).format(num)
}

const formatRutInput = (raw: string): string => {
  const clean = raw.replace(/[^0-9kK]/g, '').toUpperCase()
  if (!clean) return ''

  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)

  let bodyWithDots = ''
  let counter = 0

  for (let i = body.length - 1; i >= 0; i--) {
    bodyWithDots = body[i] + bodyWithDots
    counter++

    if (counter === 3 && i !== 0) {
      bodyWithDots = `.${bodyWithDots}`
      counter = 0
    }
  }

  return `${bodyWithDots}-${dv}`
}

const getCurrencyPrefix = (code: string): string => {
  switch (code) {
    case 'CLP':
      return '$'
    case 'USD':
      return 'USD '
    case 'UF':
      return 'UF '
    default:
      return ''
  }
}

const formatPriceInput = (inputValue: string, currencyCode: string): string => {
  const prefix = getCurrencyPrefix(currencyCode)
  const rawValue = inputValue.replace(prefix, '').replace(/[^\d]/g, '')

  if (rawValue === '') return ''

  const numberValue = parseInt(rawValue, 10)

  if (Number.isNaN(numberValue)) return prefix

  const formattedNumber = numberValue.toLocaleString('es-CL', {
    maximumFractionDigits: 0,
  })

  return `${prefix}${formattedNumber}`
}

const normalizeCollection = <T,>(result: any): T[] => {
  if (!result) return []
  if (Array.isArray(result)) return result

  if (
    typeof result === 'object' &&
    'data' in result &&
    Array.isArray(result.data)
  ) {
    return result.data as T[]
  }

  return []
}

const getOrderVisitAddress = (property: any): string => {
  if (!property?.address) return ''

  const addressPublic =
    typeof property.address.addressPublic === 'string'
      ? property.address.addressPublic.trim()
      : ''

  const city =
    typeof property.address.city?.name === 'string'
      ? property.address.city.name.trim()
      : ''

  const state =
    typeof property.address.state?.name === 'string'
      ? property.address.state.name.trim()
      : ''

  const fallbackAddress =
    typeof property.address.address === 'string'
      ? property.address.address.trim()
      : ''

  return [addressPublic || fallbackAddress, city, state]
    .filter(Boolean)
    .join(', ')
}

const getCustomerAddress = (customer: any): string => {
  if (!customer) return ''

  if (typeof customer.address === 'string') {
    return customer.address.trim()
  }

  const addressPublic =
    typeof customer?.address?.addressPublic === 'string'
      ? customer.address.addressPublic.trim()
      : ''

  const street =
    typeof customer?.address?.address === 'string'
      ? customer.address.address.trim()
      : ''

  const city =
    typeof customer?.address?.city?.name === 'string'
      ? customer.address.city.name.trim()
      : ''

  const state =
    typeof customer?.address?.state?.name === 'string'
      ? customer.address.state.name.trim()
      : ''

  return [addressPublic || street, city, state].filter(Boolean).join(', ')
}

const getPropertyRelatedPerson = (property: any) => {
  return (
    property?.customer ||
    property?.client ||
    property?.owner ||
    property?.contact ||
    property?.lead ||
    property?.user ||
    null
  )
}

const getPropertyRelatedPersonName = (property: any): string => {
  const person = getPropertyRelatedPerson(property)
  if (!person) return ''

  if (typeof person.fullName === 'string') return person.fullName.trim()

  return [person.name, person.lastName].filter(Boolean).join(' ').trim()
}

const getPropertyRelatedPersonRut = (property: any): string => {
  const person = getPropertyRelatedPerson(property)
  return typeof person?.rut === 'string' ? formatRutInput(person.rut) : ''
}

const getPropertyRelatedPersonEmail = (property: any): string => {
  const person = getPropertyRelatedPerson(property)
  return typeof person?.email === 'string' ? person.email.trim() : ''
}

const getPropertyRelatedPersonPhone = (property: any): string => {
  const person = getPropertyRelatedPerson(property)

  const dialCode =
    typeof person?.dialCode?.dialCode === 'string'
      ? person.dialCode.dialCode.trim()
      : ''

  const phone = typeof person?.phone === 'string' ? person.phone.trim() : ''

  return [dialCode, phone].filter(Boolean).join(' ').trim()
}

const getPropertyRelatedPersonAddress = (property: any): string => {
  const person = getPropertyRelatedPerson(property)
  if (!person) return ''

  if (typeof person.address === 'string') {
    return person.address.trim()
  }

  const addressPublic =
    typeof person?.address?.addressPublic === 'string'
      ? person.address.addressPublic.trim()
      : ''

  const street =
    typeof person?.address?.address === 'string'
      ? person.address.address.trim()
      : ''

  const city =
    typeof person?.address?.city?.name === 'string'
      ? person.address.city.name.trim()
      : ''

  const state =
    typeof person?.address?.state?.name === 'string'
      ? person.address.state.name.trim()
      : ''

  return [addressPublic || street, city, state].filter(Boolean).join(', ')
}

const getBrokerPhone = (broker: any): string => {
  const dialCode =
    typeof broker?.dialCode?.dialCode === 'string'
      ? broker.dialCode.dialCode.trim()
      : ''

  const phone = typeof broker?.phone === 'string' ? broker.phone.trim() : ''

  return [dialCode, phone].filter(Boolean).join(' ').trim()
}

const getPropertyPrice = (property: any): string => {
  if (!property) return ''
  if (property.propertyPrice != null) return String(property.propertyPrice)
  if (property.price != null) return String(property.price)
  if (property.priceAmount != null) return String(property.priceAmount)
  return ''
}

const getPropertyOperationName = (property: any): string => {
  if (!property) return ''

  if (typeof property.typeOfOperation?.name === 'string') {
    return property.typeOfOperation.name.trim()
  }

  if (typeof property.operationType?.name === 'string') {
    return property.operationType.name.trim()
  }

  if (typeof property.typeOfOperationId === 'string') {
    return property.typeOfOperationId.trim()
  }

  if (typeof property.operationTypeName === 'string') {
    return property.operationTypeName.trim()
  }

  return ''
}

const getPropertyTypeName = (property: any): string => {
  if (!property) return ''

  if (typeof property.typeOfProperty?.name === 'string') {
    return property.typeOfProperty.name.trim()
  }

  if (typeof property.propertyType?.name === 'string') {
    return property.propertyType.name.trim()
  }

  if (typeof property.typeOfPropertyId === 'string') {
    return property.typeOfPropertyId.trim()
  }

  if (typeof property.propertyTypeName === 'string') {
    return property.propertyTypeName.trim()
  }

  return ''
}

const getPropertyImageUrls = (property: any): string[] => {
  if (!Array.isArray(property?.images)) return []

  return property.images
    .map((image: any) => {
      if (typeof image === 'string') return image
      if (typeof image?.path === 'string') return image.path
      if (typeof image?.url === 'string') return image.url
      if (typeof image?.imageUrl === 'string') return image.imageUrl
      if (typeof image?.src === 'string') return image.src
      return ''
    })
    .filter(Boolean)
    .slice(0, 3)
}

const resolveVisitOrderTemplate = ({
  operationTypeName,
  propertyTypeName,
}: {
  operationTypeName?: string
  propertyTypeName?: string
}): VisitOrderTemplateType => {
  const normalizedOperation = normalizeValue(operationTypeName)
  const normalizedPropertyType = normalizeValue(propertyTypeName)

  const isSale =
    normalizedOperation.includes('VENTA') ||
    normalizedOperation.includes('COMPRAVENTA')

  const isRent = normalizedOperation.includes('ARRIENDO')

  const isCommercialProperty = COMMERCIAL_PROPERTY_KEYWORDS.some((keyword) =>
    normalizedPropertyType.includes(keyword)
  )

  if (isSale) return 'sale'
  if (isRent && isCommercialProperty) return 'commercial-rent'
  return 'rent'
}

const getVisitOrderTemplateLabel = (template: VisitOrderTemplateType) => {
  switch (template) {
    case 'sale':
      return 'Orden de visita · Compraventa'
    case 'commercial-rent':
      return 'Orden de visita · Arriendo comercial'
    case 'rent':
    default:
      return 'Orden de visita · Arriendo'
  }
}

const VisitForm = ({ propertyId }: VisitFormProps) => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: customersData } = useGetAllCustomersQuery({
    page: 1,
    limit: 1000,
    search: '',
  })

  const { data: propertiesData } = useGetAllPropertiesQuery({
    page: 1,
    limit: 1000,
    search: '',
  })

  const { data: myInfo } = useGetMyInfoQuery(
    {},
    { refetchOnMountOrArgChange: true }
  )

  const customers = useMemo(
    () => normalizeCollection<any>(customersData),
    [customersData]
  )

  const properties = useMemo(
    () => normalizeCollection<any>(propertiesData),
    [propertiesData]
  )

  const customerOptions: SelectOption[] = useMemo(
    () =>
      customers.map((customer: any) => ({
        value: customer.id,
        label: `${customer.name} ${customer.lastName || ''}`.trim(),
      })),
    [customers]
  )

  const propertyOptions: SelectOption[] = useMemo(
    () =>
      properties.map((property: any) => ({
        value: property.id,
        label: `${property.id} · ${getPropertyOperationName(
          property
        )} de ${getPropertyTypeName(property)}`,
      })),
    [properties]
  )

  const currencyOptions: SelectOption[] = useMemo(
    () => [
      { value: 'CLP', label: 'CLP - Peso Chileno' },
      { value: 'USD', label: 'USD - Dólar' },
      { value: 'UF', label: 'UF - Unidad de Fomento' },
    ],
    []
  )

  const eventTypeOptions: SelectOption[] = useMemo(
    () => [
      { value: 'visit order', label: 'Orden de Visita' },
      { value: 'event', label: 'Evento' },
    ],
    []
  )

  const selectedProperty = useMemo(
    () => properties.find((p: any) => String(p.id) === String(propertyId)),
    [properties, propertyId]
  )

  const initialValues: VisitFormValues = useMemo(
    () => ({
      eventType: 'visit order',
      title: '',
      customerId: '',
      propertyId: propertyId || '',
      customerRut: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      propertyAddress: getOrderVisitAddress(selectedProperty),
      price: getPropertyPrice(selectedProperty),
      currency: selectedProperty?.currencyId || 'CLP',
      startDate: new Date(),
      startTime: '09:00',
      endDate: new Date(),
      endTime: '09:00',
      observations: '',
    }),
    [propertyId, selectedProperty]
  )

  const handleSubmit = async (
    values: VisitFormValues,
    { setSubmitting }: FormikHelpers<VisitFormValues>
  ) => {
    setIsSubmitting(true)

    try {
      if (values.eventType !== 'visit order') {
        throw new Error(
          'Actualmente este flujo solo permite generar Órdenes de Visita.'
        )
      }

      const rawProperty =
        properties.find(
          (p: any) => String(p.id) === String(values.propertyId)
        ) || selectedProperty

      if (!rawProperty) {
        throw new Error('No se encontró la propiedad seleccionada.')
      }

      const customer =
        customers.find(
          (c: any) => String(c.id) === String(values.customerId)
        ) || null

      const operationTypeName = getPropertyOperationName(rawProperty)
      const propertyTypeName = getPropertyTypeName(rawProperty)

      const template = resolveVisitOrderTemplate({
        operationTypeName,
        propertyTypeName,
      })

      const startDateText = formatDate(values.startDate)
      const endDateText = formatDate(values.endDate)

      const brokerName = [myInfo?.name, myInfo?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim()

      const propertyCustomerName = getPropertyRelatedPersonName(rawProperty)
      const propertyCustomerRut = getPropertyRelatedPersonRut(rawProperty)
      const propertyCustomerEmail = getPropertyRelatedPersonEmail(rawProperty)
      const propertyCustomerPhone = getPropertyRelatedPersonPhone(rawProperty)
      const propertyCustomerAddress =
        getPropertyRelatedPersonAddress(rawProperty)

      const fallbackCustomerName = customer
        ? `${customer.name} ${customer.lastName || ''}`.trim()
        : ''

      const visitPayload: VisitPdfPayload = {
        template,
        title: values.title,

        customerName: propertyCustomerName || fallbackCustomerName || '',
        customerRut: propertyCustomerRut || values.customerRut || '',
        customerEmail: propertyCustomerEmail || values.customerEmail || '',
        customerPhone: propertyCustomerPhone || values.customerPhone || '',
        customerAddress:
          propertyCustomerAddress ||
          values.customerAddress ||
          getCustomerAddress(customer),

        brokerName: brokerName || 'Corredor de Propiedades',
        brokerRut: myInfo?.rut ? formatRutInput(myInfo.rut) : '',
        brokerEmail: myInfo?.session?.email || '',
        brokerPhone: getBrokerPhone(myInfo),

        customerSignatureUrl: customer?.signature || '',
        brokerSignatureUrl: myInfo?.signature || '',

        propertyId: Number(values.propertyId),
        propertyAddress:
          values.propertyAddress || getOrderVisitAddress(rawProperty),
        operationType: operationTypeName,
        propertyType: propertyTypeName,
        price: values.price || getPropertyPrice(rawProperty),
        currency: values.currency || rawProperty?.currencyId || 'CLP',
        externalLink: rawProperty?.externalLink,

        startDateText,
        endDateText,
        startTime: values.startTime,
        endTime: values.endTime,

        observations: values.observations?.trim() || '',
        propertyImages: getPropertyImageUrls(rawProperty),

        topLeftLogoUrl: '/img/logo/logo.pdf.jpeg',
      }

      switch (template) {
        case 'sale':
          await generateSaleVisitPdf(visitPayload)
          break

        case 'commercial-rent':
          await generateCommercialRentVisitPdf(visitPayload)
          break

        case 'rent':
        default:
          await generateRentVisitPdf(visitPayload)
          break
      }

      toast.push(
        <Notification title="Visita creada" type="success">
          Se ha generado la Orden de Visita en PDF.
        </Notification>
      )

      setTimeout(() => {
        navigate('/mis-propiedades')
      }, 1500)
    } catch (error: any) {
      console.error('❌ Error al generar PDF:', error)

      toast.push(
        <Notification title="Error" type="danger">
          {error?.message || 'Error al generar la orden de visita'}
        </Notification>
      )
    } finally {
      setIsSubmitting(false)
      setSubmitting(false)
    }
  }

  const getDetectedTemplate = (property: any): VisitOrderTemplateType => {
    return resolveVisitOrderTemplate({
      operationTypeName: getPropertyOperationName(property),
      propertyTypeName: getPropertyTypeName(property),
    })
  }

  const getPropertyCardPrice = (property: any, currency: string) => {
    return formatPriceForPdf(getPropertyPrice(property), currency)
  }

  const VisitFormComponent = () => (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, values, setFieldValue }) => {
        const currentProperty =
          properties.find(
            (p: any) => String(p.id) === String(values.propertyId || propertyId)
          ) || selectedProperty

        const currentTemplate = currentProperty
          ? getDetectedTemplate(currentProperty)
          : 'rent'

        const selectedEventType = eventTypeOptions.find(
          (opt) => opt.value === values.eventType
        )

        const selectedCurrency = currencyOptions.find(
          (opt) => opt.value === values.currency
        )

        const selectedCustomer =
          customerOptions.find(
            (opt) => String(opt.value) === String(values.customerId || '')
          ) ?? null

        const selectedPropertyOption = propertyOptions.find(
          (opt) => String(opt.value) === String(values.propertyId)
        )

        return (
          <Form className="space-y-6">
            {currentProperty && (
              <div className="mb-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold">
                      ID {currentProperty.id} ·{' '}
                      {getPropertyOperationName(currentProperty)} de{' '}
                      {getPropertyTypeName(currentProperty)}
                    </p>

                    <p className="text-xs text-gray-500">
                      {getOrderVisitAddress(currentProperty)}
                    </p>

                    <div className="inline-flex rounded-full bg-black px-3 py-1 text-[11px] font-semibold text-white">
                      {getVisitOrderTemplateLabel(currentTemplate)}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Precio estimado</p>

                    <p className="font-semibold">
                      {getPropertyCardPrice(currentProperty, values.currency)}{' '}
                      {values.currency}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="mb-1 mt-2 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Datos del evento
                </h4>
                <p className="text-xs text-gray-500">
                  Define el tipo de evento y el título que aparecerá en la orden
                  de visita.
                </p>
              </div>

              <FormItem
                label="Tipo de evento"
                invalid={Boolean(errors.eventType && touched.eventType)}
                errorMessage={errors.eventType}
              >
                <Select
                  placeholder="Seleccionar tipo"
                  options={eventTypeOptions}
                  value={selectedEventType}
                  onChange={(option: any) =>
                    setFieldValue('eventType', option?.value)
                  }
                />
              </FormItem>

              <FormItem
                label="Título del evento"
                invalid={Boolean(errors.title && touched.title)}
                errorMessage={errors.title}
              >
                <Field
                  name="title"
                  component={Input}
                  placeholder="Ej: Visita departamento Ñuñoa"
                />
              </FormItem>

              <div className="mb-1 mt-4 border-t border-dashed border-gray-200 pt-3 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Datos del cliente
                </h4>
                <p className="text-xs text-gray-500">
                  Selecciona el cliente y verifica sus datos antes de generar la
                  orden.
                </p>
              </div>

              <FormItem
                label="Cliente"
                invalid={Boolean(errors.customerId && touched.customerId)}
                errorMessage={errors.customerId as string}
              >
                <Select
                  placeholder="Seleccionar cliente"
                  options={customerOptions}
                  value={selectedCustomer ?? null}
                  onChange={(option: any) => {
                    const nextCustomerId = option?.value
                      ? String(option.value)
                      : ''

                    setFieldValue('customerId', nextCustomerId)

                    if (!nextCustomerId) {
                      setFieldValue('customerRut', '')
                      setFieldValue('customerEmail', '')
                      setFieldValue('customerPhone', '')
                      setFieldValue('customerAddress', '')
                      return
                    }

                    const customer = customers.find(
                      (c: any) => String(c.id) === String(nextCustomerId)
                    )

                    if (!customer) {
                      setFieldValue('customerRut', '')
                      setFieldValue('customerEmail', '')
                      setFieldValue('customerPhone', '')
                      setFieldValue('customerAddress', '')
                      return
                    }

                    setFieldValue(
                      'customerRut',
                      customer.rut ? formatRutInput(customer.rut) : ''
                    )
                    setFieldValue('customerEmail', customer.email || '')
                    setFieldValue('customerPhone', customer.phone || '')
                    setFieldValue(
                      'customerAddress',
                      getCustomerAddress(customer)
                    )
                  }}
                />
              </FormItem>

              <FormItem label="RUT del cliente">
                <Field name="customerRut">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      placeholder="RUT del cliente"
                      onChange={(e) =>
                        setFieldValue(
                          'customerRut',
                          formatRutInput(e.target.value)
                        )
                      }
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                label="Correo electrónico"
                invalid={Boolean(errors.customerEmail && touched.customerEmail)}
                errorMessage={errors.customerEmail}
              >
                <Field name="customerEmail">
                  {({ field, form }: any) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="cliente@email.com"
                      onChange={(e) =>
                        form.setFieldValue('customerEmail', e.target.value)
                      }
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem label="Teléfono">
                <Field name="customerPhone">
                  {({ field, form }: any) => (
                    <Input
                      {...field}
                      placeholder="Ej: +56912345678"
                      onChange={(e) =>
                        form.setFieldValue('customerPhone', e.target.value)
                      }
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem label="Domicilio del cliente" className="md:col-span-2">
                <Field
                  as="textarea"
                  name="customerAddress"
                  className="input min-h-[90px]"
                  rows={3}
                  placeholder="Domicilio del cliente"
                />
              </FormItem>

              <div className="mb-1 mt-4 border-t border-dashed border-gray-200 pt-3 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Datos de la propiedad
                </h4>
                <p className="text-xs text-gray-500">
                  Revisa que la propiedad, dirección y precio sean correctos.
                </p>
              </div>

              <FormItem
                label="Propiedad"
                invalid={Boolean(errors.propertyId && touched.propertyId)}
                errorMessage={errors.propertyId}
              >
                <Select
                  placeholder="Seleccionar propiedad"
                  options={propertyOptions}
                  value={selectedPropertyOption}
                  onChange={(option: any) => {
                    setFieldValue('propertyId', option?.value)

                    const property = properties.find(
                      (p: any) => String(p.id) === String(option?.value)
                    )

                    if (!property) return

                    setFieldValue(
                      'propertyAddress',
                      getOrderVisitAddress(property)
                    )
                    setFieldValue('price', getPropertyPrice(property))
                    setFieldValue('currency', property?.currencyId || 'CLP')

                    const propertyContactName =
                      getPropertyRelatedPersonName(property)
                    const propertyContactRut =
                      getPropertyRelatedPersonRut(property)
                    const propertyContactEmail =
                      getPropertyRelatedPersonEmail(property)
                    const propertyContactPhone =
                      getPropertyRelatedPersonPhone(property)
                    const propertyContactAddress =
                      getPropertyRelatedPersonAddress(property)

                    if (propertyContactName) {
                      const matchedCustomer = customers.find(
                        (customer: any) => {
                          const fullName = [customer.name, customer.lastName]
                            .filter(Boolean)
                            .join(' ')
                            .trim()

                          return fullName === propertyContactName
                        }
                      )

                      if (matchedCustomer?.id) {
                        setFieldValue('customerId', String(matchedCustomer.id))
                      }
                    }

                    setFieldValue('customerRut', propertyContactRut)
                    setFieldValue('customerEmail', propertyContactEmail)
                    setFieldValue('customerPhone', propertyContactPhone)
                    setFieldValue('customerAddress', propertyContactAddress)
                  }}
                />
              </FormItem>

              <FormItem label="Dirección de la propiedad">
                <Field
                  disabled
                  name="propertyAddress"
                  component={Input}
                  placeholder="Dirección"
                />
              </FormItem>

              <FormItem label="Precio">
                <Field name="price">
                  {({ field, form }: any) => (
                    <Input
                      {...field}
                      inputMode="numeric"
                      placeholder="60.000.000"
                      onChange={(e) => {
                        const formatted = formatPriceInput(
                          e.target.value,
                          form.values.currency
                        )

                        form.setFieldValue('price', formatted)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem label="Código moneda">
                <Select
                  placeholder="Seleccionar moneda"
                  options={currencyOptions}
                  value={selectedCurrency}
                  onChange={(option: any) => {
                    const newCurrency = option?.value || 'CLP'
                    setFieldValue('currency', newCurrency)

                    if (values.price) {
                      setFieldValue(
                        'price',
                        formatPriceInput(values.price, newCurrency)
                      )
                    }
                  }}
                />
              </FormItem>

              <div className="mb-1 mt-4 border-t border-dashed border-gray-200 pt-3 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Horario de la visita
                </h4>
                <p className="text-xs text-gray-500">
                  Define la fecha y el rango horario en el que se realizará la
                  visita.
                </p>
              </div>

              <FormItem
                label="Fecha inicial"
                invalid={Boolean(errors.startDate && touched.startDate)}
                errorMessage={errors.startDate as any}
              >
                <DatePicker
                  value={values.startDate}
                  placeholder="Seleccionar fecha"
                  onChange={(date) => setFieldValue('startDate', date)}
                />
              </FormItem>

              <FormItem
                label="Hora de inicio"
                invalid={Boolean(errors.startTime && touched.startTime)}
                errorMessage={errors.startTime}
              >
                <TimeInput
                  value={
                    values.startTime
                      ? new Date(`2000-01-01T${values.startTime}`)
                      : new Date()
                  }
                  format="24"
                  onChange={(time: Date) => {
                    const hours = String(time.getHours()).padStart(2, '0')
                    const minutes = String(time.getMinutes()).padStart(2, '0')

                    setFieldValue('startTime', `${hours}:${minutes}`)
                  }}
                />
              </FormItem>

              <FormItem
                label="Fecha de término"
                invalid={Boolean(errors.endDate && touched.endDate)}
                errorMessage={errors.endDate as any}
              >
                <DatePicker
                  value={values.endDate}
                  placeholder="Seleccionar fecha"
                  onChange={(date) => setFieldValue('endDate', date)}
                />
              </FormItem>

              <FormItem
                label="Hora de término"
                invalid={Boolean(errors.endTime && touched.endTime)}
                errorMessage={errors.endTime}
              >
                <TimeInput
                  value={
                    values.endTime
                      ? new Date(`2000-01-01T${values.endTime}`)
                      : new Date()
                  }
                  format="24"
                  onChange={(time: Date) => {
                    const hours = String(time.getHours()).padStart(2, '0')
                    const minutes = String(time.getMinutes()).padStart(2, '0')

                    setFieldValue('endTime', `${hours}:${minutes}`)
                  }}
                />
              </FormItem>

              <div className="mb-1 mt-4 border-t border-dashed border-gray-200 pt-3 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Observaciones para la O.V
                </h4>
                <p className="text-xs text-gray-500">
                  Texto opcional que aparecerá en el documento PDF. No se usará
                  la descripción comercial de la propiedad.
                </p>
              </div>

              <FormItem label="Observaciones" className="md:col-span-2">
                <Field
                  as="textarea"
                  name="observations"
                  className="input min-h-[120px]"
                  rows={5}
                  placeholder="Pega aquí el texto opcional enviado desde Word para que aparezca en la Orden de Visita."
                />
              </FormItem>
            </div>

            <div className="flex flex-col justify-end gap-3 border-t border-gray-100 pt-4 md:flex-row md:gap-4">
              <Button
                type="button"
                onClick={() => navigate('/mis-propiedades')}
              >
                Regresar
              </Button>

              <Button
                type="submit"
                variant="solid"
                loading={isSubmitting}
                className="bg-lime-500 text-black hover:bg-lime-600"
              >
                Crear Visita
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )

  return <VisitFormComponent />
}

export default VisitForm
