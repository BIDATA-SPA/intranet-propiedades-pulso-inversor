import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import DatePicker from '@/components/ui/DatePicker'
import FormItem from '@/components/ui/Form/FormItem'
import Input from '@/components/ui/Input'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useUpdatePropertyMutation } from '@/services/RtkQueryService'
import { useEffect, useState } from 'react'
import { Property } from '../../store/types'

interface UpdateExchangeFormProps {
  onClose: () => void
  property: Property
}

const UpdateExchangeForm = ({ onClose, property }: UpdateExchangeFormProps) => {
  const initialState = {
    step1: {
      customerId: property?.customer?.id,
      typeOfOperationId: property?.typeOfOperationId,
      timeAvailable: {
        start: property?.timeAvailableStart,
        end: property?.timeAvailableEnd,
      },
      typeOfPropertyId: property?.typeOfPropertyId,
      currencyId: property?.currencyId,
      propertyPrice: property?.propertyPrice,
    },
    step2: {
      highlighted: property?.highlighted,
      observations: property?.observations,
      characteristics: {
        surface: property?.characteristics?.surface,
        constructedSurface: property?.characteristics?.constructedSurface,
        floors: property?.characteristics?.floors,
        numberOfFloors: property?.characteristics?.numberOfFloors,
        terraces: property?.characteristics?.terraces,
        bathrooms: property?.characteristics?.bathrooms,
        bedrooms: property?.characteristics?.bedrooms,
        hasKitchen: property?.characteristics?.hasKitchen,
        typeOfKitchen: property?.characteristics?.typeOfKitchen,
        hasHeating: property?.characteristics?.hasHeating,
        typeOfHeating: property?.characteristics?.typeOfHeating,
        hasAirConditioning: property?.characteristics?.hasAirConditioning,
        hasParking: property?.characteristics?.hasParking,
        hasGarage: property?.characteristics?.hasGarage,
        numberOfParkingSpaces: property?.characteristics?.numberOfParkingSpaces,
        hasElevator: property?.characteristics?.hasElevator,
        hasGym: property?.characteristics?.hasGym,
        hasSwimmingPool: property?.characteristics?.hasSwimmingPool,
        hasSecurity: property?.characteristics?.hasSecurity,
        typeOfSecurity: property?.characteristics?.typeOfSecurity,
        locatedInCondominium: property?.characteristics?.locatedInCondominium,
        isFurnished: property?.characteristics?.isFurnished,
        hasBarbecueArea: property?.characteristics?.hasBarbecueArea,
        propertyTitle: property?.propertyTitle,
        propertyDescription: property?.propertyDescription,
      },
    },
    step3: {
      countryId: property?.address?.country?.id,
      stateId: property?.address?.state?.id,
      cityId: property?.address?.city?.id,
      address: property?.address?.address,
      number: property?.address?.number,
      letter: property?.address?.letter,
      references: property?.address?.references,
    },
    step4: {
      isExchanged: property?.isExchanged,
      timeInExchange: {
        start: property?.timeInExchangeStart,
        end: property?.timeInExchangeEnd,
      },
      propertyDescriptionInExchange: property?.propertyDescriptionInExchange,
    },
  }

  const [propertyData, setPropertyData] = useState(initialState)
  const [updateProperty, { isLoading, isError, error, isSuccess }] =
    useUpdatePropertyMutation()

  const openNotification = (
    type: 'success' | 'warning' | 'danger' | 'info',
    title: string,
    text: string,
    duration = 5
  ) => {
    toast.push(
      <Notification title={title} type={type} duration={duration * 1000}>
        {text}
      </Notification>,
      { placement: 'top-center' }
    )
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const body = { ...propertyData }
    try {
      const { data } = await updateProperty({
        id: property?.id,
        ...body,
      }).unwrap()
      if (data) {
        openNotification(
          'success',
          '¡Actualizada!',
          'Propiedad en Canje actualizada exitosamente',
          3
        )
        onClose()
      }
    } catch (error) {
      openNotification('danger', '¡Error!', `${error.message}`, 3)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        '¡Éxito!',
        'Propiedad en Canje actualizada exitosamente',
        4
      )
      onClose()
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError && error) {
      openNotification('danger', '¡Error!', `${error.message}`, 4)
    }
  }, [isError, error])

  const handleDateChange = (field: string, date: Date | null) => {
    setPropertyData((prevState) => ({
      ...prevState,
      step4: {
        ...prevState.step4,
        timeInExchange: {
          ...prevState.step4.timeInExchange,
          [field]: date,
        },
      },
    }))
  }

  useEffect(() => {
    if (!propertyData.step4.isExchanged) {
      setPropertyData((prevState) => ({
        ...prevState,
        step4: {
          ...prevState.step4,
          timeInExchange: {
            start: null,
            end: null,
          },
          propertyDescriptionInExchange: '',
        },
      }))
    }
  }, [propertyData.step4.isExchanged])

  return (
    <div>
      <div className="text-right mt-6 p-2">
        <div className="flex flex-col items-start justify-start text-start w-full overflow-y-scroll">
          <form className="px-4" onSubmit={onSubmit}>
            <div className="mb-8">
              <div className="card card-border" role="presentation">
                <div className="card-body flex flex-col lg:flex-row items-center w-full gap-4">
                  <div className="flex flex-col items-start justify-start text-start w-full">
                    <div className="flex flex-col md:flex-row">
                      <h6>Habilitar esta propiedad como canje</h6>
                      <div
                        className={`${
                          propertyData?.step4?.isExchanged
                            ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-100'
                            : 'bg-yellow-50 text-yellow-500 dark:bg-yellow-500/20 dark:text-emerald-100'
                        } tag flex justify-center items-center rounded-md border-0 mx-0 my-1 md:my-0 md:mx-2 w-20 text-center`}
                      >
                        <span className="uppercase">
                          {propertyData?.step4?.isExchanged
                            ? 'Activa'
                            : 'Inactiva'}
                        </span>
                      </div>
                    </div>

                    <div className="w-full">
                      <p className="text-gray-400">
                        Al habilitar esta propiedad como canje, esta será parte
                        de la búsqueda de otros corredores.
                      </p>
                    </div>
                  </div>

                  <FormItem>
                    <Checkbox.Group>
                      <Checkbox
                        className="my-3"
                        checked={propertyData?.step4?.isExchanged}
                        onChange={(e) => {
                          setPropertyData((prevState) => ({
                            ...prevState,
                            step4: {
                              ...prevState.step4,
                              isExchanged: e,
                            },
                          }))
                        }}
                      >
                        Activar
                      </Checkbox>
                    </Checkbox.Group>
                  </FormItem>
                </div>
              </div>
            </div>

            {propertyData?.step4?.isExchanged && (
              <>
                <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
                  <FormItem asterisk label="Desde">
                    <DatePicker
                      locale="es"
                      placeholder="Seleccionar una fecha de inicio"
                      value={propertyData.step4?.timeInExchange?.start}
                      onChange={(date) => handleDateChange('start', date)}
                    />
                  </FormItem>

                  <FormItem asterisk label="Hasta">
                    <DatePicker
                      locale="es"
                      placeholder="Seleccionar una fecha de fin"
                      value={propertyData.step4?.timeInExchange.end}
                      onChange={(date) => handleDateChange('end', date)}
                    />
                  </FormItem>
                </div>

                <div className="w-full">
                  <FormItem label="Descripción de la Propiedad en Canje">
                    <Input
                      textArea
                      size="md"
                      placeholder="Ingresar una descripción de la propiedad en canje..."
                      value={propertyData.step4.propertyDescriptionInExchange}
                      onChange={(e) => {
                        setPropertyData((prevState) => ({
                          ...prevState,
                          step4: {
                            ...prevState.step4,
                            propertyDescriptionInExchange: e.target.value,
                          },
                        }))
                      }}
                    />
                  </FormItem>
                </div>
              </>
            )}

            <div className="w-full flex justify-end items-center">
              <Button
                className="ltr:mr-2 rtl:ml-2"
                variant="plain"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button
                variant="solid"
                type="submit"
                className="m-2"
                loading={isLoading}
              >
                {!property?.isExchanged && 'Habilitar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateExchangeForm
