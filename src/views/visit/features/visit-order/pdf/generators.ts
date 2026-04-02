import jsPDF from 'jspdf'
import type { VisitOrderTemplateType, VisitPdfPayload } from './types'

type PdfContext = {
  doc: jsPDF
  pageWidth: number
  pageHeight: number
  marginX: number
  marginY: number
  y: number
}

type VisitOrderDefinition = {
  title: string
  priceLabel: string
  paragraphs: string[]
  showCompanyFooter?: boolean
  filenamePrefix: string
}

const COMPANY_NAME = 'Pulso Propiedades'
const COMPANY_EMAIL = 'contacto@pulsopropiedades.cl'
const COMPANY_PHONE = '+56 9 94355075'

const COMPANY_FOOTER_NAME = 'Sociedad Inversiones CVD SPA – Pulso Propiedades'
const COMPANY_FOOTER_RUT = 'RUT 77.579.633-2'
const COMPANY_FOOTER_LEGAL_REP =
  'Representante Legal: Felipe Rojas Tejo cédula de identidad 15.641.470-0'

const DEFAULT_TOP_LEFT_LOGO = '/img/logo/logo.pdf.jpeg'

const LEGAL_TEXTS: Record<VisitOrderTemplateType, VisitOrderDefinition> = {
  sale: {
    title: 'ORDEN DE VISITA PARA COMPRAVENTA',
    priceLabel: 'Valor venta $/UF',
    filenamePrefix: 'orden-visita-compraventa',
    paragraphs: [
      '',
      'El interesado/a deberá pagar al Corredor por concepto de honorarios profesionales, la suma equivalente al 2% del precio de venta más IVA. Los honorarios señalados se pagarán mediante Vale Vista al momento de la firma de la Escritura de Compraventa. El mencionado instrumento quedará siempre en custodia del señor Notario respectivo, con instrucciones de entregar el Vale vista a su beneficiario, una vez acreditada la inscripción del dominio de la propiedad en el Conservador de Bienes Raíces respectivo, a nombre del comprador.',
      'Todas las obligaciones antes señaladas también se harán efectivas, en el caso que la compra la realicen el cónyuge, ascendientes o descendientes en línea directa y colaterales por consanguinidad hasta el segundo grado inclusive; sociedad de personas o capital en que el interesado tenga participación como accionista, socio o representante administrador; es decir, si proporcionare su uso o información a terceros, el firmante deberá pagar íntegra la comisión pactada. En el caso de concretar una operación comercial con terceros sin la participación del Corredor de Propiedades y/o la Empresa, deberá cancelar a ésta el doble de la comisión convenida.',
      'Cualquier dificultad que pueda surgir entre el firmante y la Empresa /Corredor de Propiedades con motivo de esta Orden de Visita, será resuelta por la justicia ordinaria. Para todos los efectos, las partes fijan su domicilio en la ciudad de Santiago y se someten a sus Tribunales de Justicia.',
    ],
  },
  rent: {
    title: 'ORDEN DE VISITA PARA ARRENDAMIENTO',
    priceLabel: 'Valor renta $/UF',
    filenamePrefix: 'orden-visita-arriendo',
    showCompanyFooter: true,
    paragraphs: [
      '',
      'El interesado/a deberá pagar a Sociedad de Inversiones CVD SpA – Pulso Propiedades (en adelante la Empresa) por concepto de honorarios profesionales, la suma equivalente al 50% más IVA del valor de un mes de arriendo por contratos de hasta 24 meses; en el caso de arriendos a plazos superiores a 2 años, los honorarios serán de un 2% más IVA del total de rentas a percibir en el periodo del contrato. Los honorarios señalados se pagarán al contado mediante transferencia al momento de la firma del contrato respectivo.',
      'En relación con la Ley 21.719 de Protección de Datos Personales, el firmante autoriza a la Empresa a revisar sus informes comerciales y financieros para postular al arriendo del inmueble indicado precedentemente. De no ser aceptada esta solicitud de arrendamiento, ésta debe eliminar de sus bases de datos la documentación entregada al cumplirse el plazo de quince días desde el envío.',
      'Esta orden es personal e intransferible; si proporcionare su uso o información a terceros, el firmante deberá pagar íntegra la comisión pactada. En el caso de concretar una operación comercial con terceros sin la participación del Corredor de Propiedades y/o la Empresa, deberá cancelar a ésta el doble de la comisión convenida.',
      'Cualquier dificultad que pueda surgir entre el firmante y la Empresa /Corredor de Propiedades con motivo de esta Orden de Visita, será resuelta por la justicia ordinaria. Para todos los efectos, las partes fijan su domicilio en la ciudad de Santiago y se someten a sus Tribunales de Justicia.',
    ],
  },
  'commercial-rent': {
    title: 'ORDEN DE VISITA PARA ARRENDAMIENTO COMERCIAL',
    priceLabel: 'Valor renta $/UF',
    filenamePrefix: 'orden-visita-arriendo-comercial',
    showCompanyFooter: true,
    paragraphs: [
      '',
      'El interesado/a deberá pagar a Sociedad de Inversiones CVD SpA – Pulso Propiedades (en adelante la Empresa) por concepto de honorarios profesionales, el valor de 1 mes de renta más IVA por contratos de hasta 3 años. En caso de arrendamientos a plazos superiores a 3 años, los honorarios profesionales serán de un 2% más IVA del total de rentas estipuladas en el periodo del contrato. Los honorarios señalados se pagarán al contado mediante transferencia al momento de la firma del contrato respectivo.',
      'En relación con la Ley 21.719 de Protección de Datos Personales, el firmante autoriza a la Empresa a revisar sus informes comerciales y financieros para postular al arriendo del inmueble indicado precedentemente. De no ser aceptada esta solicitud de arrendamiento, ésta debe eliminar de sus bases de datos la documentación entregada al cumplirse el plazo de quince días desde el envío.',
      'Esta orden es personal e intransferible; si proporcionare su uso o información a terceros, el firmante deberá pagar íntegra la comisión pactada. En el caso de concretar una operación comercial con terceros sin la participación del Corredor de Propiedades y/o la Empresa, deberá cancelar a ésta el doble de la comisión convenida.',
      'Cualquier dificultad que pueda surgir entre el firmante y la Empresa /Corredor de Propiedades con motivo de esta Orden de Visita, será resuelta por la justicia ordinaria. Para todos los efectos, las partes fijan su domicilio en la ciudad de Santiago y se someten a sus Tribunales de Justicia.',
    ],
  },
}

