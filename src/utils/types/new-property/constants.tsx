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

export const filterGeography: TSelect[] = [
  { value: 'Campo', label: 'Campo' },
  { value: 'Ciudad', label: 'Ciudad' },
  { value: 'Lago', label: 'Lago' },
  { value: 'Montaña', label: 'Montaña' },
  { value: 'Mar', label: 'Mar' },
  { value: 'Río', label: 'Río' },
]

export const filterLandShape: TSelect[] = [
  { value: 'Plano', label: 'Plano' },
  { value: 'Casi plano', label: 'Casi plano' },
  { value: 'Semi plano', label: 'Semi plano' },
  { value: 'Pendiente suave', label: 'Pendiente suave' },
  { value: 'Pendiente moderada', label: 'Pendiente moderada' },
  { value: 'Pendiente pronunciada', label: 'Pendiente pronunciada' },
  { value: 'Quebrado / irregular', label: 'Quebrado / irregular' },
  { value: 'Ondulado', label: 'Ondulado' },
  { value: 'En terrazas', label: 'En terrazas' },
  { value: 'Ladera', label: 'Ladera' },
  { value: 'Cima / cumbre', label: 'Cima / cumbre' },
  { value: 'Valle', label: 'Valle' },
  { value: 'Hondonada / depresión', label: 'Hondonada / depresión' },
  { value: 'Relleno (terreno nivelado)', label: 'Relleno (terreno nivelado)' },
]

export const filterLandShapeGround: TSelect[] = [
  { value: 'Regular', label: 'Regular' },
  { value: 'Irregular', label: 'Irregular' },
  { value: 'Plano', label: 'Plano' },
]

export const filterTypeOfFarm: TSelect[] = [
  { value: 'Frutícola', label: 'Frutícola' },
  { value: 'Agrícola', label: 'Agrícola' },
  { value: 'Chacra', label: 'Chacra' },
  { value: 'Criadero', label: 'Criadero' },
  { value: 'Tambero', label: 'Tambero' },
  { value: 'Floricultura', label: 'Floricultura' },
  { value: 'Forestal', label: 'Forestal' },
  { value: 'Ganadero', label: 'Ganadero' },
  { value: 'Haras', label: 'Haras' },
  { value: 'Otro', label: 'Otro' },
]

export const filterStorageCount: TSelect[] = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '+5', label: 'Más de 5' },
]

export const filterTypeOfBuilding: TSelect[] = [
  { value: 'Casa Comercial', label: 'Casa Comercial' },
  { value: 'Edificio Antiguo', label: 'Edificio Antiguo' },
  { value: 'Edificio Moderno', label: 'Edificio Moderno' },
  { value: 'Edificio Nuevo', label: 'Edificio Nuevo' },
]

export const filterCeilingType: TSelect[] = [
  { value: 'Cielo Falso', label: 'Cielo Falso' },
  { value: 'Cielo Losa', label: 'Cielo Losa' },
  { value: 'Pizarreño', label: 'Pizarreño' },
  { value: 'Teja', label: 'Teja' },
  { value: 'Teja Alerce', label: 'Teja Alerce' },
  { value: 'Teja Chilena', label: 'Teja Chilena' },
  { value: 'Zinc', label: 'Zinc' },
]

export const filterFlooringType: TSelect[] = [
  { value: 'Alfombrado', label: 'Alfombrado' },
  { value: 'Baldosas', label: 'Baldosas' },
  { value: 'Baldosín Cerámico', label: 'Baldosín Cerámico' },
  { value: 'Cerámica', label: 'Cerámica' },
  { value: 'Cubre Pisos', label: 'Cubre Pisos' },
  { value: 'Flexit', label: 'Flexit' },
  { value: 'Cemento Afinado', label: 'Cemento Afinado' },
  { value: 'Mármol ', label: 'Mármol' },
  { value: 'Mixto', label: 'Mixto' },
  { value: 'Piso Flotante', label: 'Piso Flotante' },
  { value: 'Porcelanato', label: 'Porcelanato' },
  { value: 'Parquet', label: 'Parquet' },
  { value: 'Piedra Pizarra', label: 'Piedra Pizarra' },
]
export const filterTypeOfHouse: TSelect[] = [
  { value: 'Dúplex ', label: 'Dúplex' },
  { value: 'Ph', label: 'Ph' },
  { value: 'Triplex', label: 'Triplex' },
  { value: 'Cabaña', label: 'Cabaña' },
  { value: 'Casa', label: 'Casa' },
  { value: 'Chalet', label: 'Chalet' },
]

export const filterUnitHeight: TSelect[] = [
  { value: 'm', label: 'm' },
  { value: 'cm', label: 'cm' },
]

export const filterUnitPricePerArea: TSelect[] = [
  { value: '$/ha', label: '$/ha' },
  { value: '$/m2', label: '$/m2' },
]

export const filterUnitFloorStand: TSelect[] = [
  { value: 't/m2', label: 't/m2' },
]

export const filterUnitCoveredHullAread: TSelect[] = [
  { value: 'm2', label: 'm2' },
]

export const filterTypeOfWinery: TSelect[] = [
  { value: 'Terreno', label: 'Terreno' },
  { value: 'Bodega', label: 'Bodega' },
  { value: 'Galpón', label: 'Galpón' },
  { value: 'Bodega Comercial', label: 'Bodega Comercial' },
  { value: 'Nave Industrial', label: 'Nave Industrial' },
  { value: 'Almacen', label: 'Almacen' },
]

export const filterOrientation: TSelect[] = [
  { value: 'DESCONOCIDA', label: 'Desconocida (No Usa)' },
  { value: 'NO', label: 'NO' },
  { value: 'SO', label: 'SO' },
  { value: 'SP', label: 'SP' },
  { value: 'NOSP', label: 'NOSP' },
  { value: 'S', label: 'S' },
  { value: 'P', label: 'P' },
  { value: 'O', label: 'O' },
]

export const filterTypeOfKitchens = [
  { value: 'Tradicional', label: 'Tradicional' },
  { value: 'Abierta', label: 'Abierta' },
  { value: 'Americana', label: 'Americana' },
  { value: 'Otro', label: 'Otro' },
]

export const filterAccessToParking = [
  { value: 'Rampa Fija', label: 'Rampa Fija' },
  { value: 'Rampa Móvil', label: 'Rampa Móvil' },
  { value: 'Ascensor', label: 'Ascensor' },
  { value: 'Horizontal', label: 'Horizontal' },
]

export const filterAccessToParkingCoverage = [
  { value: 'Semi Cubierta', label: 'Semi Cubierta' },
  { value: 'Cubierta', label: 'Cubierta' },
  { value: 'Descubierta', label: 'Descubierta' },
]

export const filterDepartmentType = [
  { value: 'Semi Piso', label: 'Semi Piso' },
  { value: 'Triplex', label: 'Triplex' },
  { value: 'Loft', label: 'Loft' },
  { value: 'Penthouse', label: 'OPenthouseo' },
  { value: 'Departamento', label: 'Departamento' },
  { value: 'Dúplex ', label: 'Dúplex' },
  { value: 'Monoambiente', label: 'Monoambiente' },
  { value: 'Ph', label: 'Ph' },
  { value: 'Piso', label: 'OPisoo' },
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
