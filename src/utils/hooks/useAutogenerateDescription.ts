import { ISelectOption } from '@/services/properties/types/property.type'
import { useCallback } from 'react'
import { formatThousands } from '../formatCurrency'

interface ICharacteristics {
  surface?: string
  constructedSurface?: string
  floors?: string
  terraces?: string
  bathrooms?: string
  bedrooms?: string
  hasKitchen?: boolean
  typeOfKitchen?: string
  hasHeating?: boolean
  typeOfHeating?: string
  hasAirConditioning?: boolean
  hasGarage?: boolean
  hasParking?: boolean
  hasElevator?: boolean
  hasGym?: boolean
  hasSwimmingPool?: boolean
  hasSecurity?: boolean
  typeOfSecurity?: ISelectOption[]
  locatedInCondominium?: boolean
  isFurnished?: boolean
  hasBarbecueArea?: boolean
  propertyTitle?: string
  propertyDescription?: string
  hasHouse?: boolean
  numberOfPrivate?: string
  numberOfVacantFloors?: string
  numberOfMeetingRooms?: string
  hasKitchenet?: boolean
  officeNumber?: string
  floorLevelLocation?: string
  locatedInGallery?: boolean
  locatedFacingTheStreet?: boolean
  commonExpenses?: string
}

interface Step2 {
  highlighted?: boolean
  isActive?: boolean
  observations?: string
  characteristics: ICharacteristics
}

type SetValuesFunction = (updateFunction: (prevValues: Step2) => Step2) => void

const useGeneratePropertyDescription = (
  step2: Step2,
  setValues: SetValuesFunction
) => {
  const generateDescription = useCallback(() => {
    const {
      isActive,
      characteristics: {
        surface,
        constructedSurface,
        floors,
        terraces,
        bathrooms,
        bedrooms,
        hasKitchen,
        typeOfKitchen,
        hasHeating,
        typeOfHeating,
        hasAirConditioning,
        hasGarage,
        hasParking,
        hasElevator,
        hasGym,
        hasSwimmingPool,
        hasSecurity,
        typeOfSecurity,
        locatedInCondominium,
        isFurnished,
        hasBarbecueArea,
        hasHouse,
        numberOfPrivate,
        numberOfVacantFloors,
        numberOfMeetingRooms,
        hasKitchenet,
        officeNumber,
        floorLevelLocation,
        locatedInGallery,
        locatedFacingTheStreet,
        commonExpenses,
      },
    } = step2

    const parts = [
      isActive ? 'Propiedad activa.' : '',
      locatedInCondominium ? 'Ubicada en condominio.' : '',
      surface && constructedSurface
        ? `Superficie de ${surface} m² y construcción de ${constructedSurface} m².`
        : '',
      floors ? `Distribuida en ${floors} piso(s).` : '',
      terraces === 'Ambas' ? 'Terrazas en ambos lados.' : '',
      bathrooms || bedrooms
        ? `Cuenta con ${bathrooms || '0'} baño(s) y ${
            bedrooms || '0'
          } dormitorio(s).`
        : '',
      hasKitchen && `Cocina ${typeOfKitchen || ''}.`,
      hasHeating && `Sistema de calefacción ${typeOfHeating || ''}.`,
      hasAirConditioning ? 'Aire acondicionado.' : '',
      hasGarage ? 'Garaje.' : '',
      hasParking ? 'Estacionamiento.' : '',
      hasElevator ? 'Ascensor.' : '',
      hasGym ? 'Gimnasio.' : '',
      hasSwimmingPool ? 'Piscina.' : '',
      hasSecurity
        ? `Seguridad: ${typeOfSecurity?.map((type) => type.label).join(', ')}`
        : '',
      isFurnished ? 'Amueblada.' : '',
      hasBarbecueArea ? 'Con área de quincho.' : '',
      hasHouse ? 'Incluye casa en la parcela.' : '',
      numberOfPrivate ? `Número de privados: ${numberOfPrivate}.` : '',
      numberOfVacantFloors ? `Pisos vacantes: ${numberOfVacantFloors}.` : '',
      numberOfMeetingRooms
        ? `Salas de reuniones: ${numberOfMeetingRooms}.`
        : '',
      hasKitchenet ? 'Con kitchenette.' : '',
      officeNumber ? `Número de oficina: ${`#${officeNumber}`}.` : '',
      floorLevelLocation ? `Ubicada en el nivel ${floorLevelLocation}.` : '',
      locatedInGallery ? 'Ubicada en galería.' : '',
      locatedFacingTheStreet ? 'Situada frente a la calle.' : '',
      commonExpenses
        ? `Gastos comunes: $${formatThousands(commonExpenses)}.`
        : '',
    ]
      .filter(Boolean)
      .join(' ')

    setValues((prevValues) => ({
      ...prevValues,
      characteristics: {
        ...prevValues.characteristics,
        propertyDescription:
          parts ||
          'Esta propiedad no cuenta con características seleccionadas.',
      },
    }))
  }, [step2, setValues])

  return generateDescription
}

export default useGeneratePropertyDescription
