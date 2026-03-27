import { Field, Form, Formik, type FormikHelpers } from 'formik'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'

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

import jsPDF from 'jspdf'

interface VisitFormProps {
  propertyId?: string
}

interface VisitFormValues {
  eventType: string
  title: string
  customerId: string | null
  propertyId: string
  customerRut: string
  customerEmail: string
  customerPhone: string
  propertyAddress: string
  price: string
  currency: string
  startDate: Date | null
  startTime: string
  endDate: Date | null
  endTime: string
  observations: string
}

type VisitPdfPayload = {
  customerName: string
  customerRut: string
  customerEmail: string
  customerPhone: string

  brokerName: string
  brokerRut?: string
  brokerEmail?: string
  brokerPhone?: string

  customerSignatureUrl?: string
  brokerSignatureUrl?: string

  propertyId: number
  propertyAddress: string
  operationType: string
  propertyType: string
  price: string
  currency: string
  externalLink?: string

  startDateText: string
  endDateText: string
  startTime: string
  endTime: string

  observations?: string
  mainImage?: string
}

type SelectOption = {
  value: any
  label: string
}

const validationSchema = Yup.object({
  eventType: Yup.string().required('Tipo de evento es requerido'),
  title: Yup.string().required('Título es requerido'),
  customerId: Yup.string().nullable(),
  propertyId: Yup.string().required('Propiedad es requerida'),
  customerRut: Yup.string(),
  customerEmail: Yup.string().email('Email inválido'),
  customerPhone: Yup.string(),
  price: Yup.string(),
  currency: Yup.string(),
  startDate: Yup.date().required('Fecha inicial es requerida').nullable(),
  startTime: Yup.string().required('Hora de inicio es requerida'),
  endDate: Yup.date().required('Fecha de término es requerida').nullable(),
  endTime: Yup.string().required('Hora de término es requerida'),
  observations: Yup.string(),
})

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

const loadImageAsDataUrl = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject(new Error('No fue posible crear el contexto del canvas'))
        return
      }

      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/jpeg', 0.9))
    }

    img.onerror = (err) => reject(err)
    img.src = url
  })

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

const getBrokerPhone = (broker: any): string => {
  const dialCode =
    typeof broker?.dialCode?.dialCode === 'string'
      ? broker.dialCode.dialCode.trim()
      : ''

  const phone = typeof broker?.phone === 'string' ? broker.phone.trim() : ''

  return [dialCode, phone].filter(Boolean).join(' ').trim()
}

const drawSignatureBlock = async ({
  doc,
  centerX,
  lineY,
  title,
  name,
  rut,
  signatureUrl,
}: {
  doc: jsPDF
  centerX: number
  lineY: number
  title: string
  name: string
  rut?: string
  signatureUrl?: string
}) => {
  const signatureWidth = 120
  const signatureHeight = 42

  if (signatureUrl) {
    try {
      const signatureDataUrl = await loadImageAsDataUrl(signatureUrl)

      doc.addImage(
        signatureDataUrl,
        'JPEG',
        centerX - signatureWidth / 2,
        lineY - 46,
        signatureWidth,
        signatureHeight
      )
    } catch (error) {
      console.error('No fue posible cargar la firma:', error)
    }
  }

  doc.setLineWidth(0.5)
  doc.setDrawColor(0)
  doc.line(centerX - 90, lineY, centerX + 90, lineY)

  doc.setFont('times', 'bold')
  doc.setFontSize(10)
  doc.text(name || title, centerX, lineY + 14, { align: 'center' })

  doc.setFont('times', 'normal')
  doc.setFontSize(8)
  doc.text(`RUT: ${rut || '—'}`, centerX, lineY + 26, { align: 'center' })
}

