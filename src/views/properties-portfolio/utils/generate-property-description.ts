// utils/propertyDescriptionGenerator.ts
type FormData = {
  personalInformation: any
  identification: any
  addressInformation: any
}

export function generatePropertyDescription(formData: FormData): string {
  const { personalInformation, identification, addressInformation } = formData
  const c = identification.characteristics
  const lines: string[] = []

  const tipoProp = personalInformation?.typeOfPropertyId ?? 'Propiedad'
  const tipoOperacion = personalInformation?.typeOfOperationId ?? 'Operación'

  lines.push(
    `En ${tipoOperacion.toLowerCase()}: ${tipoProp.toLowerCase()} ideal para quienes buscan confort y funcionalidad.`
  )

  if (c.surface) {
    lines.push(`Cuenta con una superficie total de ${c.surface} m²`)
  }

  if (c.constructedSurface) {
    lines.push(`y ${c.constructedSurface} m² construidos`)
  }

  lines[lines.length - 1] += '.'

  if (c.bedrooms) lines.push(`Dispone de ${c.bedrooms} dormitorio(s)`)
  if (c.bathrooms) lines.push(`y ${c.bathrooms} baño(s).`)

  if (c.hasKitchen) {
    const tipo = c.typeOfKitchen ? ` tipo ${c.typeOfKitchen.toLowerCase()}` : ''
    lines.push(`Cocina${tipo} equipada para su comodidad.`)
  }

  if (c.hasHeating) {
    const tipo = c.typeOfHeating
      ? ` mediante ${c.typeOfHeating.toLowerCase()}`
      : ''
    lines.push(`Sistema de calefacción${tipo}.`)
  }

  if (c.isFurnished)
    lines.push('La propiedad se encuentra completamente amoblada.')
  if (c.hasAirConditioning)
    lines.push('Cuenta con aire acondicionado para los días cálidos.')
  if (c.hasSwimmingPool)
    lines.push('Incluye una refrescante piscina para disfrutar en familia.')
  if (c.hasGym) lines.push('Además, cuenta con gimnasio totalmente equipado.')
  if (c.hasBarbecueArea)
    lines.push('Posee quincho ideal para reuniones sociales.')
  if (c.hasElevator) lines.push('El edificio dispone de ascensor.')
  if (c.hasGarage) lines.push('Incluye garage privado.')
  if (c.hasParking && c.numberOfParkingSpaces) {
    lines.push(`Dispone de ${c.numberOfParkingSpaces} estacionamiento(s).`)
  }

  if (c.terraces) {
    const metros = c.terraceM2 ? ` con una superficie de ${c.terraceM2} m²` : ''
    lines.push(`Cuenta con terraza${metros}.`)
  }

  if (c.locatedInCondominium)
    lines.push('Ubicada dentro de condominio con acceso controlado.')
  if (
    c.hasSecurity &&
    Array.isArray(c.typeOfSecurity) &&
    c.typeOfSecurity.length
  ) {
    const tipos = c.typeOfSecurity.map((s: any) => s.label || s).join(', ')
    lines.push(`Seguridad: ${tipos}.`)
  }

  // Dirección (si está disponible)
  const direccion = [
    addressInformation?.addressPublic,
    addressInformation?.address,
    addressInformation?.number,
    addressInformation?.cityId,
    addressInformation?.stateId,
    addressInformation?.countryId,
  ]
    .filter(Boolean)
    .join(', ')

  if (direccion) {
    lines.push(`Ubicación: ${direccion}.`)
  }

  if (personalInformation?.propertyPrice && personalInformation?.currencyId) {
    const formatter = new Intl.NumberFormat('es-CL')
    const price = formatter.format(personalInformation.propertyPrice)
    lines.push(
      `Precio de ${tipoOperacion.toLowerCase()}: ${price} ${
        personalInformation.currencyId
      }`
    )
  }

  return lines.join(' ')
}