const normalizeImageFormat = (dataUrl: string): 'JPEG' | 'PNG' => {
  return dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG'
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
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }

    img.onerror = (err) => reject(err)
    img.src = url
  })

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

const ensurePageSpace = (
  ctx: PdfContext,
  requiredHeight: number,
  onNewPage?: () => Promise<void> | void
) => {
  if (ctx.y + requiredHeight <= ctx.pageHeight - ctx.marginY) return

  ctx.doc.addPage()
  ctx.y = ctx.marginY

  if (onNewPage) {
    onNewPage()
  }
}

const drawParagraph = (
  ctx: PdfContext,
  text: string,
  fontSize = 9,
  lineHeight = 12
) => {
  ctx.doc.setFont('times', 'normal')
  ctx.doc.setFontSize(fontSize)

  const lines = ctx.doc.splitTextToSize(text, ctx.pageWidth - ctx.marginX * 2)

  ensurePageSpace(ctx, lines.length * lineHeight + 8)

  ctx.doc.text(lines, ctx.marginX, ctx.y)
  ctx.y += lines.length * lineHeight + 10
}

const drawDivider = (ctx: PdfContext, marginTop = 8, marginBottom = 8) => {
  ctx.y += marginTop
  ctx.doc.setDrawColor(0)
  ctx.doc.setLineWidth(0.7)
  ctx.doc.line(ctx.marginX, ctx.y, ctx.pageWidth - ctx.marginX, ctx.y)
  ctx.y += marginBottom
}

