import { Formik, Field, Form, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'
import FormItem from '@/components/ui/FormItem'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import DatePicker from '@/components/ui/DatePicker'
import TimeInput from '@/components/ui/TimeInput'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import {
  useGetAllCustomersQuery,
  useGetAllPropertiesQuery,
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
  description: string
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
  description: Yup.string(),
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
      bodyWithDots = '.' + bodyWithDots
      counter = 0
    }
  }
  return `${bodyWithDots}-${dv}`
}

// Define el prefijo según el código de moneda
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

/**
 * ESTA REEMPLAZA A LA ANTIGUA. Formatea el valor con prefijo de moneda.
 */
const formatPriceInput = (inputValue: string, currencyCode: string): string => {
  const prefix = getCurrencyPrefix(currencyCode)
  
  // 1. Remover el prefijo actual (si existe) y cualquier carácter que no sea dígito.
  let rawValue = inputValue.replace(prefix, '').replace(/[^\d]/g, '')

  if (rawValue === '') {
    return '' 
  }

  // 2. Convertir a número entero y formatear usando la localización Chilena (puntos de miles)
  const numberValue = parseInt(rawValue, 10)
  if (isNaN(numberValue)) {
    return prefix 
  }

  const formattedNumber = numberValue.toLocaleString('es-CL', {
    maximumFractionDigits: 0,
  })

  // 3. Devolver el prefijo + el número formateado
  return `${prefix}${formattedNumber}`
}

const loadImageAsDataUrl = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      resolve(dataUrl)
    }
    img.onerror = (err) => reject(err)
    img.src = url
  })
}

