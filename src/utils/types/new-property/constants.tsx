import { ReactNode } from 'react'
import { FaLocationDot } from 'react-icons/fa6'
import { MdOutlineAddHome } from 'react-icons/md'
import { RxPencil2 } from 'react-icons/rx'
import { TSelect } from './selects'

export const tabsList: {
  value?: number
  children?: string
  icon?: ReactNode | string
}[] = [
  {
    value: 0,
    children: 'Inf. principal',
    icon: <MdOutlineAddHome />,
  },
  { value: 1, children: 'Características', icon: <RxPencil2 /> },
  { value: 2, children: 'Ubicación', icon: <FaLocationDot /> },
]

export const tabsListEdit: {
  value?: number
  children?: string
  icon?: ReactNode | string
}[] = [
  {
    value: 0,
    children: 'Inf. principal',
    icon: <MdOutlineAddHome />,
  },
  { value: 1, children: 'Características', icon: <RxPencil2 /> },
  { value: 2, children: 'Ubicación', icon: <FaLocationDot /> },
]

export const tabsCustomersList: {
  value?: number
  children?: string
  icon?: ReactNode | string
}[] = [
  {
    value: 0,
    children: 'Inf. principal',
    icon: <MdOutlineAddHome />,
  },
  { value: 1, children: 'Inf. Ubicación', icon: <FaLocationDot /> },
]

export const listCustomer: TSelect[] = [
  { value: 'Admin test', label: 'Admin test' },
  { value: 'Cliente 1', label: 'Cliente 1' },
  { value: 'Cliente 2', label: 'Cliente 2' },
  { value: 'Cliente 3', label: 'Cliente 3' },
  { value: 'Cliente 4', label: 'Cliente 4' },
  { value: 'Cliente 5', label: 'Cliente 5' },
  { value: 'Cliente 6', label: 'Cliente 6' },
]

export const filterTypeOfOperation: TSelect[] = [
  { value: 'Compra', label: 'Compra' },
  { value: 'Venta', label: 'Venta' },
  { value: 'Arriendo', label: 'Arriendo' },
  { value: 'Arriendo temporal', label: 'Arriendo temporal' },
]

export const filterTypeOfProperty: TSelect[] = [
  { value: 'Casa', label: 'Casa' },
  { value: 'Departamento', label: 'Departamento' },
  { value: 'Parcela', label: 'Parcela' },
  { value: 'Bodega', label: 'Bodega ' },
  { value: 'Oficina', label: 'Oficina ' },
  { value: 'Estacionamiento', label: 'Estacionamiento ' },
  { value: 'Terreno', label: 'Terreno ' },
  { value: 'Industrial', label: 'Industrial ' },
  { value: 'Local Comercial', label: 'Local Comercial ' },
  { value: 'Agrícola', label: 'Agrícola ' },
  { value: 'Sitio', label: 'Sitio ' },
  { value: 'Departamento Amoblado', label: 'Departamento Amoblado' },
  { value: 'Casa Amoblada', label: 'Casa Amoblada' },
  { value: 'Sepultura', label: 'Sepultura' },
]

export const filterCurrencyType: TSelect[] = [
  { value: 'UF', label: 'UF - Unidad de Fomento' },
  { value: 'CLP', label: 'CLP - Peso chileno' },
]

export const surfaceUnit: TSelect[] = [{ value: 'M2', label: 'M2' }]

export const filterFloors: TSelect[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '+5', label: 'Más de 5' },
]

export const filterTerraces: TSelect[] = [
  { value: 'Frontal', label: 'Frontal' },
  { value: 'Trasera', label: 'Trasera' },
  { value: 'Ambas', label: 'Ambas' },
]

export const filterBathrooms: TSelect[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '+5', label: 'Más de 5' },
]

export const filterBedrooms: TSelect[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '+5', label: 'Más de 5' },
]

export const filterParkingSpaces: TSelect[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '+5', label: 'Más de 5' },
]

// export const filterTypeOfKitchens = [
//   { value: 'Tipo isla', label: 'Tipo isla' },
//   { value: 'Tipo forma en U', label: 'Tipo forma en U' },
//   { value: 'Tipo peninsula', label: 'Tipo peninsula' },
//   { value: 'Tipo en L', label: 'Tipo en L' },
//   { value: 'Tipo en linea', label: 'Tipo en linea' },
// ]

export const filterTypeOfKitchens = [
  { value: 'Tradicional', label: 'Tradicional' },
  { value: 'Abierta', label: 'Abierta' },
  { value: 'Americana', label: 'Americana' },
  { value: 'Otro', label: 'Otro' },
]

export const filterTypeOfHeating = [
  { value: 'Gas', label: 'Tipo gas' },
  { value: 'Tipo eléctrica', label: 'Tipo eléctrica' },
  {
    value: 'Tipo solar térmica o fotovoltaica',
    label: 'Tipo solar térmica o fotovoltaica',
  },
  { value: 'Tipo biomasa', label: 'Tipo biomasa' },
  { value: 'Tipo geotermia', label: 'Tipo geotermia' },
  { value: 'Tipo bosca o leña', label: 'Tipo bosca o leña' },
  { value: 'Tipo Calefacción mural', label: 'Tipo Calefacción mural' },
  { value: 'Tipo Calefacción central', label: 'Tipo Calefacción central' },
  { value: 'Tipo Chimenea', label: 'Tipo chimenea' },
  { value: 'Tipo radiadores', label: 'Tipo radiadores' },
  { value: 'Sin calefacción', label: 'Sin calefacción' },
]

export const filterTypeOfSecurity = [
  { value: 'Portero de Seguridad', label: 'Portero de Seguridad' },
  {
    value: 'Portón eléctrico y Cámara con altavoz',
    label: 'Portón eléctrico y Cámara con altavoz',
  },
  {
    value: 'Cámaras de seguridad interior - Forma remota',
    label: 'Cámaras de seguridad interior - Forma remota',
  },
  { value: 'Alarma comunitaria', label: 'Alarma comunitaria' },
  { value: 'Conserjería las 24hrs', label: 'Conserjería las 24hrs' },
  { value: 'Acceso controlado', label: 'Acceso controlado' },
]

// CLP Range Price
export const filterCLPPriceRange = [
  { value: 'Entre $25.000 a $50.000', label: 'Entre $25.000 a $50.000' },
  {
    value: 'Entre $50.000 a $100.000',
    label: 'Entre $50.000 a $100.000',
  },
  { value: 'Entre $100.000 a $150.000', label: 'Entre $100.000 a $150.000' },
  { value: 'Entre $150.000 a $200.000', label: 'Entre $150.000 a $200.000' },
]

export const filterCampaignStartDate = [
  { value: 'Hoy mismo', label: 'Hoy mismo' },
  {
    value: 'Dentro de 1 semana',
    label: 'Dentro de 1 semana',
  },
  { value: 'Dentro de 1 mes', label: 'Dentro de 1 mes' },
  { value: 'Dentro de 2 meses', label: 'Dentro de 2 meses' },
]

export const filterFloorLevel = [
  { value: '1', label: 'Primer piso' },
  { value: '2', label: 'Segundo piso' },
]