const drawCorporateTop = async (ctx: PdfContext, payload: VisitPdfPayload) => {
  const leftLogoUrl = payload.topLeftLogoUrl || DEFAULT_TOP_LEFT_LOGO
  let leftLogoDataUrl: string | null = null

  try {
    leftLogoDataUrl = await loadImageAsDataUrl(leftLogoUrl)
  } catch {
    leftLogoDataUrl = null
  }

  const topStartY = ctx.y

  if (leftLogoDataUrl) {
    const format = normalizeImageFormat(leftLogoDataUrl)
    ctx.doc.addImage(leftLogoDataUrl, format, ctx.marginX, topStartY, 110, 34)
  }

  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(12)
  ctx.doc.text(COMPANY_NAME, ctx.pageWidth - ctx.marginX, topStartY + 8, {
    align: 'right',
  })

  ctx.doc.setFont('times', 'normal')
  ctx.doc.setFontSize(11)
  ctx.doc.text(
    `Email: ${COMPANY_EMAIL}`,
    ctx.pageWidth - ctx.marginX,
    topStartY + 24,
    { align: 'right' }
  )
  ctx.doc.text(
    `Teléfono: ${COMPANY_PHONE}`,
    ctx.pageWidth - ctx.marginX,
    topStartY + 40,
    { align: 'right' }
  )

  ctx.y = topStartY + 78

  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(14)
  ctx.doc.text('ORDEN DE VISITA', ctx.pageWidth / 2, ctx.y, {
    align: 'center',
  })

  const eventTitle = payload.title?.trim()

  if (eventTitle) {
    ctx.y += 16

    ctx.doc.setFont('times', 'italic')
    ctx.doc.setFontSize(10)

    const titleLines = ctx.doc.splitTextToSize(
      eventTitle,
      ctx.pageWidth - ctx.marginX * 4
    )

    ctx.doc.text(titleLines, ctx.pageWidth / 2, ctx.y, {
      align: 'center',
    })

    ctx.y += titleLines.length * 12 + 8
  } else {
    ctx.y += 15
  }

  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(10)

  const scheduleText = `Fecha visita programada ${payload.startDateText} a las ${payload.startTime}`
  ctx.doc.text(scheduleText, ctx.pageWidth / 2, ctx.y, {
    align: 'center',
  })

  ctx.y += 35
}

const drawBodyHeader = (
  ctx: PdfContext,
  payload: VisitPdfPayload,
  definition: VisitOrderDefinition
) => {
  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(16)
  ctx.doc.text(definition.title, ctx.marginX, ctx.y)

  ctx.doc.setFont('times', 'normal')
  ctx.doc.setFontSize(10)
  ctx.doc.text('Fecha:', ctx.pageWidth - ctx.marginX - 155, ctx.y)

  ctx.doc.line(
    ctx.pageWidth - ctx.marginX - 120,
    ctx.y + 1,
    ctx.pageWidth - ctx.marginX,
    ctx.y + 1
  )

  if (payload.startDateText) {
    ctx.doc.setFont('times', 'bold')
    ctx.doc.text(
      payload.startDateText,
      ctx.pageWidth - ctx.marginX - 116,
      ctx.y - 2
    )
  }

  ctx.y += 24
}

const drawTopInformation = (
  ctx: PdfContext,
  payload: VisitPdfPayload,
  definition: VisitOrderDefinition
) => {
  const leftX = ctx.marginX
  const rightX = ctx.pageWidth * 0.67
  const lineHeight = 12

  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(10)
  ctx.doc.text('Por esta Orden, don/doña:', leftX, ctx.y)
  ctx.y += lineHeight

  const drawLabelValue = (
    label: string,
    value: string,
    x: number,
    y: number,
    labelWidth = 62,
    maxWidth = 150
  ) => {
    ctx.doc.setFont('times', 'normal')
    ctx.doc.setFontSize(10)
    ctx.doc.text(label, x, y)

    const valueLines = ctx.doc.splitTextToSize(value || '', maxWidth)
    ctx.doc.text(valueLines, x + labelWidth, y)

    return valueLines.length
  }

  let currentYLeft = ctx.y
  let currentYRight = ctx.y

  const nameLines = drawLabelValue(
    'Nombre:',
    payload.customerName || '',
    leftX,
    currentYLeft
  )
  const rutLines = drawLabelValue(
    'RUT:',
    payload.customerRut || '',
    rightX,
    currentYRight,
    38,
    110
  )

  currentYLeft += Math.max(nameLines, 1) * lineHeight
  currentYRight += Math.max(rutLines, 1) * lineHeight

  const emailLines = drawLabelValue(
    'Mail:',
    payload.customerEmail || '',
    leftX,
    currentYLeft
  )
  const phoneLines = drawLabelValue(
    'Teléfono:',
    payload.customerPhone || '',
    rightX,
    currentYRight,
    50,
    110
  )

  currentYLeft += Math.max(emailLines, 1) * lineHeight
  currentYRight += Math.max(phoneLines, 1) * lineHeight

  const addressLines = drawLabelValue(
    'Domicilio:',
    payload.customerAddress || '',
    leftX,
    currentYLeft,
    62,
    290
  )

  currentYLeft += Math.max(addressLines, 1) * lineHeight
  ctx.y = Math.max(currentYLeft, currentYRight) + 16

  ctx.doc.setFont('times', 'normal')
  ctx.doc.setFontSize(10)
  ctx.doc.text(
    'Viene a solicitar visitar la(s) siguiente(s) propiedad(es):',
    ctx.marginX,
    ctx.y
  )

  ctx.y += 12

  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(11)

  const propertyAddressMaxWidth = ctx.pageWidth - ctx.marginX * 2

  const addressLinesProperty = ctx.doc.splitTextToSize(
    payload.propertyAddress || '',
    propertyAddressMaxWidth
  )

  ctx.doc.text(addressLinesProperty, ctx.marginX, ctx.y)
  ctx.y += addressLinesProperty.length * 12

  drawDivider(ctx, 4, 8)
  ctx.y += 3

  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(10)

  ctx.doc.text(definition.priceLabel, ctx.marginX, ctx.y)

  ctx.doc.setFont('times', 'normal')

  ctx.doc.text(
    formatPriceForPdf(payload.price, payload.currency) || payload.price || '',
    ctx.marginX + 88,
    ctx.y
  )
  ctx.y += 3

  drawDivider(ctx, 6, 12)
}