const generateVisitPdf = async (payload: {
  customerName: string
  customerRut: string
  customerEmail: string
  customerPhone: string
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
  description: string
  propertyImages: Array<{ path: string }>
}) => {
  const doc = new jsPDF('p', 'pt', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const marginX = 40
  let y = 40

  // Cargamos el logo una sola vez
  let logoDataUrl: string | null = null
  try {
    logoDataUrl = await loadImageAsDataUrl('/img/logo/logo.pdf.jpeg')
  } catch (err) {
    console.log('No se pudo cargar logo local, seguimos sin logo.', err)
  }

  // === MARCA DE AGUA: se dibuja PRIMERO, con baja opacidad ===
  if (logoDataUrl) {
    const wmWidth = 500
    const wmHeight = 500
    const wmX = (pageWidth - wmWidth) / 2
    const wmY = (pageHeight - wmHeight) / 2

    const anyDoc = doc as any
    if (anyDoc.GState) {
      const gState = anyDoc.GState({
        opacity: 0.15,
        fillOpacity: 0.15,
      })
      anyDoc.setGState(gState)
      anyDoc.addImage(logoDataUrl, 'PNG', wmX, wmY, wmWidth, wmHeight)
      const gStateReset = anyDoc.GState({
        opacity: 1,
        fillOpacity: 1,
      })
      anyDoc.setGState(gStateReset)
    } else {
      // Si la versión de jsPDF no soporta GState, lo dibujamos igual pero con ese tamaño
      doc.addImage(logoDataUrl, 'PNG', wmX, wmY, wmWidth, wmHeight)
    }
  }
  // ==========================================================

  // Header con logo arriba a la izquierda (igual que antes)
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
  doc.text('Teléfono: +56 9 XXXX XXXX', pageWidth - marginX, y + 31, {
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
  doc.text('Direccion:', propTextXLabel, propY)
  doc.setFont('times', 'normal')
  doc.text(payload.propertyAddress || '-', propTextXValue, propY)

  propY += lineHeight
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
  doc.text(
    `${formattedPrice} ${payload.currency || ''}`,
    propTextXValue,
    propY
  )

  const propBottomY = propY

  const boxesBottom = Math.max(clientBottomY, propBottomY)
  const boxesHeight = boxesBottom - sectionTop + innerPaddingY + 6

  doc.setDrawColor(180)
  doc.setLineWidth(0.6)
  doc.roundedRect(clientBoxX, sectionTop, boxWidth, boxesHeight, 4, 4)
  doc.roundedRect(propBoxX, sectionTop, boxWidth, boxesHeight, 4, 4)

  y = sectionTop + boxesHeight + 32

  doc.setFont('times', 'bold')
  doc.setFontSize(10)
  doc.text('DETALLE', marginX, y)

  y += 16
  doc.setFont('times', 'normal')
  doc.setFontSize(9)

  const rawDetail =
    payload.description ||
    'Detalle de la propiedad proporcionado por el corredor.'

  const paragraphs = rawDetail
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter((p) => p.length > 0)

  const detailWidth = pageWidth - marginX * 2
  const detailLineHeight = 11

  if (paragraphs.length === 0) {
    const lines = doc.splitTextToSize(rawDetail, detailWidth)
    doc.text(lines, marginX, y)
    y += lines.length * detailLineHeight + 10
  } else {
    for (let i = 0; i < paragraphs.length; i++) {
      const pText = paragraphs[i]
      const lines = doc.splitTextToSize(pText, detailWidth)
      doc.text(lines, marginX, y)
      y += lines.length * detailLineHeight
      if (i < paragraphs.length - 1) {
        y += 6
      }
    }
    y += 10
  }

  if (payload.propertyImages && payload.propertyImages.length > 0) {
    doc.setFont('times', 'bold')
    doc.setFontSize(10)
    doc.text('Imágenes de la propiedad', marginX, y)
    y += 14

    const maxImages = Math.min(payload.propertyImages.length, 25)
    const gap = 6
    const thumbsPerRow = 6
    const usableWidth = pageWidth - marginX * 2
    const thumbWidth =
      (usableWidth - gap * (thumbsPerRow - 1)) / thumbsPerRow
    const thumbHeight = thumbWidth * 0.7

    for (let i = 0; i < maxImages; i++) {
      const imgMeta = payload.propertyImages[i]
      if (!imgMeta?.path) continue

      const row = Math.floor(i / thumbsPerRow)
      const col = i % thumbsPerRow

      const imgX = marginX + col * (thumbWidth + gap)
      const imgY = y + row * (thumbHeight + gap)

      try {
        const dataUrl = await loadImageAsDataUrl(imgMeta.path)
        doc.addImage(dataUrl, 'JPEG', imgX, imgY, thumbWidth, thumbHeight)
      } catch (err) {
        console.log('Error cargando imagen de propiedad:', imgMeta, err)
      }
    }

    const rowsUsed = Math.ceil(maxImages / thumbsPerRow)
    y += rowsUsed * (thumbHeight + gap) + 10
  }

  const footerText =
    'Agradeceremos confirmar su visita con anticipación. ' +
    'Declaro que Pulso Propiedades es la primera oficina en ofrecerme los inmuebles especificados en esta Orden de Visita. ' +
    'Me comprometo a cancelar, para el caso de arriendo, la mitad del primer mes de arriendo más el impuesto legal, ' +
    'y para el caso de venta, el 2% del valor final de la operación más el impuesto legal por concepto de honorarios, ' +
    'de acuerdo a lo estipulado por la ley.'

  const footerLines = doc.splitTextToSize(
    footerText,
    pageWidth - marginX * 2
  )
  doc.setFont('times', 'normal')
  doc.setFontSize(9)
  doc.text(footerLines, marginX, y)

  y += footerLines.length * 11 + 34

  const lineWidth = (pageWidth - marginX * 2 - 80) / 2
  const leftLineX = marginX
  const rightLineX = marginX + lineWidth + 80
  const lineY = y + 20

  doc.setLineWidth(0.5)
  doc.setDrawColor(0)
  doc.line(leftLineX, lineY, leftLineX + lineWidth, lineY)
  doc.line(rightLineX, lineY, rightLineX + lineWidth, lineY)

  doc.setFont('times', 'bold')
  doc.setFontSize(10)
  doc.text(
    payload.customerName || 'Cliente',
    leftLineX + lineWidth / 2,
    lineY + 12,
    {
      align: 'center',
    }
  )
  doc.text(
    'Pulso Propiedades',
    rightLineX + lineWidth / 2,
    lineY + 12,
    {
      align: 'center',
    }
  )

  doc.setFont('times', 'normal')
  doc.setFontSize(8)
  doc.text(
    `RUT: ${payload.customerRut || '—'}`,
    leftLineX + lineWidth / 2,
    lineY + 24,
    { align: 'center' }
  )
  doc.text(
    'RUT: XX.XXX.XXX-X',
    rightLineX + lineWidth / 2,
    lineY + 24,
    { align: 'center' }
  )

  doc.save(`orden-visita-${payload.propertyId}.pdf`)
}


const normalizeCollection = <T = any>(result: any): T[] => {
  if (!result) return []
  if (Array.isArray(result)) return result
  if ('data' in result && Array.isArray(result.data)) return result.data
  return []
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

  const customers = normalizeCollection<any>(customersData)
  const properties = normalizeCollection<any>(propertiesData)

  const customerOptions =
    customers.map((customer: any) => ({
      value: customer.id,
      label: `${customer.name} ${customer.lastName || ''}`,
    })) || []

  const propertyOptions =
    properties.map((property: any) => ({
      value: property.id,
      label: `${property.id} · ${property.typeOfOperationId} de ${property.typeOfPropertyId}`,
    })) || []

  const currencyOptions = [
    { value: 'CLP', label: 'CLP - Peso Chileno' },
    { value: 'USD', label: 'USD - Dólar' },
    { value: 'UF', label: 'UF - Unidad de Fomento' },
  ]

  const eventTypeOptions = [
    { value: 'visit order', label: 'Orden de Visita' },
    { value: 'event', label: 'Evento' },
  ]

  const selectedProperty = properties.find(
    (p: any) => String(p.id) === String(propertyId)
  )

  const getPropertyAddress = (property: any): string => {
    if (!property) return ''
    if (property.address?.addressPublic) return property.address.addressPublic
    if (property.address?.address) {
      const num = property.address?.number ? ` ${property.address.number}` : ''
      return `${property.address.address}${num}`
    }
    return ''
  }

  const getPropertyPrice = (property: any): string => {
    if (!property) return ''
    if (property.propertyPrice) return property.propertyPrice.toString()
    if (property.price) return property.price.toString()
    if (property.priceAmount) return property.priceAmount.toString()
    return ''
  }

  const initialValues: VisitFormValues = {
    eventType: 'visit order',
    title: '',
    customerId: null,
    propertyId: propertyId || '',
    customerRut: '',
    customerEmail: '',
    customerPhone: '', // sin valor por defecto, para que funcione bien el placeholder
    propertyAddress: getPropertyAddress(selectedProperty),
    price: getPropertyPrice(selectedProperty),
    currency: 'CLP',
    startDate: new Date(),
    startTime: '09:00',
    endDate: new Date(),
    endTime: '09:00',
    description: '',
  }

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

      const propertyImages: Array<{ path: string }> =
        (rawProperty?.images || []).map((img: any) => ({
          path: img.path,
        })) || []

      const visitPayload = {
        eventType: values.eventType,
        title: values.title || `Visita para propiedad ${values.propertyId}`,
        customerName: customer
          ? `${customer.name} ${customer.lastName || ''}`
          : '',
        customerRut: values.customerRut,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
        customerId: values.customerId ? Number(values.customerId) : null,
        propertyId: Number(values.propertyId),
        propertyAddress:
          values.propertyAddress || getPropertyAddress(rawProperty),
        operationType: rawProperty?.typeOfOperationId || '',
        propertyType: rawProperty?.typeOfPropertyId || '',
        price: values.price || getPropertyPrice(rawProperty),
        currency: values.currency,
        externalLink: rawProperty?.externalLink,
        startDateText,
        endDateText,
        startTime: values.startTime,
        endTime: values.endTime,
        description: values.description || rawProperty?.observations || '',
        propertyImages,
        rawProperty,
      }

      //console.log(' Propiedad completa seleccionada:', rawProperty)
      //console.log(' Campo images de la propiedad:', rawProperty?.images)
      //console.log(' Datos de la visita (payload listo):', visitPayload)

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
          {error.message || 'Error al generar la orden de visita'}
        </Notification>
      )
    } finally {
      setIsSubmitting(false)
      setSubmitting(false)
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, values, setFieldValue }) => {
        const currentProperty =
          properties.find(
            (p: any) => String(p.id) === String(values.propertyId || propertyId)
          ) || selectedProperty

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
                      {getPropertyAddress(currentProperty)}
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
              <div className="mt-2 mb-1 md:col-span-2">
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
                  value={eventTypeOptions.find(
                    (opt) => opt.value === values.eventType
                  )}
                  onChange={(option) =>
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

              <div className="mt-4 mb-1 border-t border-dashed border-gray-200 pt-3 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Datos del cliente
                </h4>
                <p className="text-xs text-gray-500">
                  Selecciona al cliente y completa sus datos de contacto.
                </p>
              </div>

              <FormItem
                label="Cliente"
                invalid={Boolean(errors.customerId && touched.customerId)}
                errorMessage={errors.customerId}
              >
                <Select
                  placeholder="Seleccionar cliente"
                  options={customerOptions}
                  value={customerOptions.find(
                    (opt) => opt.value === values.customerId
                  )}
                  onChange={(option) => {
                    setFieldValue('customerId', option?.value)
                    const customer = customers.find(
                      (c: any) => String(c.id) === String(option?.value)
                    )
                    if (customer) {
                      if (customer.rut) {
                        setFieldValue(
                          'customerRut',
                          formatRutInput(customer.rut)
                        )
                      }
                      if (customer.email) {
                        setFieldValue('customerEmail', customer.email)
                      }
                      if (customer.phone) {
                        setFieldValue('customerPhone', customer.phone)
                      }
                    }
                  }}
                />
              </FormItem>

              <FormItem label="RUT del cliente">
                <Field name="customerRut">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      placeholder="RUT del cliente"
                      onChange={(e) => {
                        const formatted = formatRutInput(e.target.value)
                        setFieldValue('customerRut', formatted)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <FormItem
                label="Correo electrónico"
                invalid={Boolean(
                  errors.customerEmail && touched.customerEmail
                )}
                errorMessage={errors.customerEmail}
              >
                <Field name="customerEmail">
                  {({ field, form }: any) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="cliente@email.com"
                      
                      // 🚫 LÓGICA ONFOCUS ELIMINADA 🚫
                      
                      onChange={(e) => {
                        form.setFieldValue('customerEmail', e.target.value)
                      }}
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
                      // 🚫 LÓGICA ONFOCUS ELIMINADA 🚫
                      onChange={(e) => {
                        // Simplemente usar el valor que escribe el usuario.
                        form.setFieldValue('customerPhone', e.target.value)
                      }}
                    />
                  )}
                </Field>
              </FormItem>

              <div className="mt-4 mb-1 border-t border-dashed border-gray-200 pt-3 md:col-span-2">
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
                  value={propertyOptions.find(
                    (opt) => String(opt.value) === String(values.propertyId)
                  )}
                  onChange={(option) => {
                    setFieldValue('propertyId', option?.value)
                    const property = properties.find(
                      (p: any) => String(p.id) === String(option?.value)
                    )
                    if (property) {
                      setFieldValue(
                        'propertyAddress',
                        getPropertyAddress(property)
                      )
                      setFieldValue('price', getPropertyPrice(property))
                    }
                  }}
                />
              </FormItem>

              <FormItem label="Dirección de la propiedad">
                <Field
                  name="propertyAddress"
                  component={Input}
                  placeholder="Dirección"
                  disabled
                />
              </FormItem>

              <FormItem label="Precio">
                <Field name="price">
                  {({ field, form, meta }: any) => ( // ⬅️ AGREGAR 'form'
                    <Input
                      {...field}
                      inputMode="numeric"
                      placeholder="60.000.000"
                      onChange={(e) => {
                        const formatted = formatPriceInput(
                          e.target.value, 
                          form.values.currency // ⬅️ PASAR LA MONEDA
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
                  value={currencyOptions.find(
                    (opt) => opt.value === values.currency
                  )}
                  onChange={(option) => {
                    // 1. Establecer el nuevo código de moneda
                    setFieldValue('currency', option?.value)

                    // 2. RE-FORMATEAR el precio existente con el nuevo prefijo
                    const newCurrency = option?.value || 'CLP'
                    if (values.price) { 
                      const formattedValue = formatPriceInput(
                        values.price, 
                        newCurrency
                      )
                      setFieldValue('price', formattedValue)
                    }
                  }}
                />
              </FormItem>

              <div className="mt-4 mb-1 border-t border-dashed border-gray-200 pt-3 md:col-span-2">
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
                errorMessage={errors.startDate as string}
              >
                <DatePicker
                  value={values.startDate}
                  onChange={(date) => setFieldValue('startDate', date)}
                  placeholder="Seleccionar fecha"
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
                  onChange={(time) => {
                    const hours = time.getHours().toString().padStart(2, '0')
                    const minutes = time
                      .getMinutes()
                      .toString()
                      .padStart(2, '0')
                    setFieldValue('startTime', `${hours}:${minutes}`)
                  }}
                  format="24"
                />
              </FormItem>

              <FormItem
                label="Fecha de término"
                invalid={Boolean(errors.endDate && touched.endDate)}
                errorMessage={errors.endDate as string}
              >
                <DatePicker
                  value={values.endDate}
                  onChange={(date) => setFieldValue('endDate', date)}
                  placeholder="Seleccionar fecha"
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
                  onChange={(time) => {
                    const hours = time.getHours().toString().padStart(2, '0')
                    const minutes = time
                      .getMinutes()
                      .toString()
                      .padStart(2, '0')
                    setFieldValue('endTime', `${hours}:${minutes}`)
                  }}
                  format="24"
                />
              </FormItem>

              <div className="mt-4 mb-1 border-t border-dashed border-gray-200 pt-3 md:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Notas adicionales
                </h4>
                <p className="text-xs text-gray-500">
                  Información que quieras que aparezca en la orden (indicaciones,
                  puntos de referencia, etc.).
                </p>
              </div>

              <FormItem label="Descripción" className="md:col-span-2">
                <Field
                  as="textarea"
                  name="description"
                  className="input min-h-[96px]"
                  rows={4}
                  placeholder="Descripción adicional..."
                />
              </FormItem>
            </div>

            <div className="flex flex-col justify-end gap-3 border-t border-gray-100 pt-4 md:flex-row md:gap-4">
              <Button type="button" onClick={() => navigate('/mis-propiedades')}>
                Regresar
              </Button>
              <Button
                type="submit"
                variant="solid"
                loading={isSubmitting}
                className="bg-yellow-400 text-black hover:bg-yellow-500"
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
