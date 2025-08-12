export const isStep1Complete = (values) => {
  const requiredFields = [
    'userId',
    'typeOfOperationId',
    'typeOfPropertyId',
    'currencyId',
  ]

  const isTextFieldsComplete = requiredFields.every(
    (field) => values[field] && values[field]?.trim() !== ''
  )

  const isCustomerIdComplete = values.customerId && !isNaN(values.customerId)

  const isPropertyPriceValid =
    typeof values.propertyPrice === 'number' && values.propertyPrice > 0

  return isTextFieldsComplete && isCustomerIdComplete && isPropertyPriceValid
}

export const isStep2Complete = (values) => {
  const { propertyTitle, propertyDescription } = values.characteristics
  return propertyTitle?.trim() !== '' && propertyDescription?.trim() !== ''
}

export const isStep3Complete = (values) => {
  const requiredFields = ['countryId', 'stateId', 'cityId', 'address']
  return requiredFields.every((field) => values[field] && values[field] !== 0)
}

export const isStep4Complete = () => {
  return true
}