const buildFirstParagraph = (payload: VisitPdfPayload) => {
  const brokerName = payload.brokerName || 'Corredor de Propiedades'
  return `El interesado declara haber visitado la propiedad por intermedio del Corredor de Propiedades don/ña ${brokerName}, comprometiéndose a efectuar toda transacción de la(s) propiedad(es) ofrecida(s) en esta orden por intermedio del Corredor individualizado y acepta expresamente lo siguiente:`
}

const drawPropertyImages = async (
  ctx: PdfContext,
  payload: VisitPdfPayload
) => {
  const images = (payload.propertyImages || []).filter(Boolean).slice(0, 3)

  if (!images.length) return

  const titleHeight = 16
  const imageGap = 8
  const totalWidth = ctx.pageWidth - ctx.marginX * 2
  const imageWidth = (totalWidth - imageGap * 2) / 3
  const imageHeight = 110

  ensurePageSpace(ctx, titleHeight + imageHeight + 16)

  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(10)
  ctx.doc.text('Imágenes de la propiedad', ctx.marginX, ctx.y)
  ctx.y += titleHeight

  let currentX = ctx.marginX

  for (const image of images) {
    try {
      const imageDataUrl = await loadImageAsDataUrl(image)
      const format = normalizeImageFormat(imageDataUrl)

      ctx.doc.addImage(
        imageDataUrl,
        format,
        currentX,
        ctx.y,
        imageWidth,
        imageHeight
      )

      ctx.doc.setDrawColor(180)
      ctx.doc.rect(currentX, ctx.y, imageWidth, imageHeight)
    } catch {
      ctx.doc.setDrawColor(180)
      ctx.doc.rect(currentX, ctx.y, imageWidth, imageHeight)

      ctx.doc.setFont('times', 'normal')
      ctx.doc.setFontSize(8)
      ctx.doc.text(
        'No fue posible cargar la imagen',
        currentX + imageWidth / 2,
        ctx.y + imageHeight / 2,
        { align: 'center' }
      )
    }

    currentX += imageWidth + imageGap
  }

  ctx.y += imageHeight + 18
}