const generateVisitPdf = async (payload: VisitPdfPayload) => {
  const doc = new jsPDF('p', 'pt', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 40
  let y = 40

  let logoDataUrl: string | null = null

  try {
    logoDataUrl = await loadImageAsDataUrl('/img/logo/logo.pdf.jpeg')
  } catch (err) {
    console.log('No se pudo cargar logo local, seguimos sin logo.', err)
  }

  if (logoDataUrl) {
    const wmWidth = 500
    const wmHeight = 500
    const wmX = (pageWidth - wmWidth) / 2
    const wmY = (pageHeight - wmHeight) / 2

    const anyDoc = doc as any

    if (anyDoc.GState) {
      const gState = anyDoc.GState({ opacity: 0.12, fillOpacity: 0.12 })
      anyDoc.setGState(gState)
      anyDoc.addImage(logoDataUrl, 'PNG', wmX, wmY, wmWidth, wmHeight)

      const reset = anyDoc.GState({ opacity: 1, fillOpacity: 1 })
      anyDoc.setGState(reset)
    } else {
      doc.addImage(logoDataUrl, 'PNG', wmX, wmY, wmWidth, wmHeight)
    }
  }

  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', marginX, y, 120, 40)
  }

  doc.setFont('times', 'normal')
  doc.setFontSize(9)
  doc.text('Pulso Propiedades', pageWidth - marginX, y + 5, {
    align: 'right',
  })
  doc.text('Email: contacto@pulsopropiedades.cl', pageWidth - marginX, y + 18, {
    align: 'right',
  })
  doc.text('Teléfono: +56 9 94355075', pageWidth - marginX, y + 31, {
    align: 'right',
  })

  y += 60

  doc.setFont('times', 'bold')
  doc.setFontSize(14)
  doc.text('ORDEN DE VISITA', pageWidth / 2, y, { align: 'center' })

  doc.setFont('times', 'normal')
  doc.setFontSize(10)
  y += 18

  doc.text(
    `Fecha visita programada ${payload.startDateText} a las ${payload.startTime}`,
    pageWidth / 2,
    y,
    { align: 'center' }
  )

  y += 26

  const sectionTop = y
  const totalInnerWidth = pageWidth - marginX * 2
  const gapBetweenBoxes = 20
  const boxWidth = (totalInnerWidth - gapBetweenBoxes) / 2
  const clientBoxX = marginX
  const propBoxX = marginX + boxWidth + gapBetweenBoxes
  const innerPaddingX = 10
  const innerPaddingY = 10
  const lineHeight = 14

  let clientY = sectionTop + innerPaddingY + 10
  const clientTextXLabel = clientBoxX + innerPaddingX
  const clientTextXValue = clientTextXLabel + 65

  doc.setFont('times', 'bold')
  doc.setFontSize(10)
  doc.text('Señor(a):', clientTextXLabel, clientY)
  doc.setFont('times', 'normal')
  doc.text(payload.customerName || '-', clientTextXValue, clientY)

  clientY += lineHeight
  doc.setFont('times', 'bold')
  doc.text('RUT:', clientTextXLabel, clientY)
  doc.setFont('times', 'normal')
  doc.text(payload.customerRut || '-', clientTextXValue, clientY)

  clientY += lineHeight
  doc.setFont('times', 'bold')
  doc.text('Email:', clientTextXLabel, clientY)
  doc.setFont('times', 'normal')
  doc.text(payload.customerEmail || '-', clientTextXValue, clientY)

  clientY += lineHeight
  doc.setFont('times', 'bold')
  doc.text('Celular:', clientTextXLabel, clientY)
  doc.setFont('times', 'normal')
  doc.text(payload.customerPhone || '-', clientTextXValue, clientY)

  const clientBottomY = clientY

  let propY = sectionTop + innerPaddingY + 10
  const propTextXLabel = propBoxX + innerPaddingX
  const propTextXValue = propTextXLabel + 85

  doc.setFont('times', 'bold')
  doc.text('Código:', propTextXLabel, propY)
  doc.setFont('times', 'normal')
  doc.text(String(payload.propertyId), propTextXValue, propY)

  propY += lineHeight
  doc.setFont('times', 'bold')
  doc.text('Dirección:', propTextXLabel, propY)
  doc.setFont('times', 'normal')

  const addressLines = doc.splitTextToSize(
    payload.propertyAddress || '-',
    boxWidth - 105
  )

  doc.text(addressLines, propTextXValue, propY)
  propY += Math.max(addressLines.length * 12, lineHeight)

  doc.setFont('times', 'bold')
  doc.text('Operación:', propTextXLabel, propY)
  doc.setFont('times', 'normal')
  doc.text(payload.operationType || '-', propTextXValue, propY)

  propY += lineHeight
  doc.setFont('times', 'bold')
  doc.text('Tipo:', propTextXLabel, propY)
  doc.setFont('times', 'normal')
  doc.text(payload.propertyType || '-', propTextXValue, propY)

  propY += lineHeight
  doc.setFont('times', 'bold')
  doc.text('Valor:', propTextXLabel, propY)
  doc.setFont('times', 'normal')

  const formattedPrice = formatPriceForPdf(payload.price, payload.currency)
  doc.text(`${formattedPrice} ${payload.currency || ''}`, propTextXValue, propY)

  const propBottomY = propY
  const boxesBottom = Math.max(clientBottomY, propBottomY)
  const boxesHeight = boxesBottom - sectionTop + innerPaddingY + 8

  doc.setDrawColor(180)
  doc.setLineWidth(0.6)
  doc.roundedRect(clientBoxX, sectionTop, boxWidth, boxesHeight, 4, 4)
  doc.roundedRect(propBoxX, sectionTop, boxWidth, boxesHeight, 4, 4)

  y = sectionTop + boxesHeight + 26

  if (payload.mainImage) {
    doc.setFont('times', 'bold')
    doc.setFontSize(10)
    doc.text('Imagen principal de la propiedad', marginX, y)
    y += 14

    try {
      const imageDataUrl = await loadImageAsDataUrl(payload.mainImage)
      const imageWidth = pageWidth - marginX * 2
      const imageHeight = 230

      doc.addImage(imageDataUrl, 'JPEG', marginX, y, imageWidth, imageHeight)

      y += imageHeight + 22
    } catch (error) {
      console.error('Error cargando imagen principal:', error)
    }
  }

  doc.setFont('times', 'bold')
  doc.setFontSize(10)
  doc.text('OBSERVACIONES', marginX, y)

  y += 16

  doc.setFont('times', 'normal')
  doc.setFontSize(9)

  const observationsText =
    payload.observations?.trim() ||
    'Sin observaciones registradas para esta orden de visita.'

  const observationLines = doc.splitTextToSize(
    observationsText,
    pageWidth - marginX * 2
  )

  doc.text(observationLines, marginX, y)
  y += observationLines.length * 11 + 28

  const footerText =
    'Agradeceremos confirmar su visita con anticipación. Declaro que la presente propiedad fue informada y mostrada por el corredor indicado en esta Orden de Visita. Las partes dejan constancia de la información contenida en este documento.'

  const footerLines = doc.splitTextToSize(footerText, pageWidth - marginX * 2)

  doc.setFont('times', 'normal')
  doc.setFontSize(9)
  doc.text(footerLines, marginX, y)

  y += footerLines.length * 11 + 34

  const leftCenterX = pageWidth * 0.28
  const rightCenterX = pageWidth * 0.72
  const signatureLineY = Math.min(y + 20, pageHeight - 90)

  await drawSignatureBlock({
    doc,
    centerX: leftCenterX,
    lineY: signatureLineY,
    title: 'Cliente',
    name: payload.customerName || 'Cliente',
    rut: payload.customerRut,
    signatureUrl: payload.customerSignatureUrl,
  })

  await drawSignatureBlock({
    doc,
    centerX: rightCenterX,
    lineY: signatureLineY,
    title: 'Corredor',
    name: payload.brokerName || 'Corredor',
    rut: payload.brokerRut,
    signatureUrl: payload.brokerSignatureUrl,
  })

  doc.save(`orden-visita-${payload.propertyId}.pdf`)
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
        label: `${property.id} · ${property.typeOfOperationId} de ${property.typeOfPropertyId}`,
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

  const getPropertyPrice = (property: any): string => {
    if (!property) return ''
    if (property.propertyPrice != null) return String(property.propertyPrice)
    if (property.price != null) return String(property.price)
    if (property.priceAmount != null) return String(property.priceAmount)
    return ''
  }

  const initialValues: VisitFormValues = useMemo(
    () => ({
      eventType: 'visit order',
      title: '',
      customerId: null,
      propertyId: propertyId || '',
      customerRut: '',
      customerEmail: '',
      customerPhone: '',
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
      const rawProperty =
        properties.find(
          (p: any) => String(p.id) === String(values.propertyId)
        ) || selectedProperty

      const customer =
        customers.find(
          (c: any) => String(c.id) === String(values.customerId)
        ) || null

      const startDateText = formatDate(values.startDate)
      const endDateText = formatDate(values.endDate)

      const mainImage =
        Array.isArray(rawProperty?.images) && rawProperty.images.length > 0
          ? rawProperty.images.find((img: any) => Boolean(img?.path))?.path
          : undefined

      const brokerName = [myInfo?.name, myInfo?.lastName]
        .filter(Boolean)
        .join(' ')
        .trim()

      const visitPayload: VisitPdfPayload = {
        customerName: customer
          ? `${customer.name} ${customer.lastName || ''}`.trim()
          : '',
        customerRut: values.customerRut,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,

        brokerName: brokerName || 'Corredor',
        brokerRut: myInfo?.rut ? formatRutInput(myInfo.rut) : '',
        brokerEmail: myInfo?.session?.email || '',
        brokerPhone: getBrokerPhone(myInfo),

        propertyId: Number(values.propertyId),
        propertyAddress:
          values.propertyAddress || getOrderVisitAddress(rawProperty),
        operationType: rawProperty?.typeOfOperationId || '',
        propertyType: rawProperty?.typeOfPropertyId || '',
        price: values.price || getPropertyPrice(rawProperty),
        currency: values.currency || rawProperty?.currencyId || 'CLP',
        externalLink: rawProperty?.externalLink,

        startDateText,
        endDateText,
        startTime: values.startTime,
        endTime: values.endTime,

        observations: values.observations?.trim() || '',
        mainImage,

        customerSignatureUrl: customer?.signature || '',
        brokerSignatureUrl: myInfo?.signature || '',
      }

      await generateVisitPdf(visitPayload)

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

  return (
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

        const selectedEventType = eventTypeOptions.find(
          (opt) => opt.value === values.eventType
        )

        const selectedCurrency = currencyOptions.find(
          (opt) => opt.value === values.currency
        )

        const selectedCustomer = customerOptions.find(
          (opt) => String(opt.value) === String(values.customerId)
        )

        const selectedPropertyOption = propertyOptions.find(
          (opt) => String(opt.value) === String(values.propertyId)
        )

        return (
          <Form className="space-y-6">
            {currentProperty && (
              <div className="mb-2 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold">
                      ID {currentProperty.id} ·{' '}
                      {currentProperty.typeOfOperationId} de{' '}
                      {currentProperty.typeOfPropertyId}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getOrderVisitAddress(currentProperty)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500">Precio estimado</p>
                    <p className="font-semibold">
                      {formatPriceForPdf(
                        currentProperty?.propertyPrice ?? values.price,
                        values.currency
                      )}{' '}
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
                errorMessage={errors.customerId as any}
              >
                <Select
                  placeholder="Seleccionar cliente"
                  options={customerOptions}
                  value={selectedCustomer}
                  onChange={(option: any) => {
                    setFieldValue('customerId', option?.value ?? null)

                    const customer = customers.find(
                      (c: any) => String(c.id) === String(option?.value)
                    )

                    if (!customer) return

                    setFieldValue(
                      'customerRut',
                      customer.rut ? formatRutInput(customer.rut) : ''
                    )
                    setFieldValue('customerEmail', customer.email || '')
                    setFieldValue('customerPhone', customer.phone || '')
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
}

export default VisitForm
