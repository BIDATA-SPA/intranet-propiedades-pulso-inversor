/* eslint-disable @typescript-eslint/no-explicit-any */
import AmbientesCasaFields from './Casa/AmbientesFileds'
import PrincipalCasaFields from './Casa/PrincipalFields'

type PropertyType =
  | 'Casa'
  | 'Departamento'
  | 'Parcela'
  | 'Bodega'
  | 'Oficina'
  | 'Estacionamiento'
  | 'Terreno'
  | 'Industrial'
  | 'Local Comercial'
  | 'Agrícola'
  | 'Sitio'
  | 'Departamento Amoblado'
  | 'Casa Amoblada'
  | 'Sepultura'
  | string

interface FieldNameProps {
  propertyTypeId: PropertyType
  values?: any
}

const FormSwitcher = ({ propertyTypeId = '', values = '' }: FieldNameProps) => {
  switch (propertyTypeId) {
    case 'Casa':
      return (
        <>
          <PrincipalCasaFields />
          <AmbientesCasaFields />
        </>
      )
    case 'Departamento':
      return <>Departamento Fields</>

    default:
      break
  }
}

export default FormSwitcher