const drawSignatures = async (ctx: PdfContext, payload: VisitPdfPayload) => {
  ensurePageSpace(ctx, 110)

  const leftCenterX = ctx.pageWidth * 0.28
  const rightCenterX = ctx.pageWidth * 0.72
  const lineY = ctx.y + 24
  const signatureWidth = 110
  const signatureHeight = 38

  const drawSignature = async (
    centerX: number,
    name: string,
    rut: string,
    signatureUrl?: string
  ) => {
    if (signatureUrl) {
      try {
        const signatureDataUrl = await loadImageAsDataUrl(signatureUrl)
        const format = normalizeImageFormat(signatureDataUrl)

        ctx.doc.addImage(
          signatureDataUrl,
          format,
          centerX - signatureWidth / 2,
          lineY - 40,
          signatureWidth,
          signatureHeight
        )
      } catch {
        // noop
      }
    }

    ctx.doc.setLineWidth(0.7)
    ctx.doc.line(centerX - 62, lineY, centerX + 62, lineY)

    ctx.doc.setFont('times', 'bold')
    ctx.doc.setFontSize(9)
    ctx.doc.text(name || '-', centerX, lineY + 14, { align: 'center' })

    ctx.doc.setFont('times', 'normal')
    ctx.doc.setFontSize(8)
    ctx.doc.text(`RUT: ${rut || '-'}`, centerX, lineY + 26, {
      align: 'center',
    })
  }

  await drawSignature(
    leftCenterX,
    payload.customerName || 'Nombre Cliente',
    payload.customerRut || '',
    payload.customerSignatureUrl
  )

  await drawSignature(
    rightCenterX,
    payload.brokerName || 'Corredor de Propiedades',
    payload.brokerRut || '',
    payload.brokerSignatureUrl
  )

  ctx.y = lineY + 52
}

const drawCompanyFooter = (ctx: PdfContext) => {
  ensurePageSpace(ctx, 48)

  ctx.doc.setFont('times', 'normal')
  ctx.doc.setFontSize(8.5)

  ctx.doc.line(ctx.marginX + 12, ctx.y, ctx.marginX + 92, ctx.y)
  ctx.y += 10

  ctx.doc.setFont('times', 'bold')
  ctx.doc.text(COMPANY_FOOTER_NAME, ctx.marginX + 12, ctx.y)
  ctx.y += 11

  ctx.doc.setFont('times', 'normal')
  ctx.doc.text(COMPANY_FOOTER_RUT, ctx.marginX + 12, ctx.y)
  ctx.y += 11
  ctx.doc.text(COMPANY_FOOTER_LEGAL_REP, ctx.marginX + 12, ctx.y)
  ctx.y += 4
}

const drawObservations = (ctx: PdfContext, payload: VisitPdfPayload) => {
  const observationsText = payload.observations?.trim()
  if (!observationsText) return

  ensurePageSpace(ctx, 40)

  ctx.doc.setFont('times', 'bold')
  ctx.doc.setFontSize(10)
  ctx.doc.text('Observaciones:', ctx.marginX, ctx.y)
  ctx.y += 14

  drawParagraph(ctx, observationsText, 9, 12)
}

const buildDocument = async (payload: VisitPdfPayload) => {
  const definition = LEGAL_TEXTS[payload.template]
  const doc = new jsPDF('p', 'pt', 'a4')

  const ctx: PdfContext = {
    doc,
    pageWidth: doc.internal.pageSize.getWidth(),
    pageHeight: doc.internal.pageSize.getHeight(),
    marginX: 34,
    marginY: 30,
    y: 30,
  }

  await drawCorporateTop(ctx, payload)
  drawBodyHeader(ctx, payload, definition)
  drawTopInformation(ctx, payload, definition)

  const paragraphs = [...definition.paragraphs]
  paragraphs[0] = buildFirstParagraph(payload)

  for (const paragraph of paragraphs) {
    drawParagraph(ctx, paragraph, 9, 12)
  }

  drawObservations(ctx, payload)
  await drawPropertyImages(ctx, payload)
  await drawSignatures(ctx, payload)

  if (definition.showCompanyFooter) {
    drawCompanyFooter(ctx)
  }

  const filename = `${definition.filenamePrefix}-${payload.propertyId}.pdf`
  doc.save(filename)
}

export const generateSaleVisitPdf = async (payload: VisitPdfPayload) => {
  await buildDocument({
    ...payload,
    template: 'sale',
  })
}

export const generateRentVisitPdf = async (payload: VisitPdfPayload) => {
  await buildDocument({
    ...payload,
    template: 'rent',
  })
}

export const generateCommercialRentVisitPdf = async (
  payload: VisitPdfPayload
) => {
  await buildDocument({
    ...payload,
    template: 'commercial-rent',
  })
}

export const generateVisitPdfByTemplate = async (payload: VisitPdfPayload) => {
  await buildDocument(payload)
}
