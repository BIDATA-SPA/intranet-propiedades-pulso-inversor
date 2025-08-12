/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Button, Card } from '@/components/ui'
import { useGetPropertyByIdQuery } from '@/services/RtkQueryService'
import { useAppSelector } from '@/store'
import { useEffect, useState, useRef } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import OrdenDeVisitaPDF from './pdf/ReactPDF'
import { PDFViewer,pdf  } from '@react-pdf/renderer'
import PdfForm, {EventParam} from './form/PdfForm'
import {
  useCreateVisitOrderMutation,
} from '@/services/RtkQueryService'
/* import UploadImage from '../' */
/* import PropertyForm from './PropertyForm' */
/* import PropertyResume from './PropertyResume' */

const DownloadPdf = async (pdfComponent: JSX.Element, fileName: string) => {
  const blob = await pdf(pdfComponent).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const formatStartDate = (start: string) => {
  const date = new Date(start)
  const dayStart = date.getDate().toString()
  const yearStart = date.getFullYear().toString()

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  const monthStart = meses[date.getMonth()]

  return { dayStart, monthStart, yearStart }
}

const formatStartHour = (startTime: string) => {
  const date = new Date(startTime)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const getTodayAsStrings = () => {
  const hoy = new Date()
  const day = hoy.getDate().toString()
  const year = hoy.getFullYear().toString()

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]
  const month = meses[hoy.getMonth()]

  return { day, month, year }
}

const PdfGenerate = () => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const location = useLocation()
  const pdfRef = useRef<HTMLDivElement>(null)
  const [createVisitOrder] = useCreateVisitOrderMutation()

  useEffect(() => {
    // Solo realiza scroll si el hash es #scroll-target
    if (location.hash === '#scroll-target') {
      const target = document.getElementById('scroll-target')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location.hash])
  const { propertyId } = useParams()
  const navigate = useNavigate()
  const { data, isFetching } = useGetPropertyByIdQuery(propertyId, {
    refetchOnMountOrArgChange: true,
  })

  /* console.log('data id',data) */

  const handleBackNavigation = () => {
    if (userAuthority === 2) {
      navigate('/mis-propiedades')
    }

    if (userAuthority === 3) {
      navigate('/dashboard')
    }
  }

  const NotImagesAlert = () =>
    data?.images?.length === 0 && (
      <Alert
        showIcon
        closable
        type="info"
        className="mb-2"
        title="Advertencia!"
      >
        Esta Propieda no cuenta con imagenes publicadas {''}
        <a href="#publicar" className="font-bold underline">
          Ir a publicar
        </a>
      </Alert>
    )
  const [formDataPDF, setFormData] = useState({
    rut: '....', 
    telefono: '....', 
    correo: '....',
    nombre: '....', 
    propertyId: '',
    propertyDirection: '',
    propertyPrice: '',
    propertyPriceCode: '',
  })

  const onSubmit = async (formData: EventParam) => {
    const {
      eventType,
      title,
      start,
      startTime,
      end,
      endTime,
      description,
      eventColor,
      customerId,
      propertyId,
    } = formData

    const { day, month, year } = getTodayAsStrings()

    const { dayStart, monthStart, yearStart } = formatStartDate(formData.start)
    const hora = formatStartHour(formData.startTime)

    //data para la api (solo estos)
    const _data = {
      title,
      start,
      startTime,
      end,
      endTime,
      description,
      eventColor,
      eventType: formData.eventType as "event" | "visit order",
    }

    try {
      const data = _data

      if (eventType === 'visit order') {
        const data = {
          ..._data,
          customerId,
          propertyId,
        }
        console.log('data onSubmit',data)
        console.log('formdata onSubmit',formData)
        setFormData({
          nombre: formData.clientName,
          rut: formData.clientRut,
          correo: formData.clientEmail,
          telefono: formData.clientPhone?.toString() || '',
          propertyId: formData.propertyId?.toString() || '',
          propertyDirection: formData.propertyDirection,
          propertyPrice: formData.propertyPrice?.toString() || '',
          propertyPriceCode: formData.propertyPriceCode,
        })
        await createVisitOrder(data)
        await DownloadPdf(
          <OrdenDeVisitaPDF
            nombre={formData.clientName}
            rut={formData.clientRut}
            correo={formData.clientEmail}
            telefono={formData.clientPhone?.toString() || ''}
            propertyId={formData.propertyId?.toString() || ''}
            propertyDirection={formData.propertyDirection}
            propertyPrice={formData.propertyPrice?.toString() || ''}
            propertyPriceCode={formData.propertyPriceCode}
            propertyCity={formData.propertyCity}
            propertyRegion={formData.propertyRegion}
            day={dayStart}
            month={monthStart}
            year={yearStart}
            hour={hora}
          />,
          `orden-visita-${formData.clientRut || 'cliente'}.pdf`
        )
        
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  return (
    <div id="scroll-target" className="bg-gray-100/80 dark:bg-gray-700 p-5 rounded-lg">
      <NotImagesAlert />
      <div className="flex items-center justify-between mb-4">
        <h3>Crear Visita</h3>
        <Button
          size="sm"
          variant="solid"
          icon={<HiArrowLeft />}
          onClick={handleBackNavigation}
        >
          Regresar
        </Button>
      </div>
      <div className="container mx-auto">
        <div className="w-full flex flex-col lg:flex-row gap-5">
          <div className="w-full ">{/* xl:w-1/2 */}
            {/* Formulario para ingresar campos y descargar pdf*/}
            <PdfForm submit={onSubmit} propertyId={data?.id}></PdfForm>
          </div>

        </div>
        <div className="h-0"></div>
        {/* <div id="publicar" className="my-4">
          <Card className="w-full lg:w-[100%] border-t-4 border-t-lime-400 dark:border-t-lime-400">
            <PDFViewer className='w-full min-h-screen'>
              <OrdenDeVisitaPDF 
                nombre={formDataPDF.nombre}
                rut={formDataPDF.rut}
                correo={formDataPDF.correo}
                telefono={formDataPDF.telefono}
                propertyId={formDataPDF.propertyId}
                propertyDirection={formDataPDF.propertyDirection}
                propertyPrice={formDataPDF.propertyPrice}
                propertyPriceCode={formDataPDF.propertyPriceCode}
              />
            </PDFViewer>
          </Card>
        </div> */}
      </div>
    </div>
  )
}

export default PdfGenerate
