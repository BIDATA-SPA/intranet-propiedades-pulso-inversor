import { TCurrenciesLib, TDialogIds, TPropertyMatches } from './definitions'

const currenciesLib: TCurrenciesLib = { UF: 'UF', CLP: 'CLP', VZ: 'VZ' }

const propertyMatches: TPropertyMatches = {
  locatedInCondominium: 'En Condominio',
  hasSecurity: 'Seguridad',
  hasParking: 'Estacionamiento',
  typeOfOperationId: 'Tipo de operación',
  typeOfPropertyId: 'Tipo de Propiedad',
  propertyPrice: 'Precio',
  state: 'Región',
  bathrooms: 'Baños',
  hasSwimmingPool: 'Piscina',
  currencyId: 'Moneda',
  commune: 'Comuna',
  city: 'Ciudad',
  bedrooms: 'Dormitorios',
}

const dialogIds: TDialogIds = {
  images: 'imagesDialog',
  contact: 'contactDialog',
  contactExternalService: 'contactExternalServiceDialog',
}

export { currenciesLib, dialogIds, propertyMatches }
