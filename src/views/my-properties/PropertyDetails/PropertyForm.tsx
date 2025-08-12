import {
  Button,
  FormContainer,
  Notification,
  Tabs,
  toast,
} from '@/components/ui'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { useUpdatePropertyMutation } from '@/services/RtkQueryService'
import {
  CreatePropertyBody,
  CreatePropertyFormModel,
} from '@/services/properties/types/property.type'
import { useAppSelector } from '@/store'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { FaHandshake } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdOutlineAddHome } from 'react-icons/md'
import { RxPencil2 } from 'react-icons/rx'
import { useParams } from 'react-router-dom'
import StepFormFour from './StepFormFour'
import StepFormOne from './StepFormOne'
import StepFormThree from './StepFormThree'
import StepFormTwo from './StepFormTwo'

type FormModel = Partial<CreatePropertyFormModel>

const PropertyForm = ({
  initialValues,
}: {
  initialValues
  data
  step
  setStep
}) => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]
  const [updateProperty, { data, isSuccess, isError, error }] =
    useUpdatePropertyMutation()
  const { propertyId } = useParams()
  const [isLoading, setIsLoading] = useState(false)

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

  const onSubmit = async (values: FormModel) => {
    const {
      userId,
      customerId,
      typeOfOperationId,
      timeAvailable,
      typeOfPropertyId,
      currencyId,
      propertyPrice,
      timeInExchange,
      highlighted,
      isActive,
      observations,
      characteristics,
      propertyDescriptionInExchange,
      externalLink,
      address: {
        countryId,
        stateId,
        cityId,
        address,
        letter,
        number,
        references,
        addressPublic,
      },
    } = values

    const {
      surface,
      constructedSurface,
      surfaceUnit,
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
      locatedInCondominium,
      isFurnished,
      hasBarbecueArea,
      propertyTitle,
      propertyDescription,
      numberOfPrivate,
      numberOfVacantFloors,
      numberOfMeetingRooms,
      hasKitchenet,
      hasHouse,
      locatedInGallery,
      locatedFacingTheStreet,
      floorLevelLocation,
      officeNumber,
      commonExpenses,
    } = characteristics

    const normalizedTypeOfSecurity = characteristics?.typeOfSecurity || []

    const body: CreatePropertyBody = {
      step1: {
        userId,
        customerId,
        typeOfOperationId,
        timeAvailable: {
          start: timeAvailable?.start,
          end: timeAvailable?.end,
        },
        typeOfPropertyId,
        currencyId,
        propertyPrice,
      },
      step2: {
        highlighted,
        isActive,
        observations,
        externalLink,
        characteristics: {
          surface,
          constructedSurface,
          surfaceUnit,
          floors,
          terraces,
          bathrooms,
          bedrooms,
          hasKitchen,
          typeOfKitchen,
          hasHeating,
          typeOfHeating,
          hasAirConditioning,
          hasParking,
          hasGarage,
          hasElevator,
          hasGym,
          hasSwimmingPool,
          hasSecurity,
          typeOfSecurity: normalizedTypeOfSecurity,
          locatedInCondominium,
          isFurnished,
          hasBarbecueArea,
          propertyTitle,
          propertyDescription,

          numberOfPrivate,
          numberOfVacantFloors,
          numberOfMeetingRooms,
          hasKitchenet,
          hasHouse,
          locatedInGallery,
          locatedFacingTheStreet,
          floorLevelLocation,
          officeNumber,
          commonExpenses,
        },
      },
      step3: {
        countryId,
        stateId,
        cityId,
        address,
        letter,
        number,
        references,
        addressPublic,
      },
      step4: {
        isExchanged: values?.isExchanged,
        timeInExchange: {
          start: timeInExchange?.start,
          end: timeInExchange?.end,
        },
        propertyDescriptionInExchange,
      },
    }

    try {
      setIsLoading(true)
      await updateProperty({ id: propertyId, ...body }).unwrap()
    } catch (error) {
      throw new Error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Propiedad Actualizada',
        'Propiedad actualizada correctamente',
        3
      )
      setIsLoading(false)
    }
  }, [isSuccess, data])

  useEffect(() => {
    if (isError || error) {
      openNotification('danger', 'Error', `${error.message}`, 3)
      setIsLoading(false)
    }
  }, [isError, error])

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, setValues, setFieldValue }) => {
        return (
          <Tabs defaultValue="tab1">
            {/* <Tabs value={step}></Tabs> */}
            <TabList className="flex flex-row">
              <TabNav value="tab1" icon={<MdOutlineAddHome />}>
                Inf. Principal
              </TabNav>
              <TabNav value="tab2" icon={<RxPencil2 />}>
                Características
              </TabNav>
              <TabNav value="tab3" icon={<FaLocationDot />}>
                Ubicación
              </TabNav>
              {/* {userAuthority === 2 ? (
                <TabNav value="tab4" icon={<FaHandshake />}>
                  Canje
                </TabNav>
              ) : null} */}
            </TabList>

            <div className="flex flex-col h-[550px] overflow-y-scroll px-4 pt-4">
              <Form>
                <FormContainer className="relative">
                  <TabContent value="tab1">
                    <StepFormOne
                      values={values}
                      touched={touched}
                      errors={errors}
                      setValues={setValues}
                    />
                  </TabContent>

                  <TabContent value="tab2">
                    <StepFormTwo
                      values={values}
                      touched={touched}
                      errors={errors}
                      setValues={setValues}
                    />
                  </TabContent>

                  <TabContent value="tab3">
                    <StepFormThree
                      values={values}
                      touched={touched}
                      errors={errors}
                      setFieldValue={setFieldValue}
                    />
                  </TabContent>

                  {/* <TabContent value="tab4">
                    <StepFormFour
                      values={values}
                      touched={touched}
                      errors={errors}
                    />
                  </TabContent> */}
                  <div className="bottom-0 sticky z-10 w-100 bg-white dark:bg-gray-800 left-2 right-2 pt-5 flex justify-end">
                    <Button
                      type="submit"
                      className="mx-2"
                      variant="solid"
                      loading={isLoading}
                    >
                      Actualizar Propiedad
                    </Button>
                  </div>
                </FormContainer>
              </Form>
            </div>
          </Tabs>
        )
      }}
    </Formik>
  )
}

export default PropertyForm
