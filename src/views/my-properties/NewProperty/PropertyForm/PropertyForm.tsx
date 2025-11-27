/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Notification, Tabs, toast } from '@/components/ui'
import { FormContainer } from '@/components/ui/Form'
import TabContent from '@/components/ui/Tabs/TabContent'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import { useCreatePropertyMutation } from '@/services/RtkQueryService'
import { CreatePropertyFormModel } from '@/services/properties/types/property.type'
import { useAppSelector } from '@/store'
import { tabsList } from '@/utils/types/new-property/constants'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validationSchema } from '../schema'
import StepFormFour from './StepFormFour'
import StepFormOne from './StepFormOne'
import StepFormThree from './StepFormThree'
import StepFormTwo from './StepFormTwo'

export type FormModel = CreatePropertyFormModel

const RenderedTabs = () => {
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  if (userAuthority === 2)
    return tabsList.map(({ value, children, icon }) => (
      <TabNav key={value} value={value} icon={icon}>
        {children}
      </TabNav>
    ))

  if (userAuthority === 3)
    return tabsList
      .filter(({ value }) => value !== 3)
      .map(({ value, children, icon }) => (
        <TabNav key={value} value={value} icon={icon}>
          {children}
        </TabNav>
      ))

  if (userAuthority === 1) return null
}

const PropertyForm = () => {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const [createProperty, { isError, isSuccess, isLoading, error }] =
    useCreatePropertyMutation()
  const [userAuthority] = [useAppSelector((state) => state.auth.session.rol)]

  const onSubmit = async (values: FormModel, { setSubmitting }) => {
    const body = {
      ...values,
      step1: {
        ...values.step1,
        timeAvailable: {
          start: values.step1.timeAvailable?.start,
          end: values.step1.timeAvailable?.end,
        },
      },
      step2: {
        ...values.step2,
        characteristics: {
          ...values.step2.characteristics,
          commonExpenses: String(values.step2.characteristics?.commonExpenses),
          typeOfSecurity: values.step2.characteristics.typeOfSecurity.map(
            (type) => type.value
          ),
        },
      },
      step4: {
        ...values.step4,
        timeInExchange: {
          ...values.step4.timeInExchange,
          start: values.step4.timeInExchange?.start,
          end: values.step4.timeInExchange?.end,
        },
      },
    }

    try {
      setSubmitting(true)
      await createProperty(body).unwrap()

      openNotification('success', 'Creada!', 'Propiedad creada exitosamente', 3)
      setSubmitting(false)

      if (userAuthority === 2) {
        setTimeout(() => {
          navigate(`/mis-propiedades`)
        }, 1 * 3000)
      }

      if (userAuthority === 3) {
        setTimeout(() => {
          navigate(`/dashboard`)
        }, 1 * 3000)
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  const onNext = (e) => {
    e.preventDefault()
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const onPrevious = (e) => {
    e.preventDefault()
    if (step > 0) {
      setStep(step - 1)
    }
  }

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

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Propiedad Creada',
        'Propiedad creada correctamente',
        3
      )

      if (userAuthority === 2) {
        setTimeout(() => {
          navigate(`/mis-propiedades`)
        }, 1 * 1000)
      }

      if (userAuthority === 3) {
        setTimeout(() => {
          navigate(`/dashboard`)
        }, 1 * 1000)
      }
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError)
      openNotification(
        'danger',
        'Error',
        'Ha ocurrido un error al publicar esta propiedad',
        3
      )
  }, [isError])

  useEffect(() => {
    if (error) openNotification('danger', 'Error', `Error desconocido`, 3)
  }, [error])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])

  const isStep1Complete = (values) => {
    return (
      values.step1.customerId &&
      values.step1.typeOfOperationId &&
      values.step1.typeOfPropertyId &&
      values.step1.currencyId &&
      Number.isFinite(values.step1.propertyPrice) &&
      values.step1.propertyPrice > 0
    )
  }

  const isStep2Complete = (values) => {
    return values.step2.characteristics.propertyTitle
  }

  const isStep3Complete = (values) => {
    return (
      values.step3.countryId !== null &&
      values.step3.stateId !== null &&
      values.step3.cityId !== null &&
      values.step3.addressPublic
    )
  }

  const isStep4Complete = (values) => {
    // Asumiendo que el paso 4 puede no tener campos obligatorios.
    return true // Siempre devuelve true si no hay campos obligatorios.
  }

  const isLastStep = () => {
    return step === 3 // Si tienes 4 pasos (0, 1, 2, 3), el último paso sería el número 3.
  }

  return (
    <Formik
      initialValues={{
        step1: {
          customerId: userAuthority === 3 ? userAuthority : null,
          typeOfOperationId: null,
          timeAvailable: {
            start: null,
            end: null,
          },
          typeOfPropertyId: null,
          currencyId: null,
          propertyPrice: 0,
        },
        step2: {
          highlighted: false,
          observations: '',
          externalLink: '',
          characteristics: {
            surface: '',
            constructedSurface: '',
            surfaceUnit: '',
            floors: '',
            numberOfFloors: '',
            terraces: '',
            bathrooms: '',
            bedrooms: '',
            hasKitchen: false,
            typeOfKitchen: '',
            hasHeating: false,
            typeOfHeating: '',
            hasAirConditioning: false,
            hasParking: false,
            hasGarage: false,
            numberOfParkingSpaces: '',
            hasElevator: false,
            hasGym: false,
            hasSwimmingPool: false,
            hasSecurity: false,
            typeOfSecurity: [],
            locatedInCondominium: false,
            isFurnished: false,
            hasBarbecueArea: false,
            propertyTitle: '',
            propertyDescription: '',
            numberOfPrivate: '',
            numberOfVacantFloors: '',
            numberOfMeetingRooms: '',
            hasKitchenet: false,
            hasHouse: false,
            locatedInGallery: false,
            locatedFacingTheStreet: false,
            floorLevelLocation: '',
            officeNumber: '',
            commonExpenses: '',
          },
        },
        step3: {
          countryId: null,
          stateId: null,
          cityId: null,
          address: '',
          number: '',
          letter: '',
          references: '',
          addressPublic: '',
        },
        step4: {
          isExchanged: userAuthority === 3 ? true : false,
          timeInExchange: {
            start: userAuthority === 3 ? new Date() : null,
            end:
              userAuthority === 3
                ? new Date(new Date().setDate(new Date().getDate() + 30))
                : null,
          },
          propertyDescriptionInExchange: '',
        },
      }}
      validationSchema={validationSchema}
      validateOnMount={true}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, setValues, setFieldValue }) => {
        return (
          <>
            <Tabs value={step}>
              <TabList className="flex flex-row">{RenderedTabs()}</TabList>
              <div className="p-6 flex flex-col">
                <Form>
                  <FormContainer>
                    <TabContent value={0}>
                      <StepFormOne
                        values={values}
                        touched={touched}
                        errors={errors}
                        setValues={setValues}
                        setFieldValue={setFieldValue}
                      />
                    </TabContent>
                    <TabContent value={1}>
                      <StepFormTwo
                        values={values}
                        touched={touched}
                        errors={errors}
                        setValues={setValues}
                        setFieldValue={setFieldValue}
                      />
                    </TabContent>
                    <TabContent value={2}>
                      <StepFormThree
                        values={values}
                        touched={touched}
                        errors={errors}
                        setFieldValue={setFieldValue}
                      />
                    </TabContent>
                    <TabContent value={3}>
                      <StepFormFour
                        values={values}
                        touched={touched}
                        errors={errors}
                        setValues={setValues}
                      />
                    </TabContent>
                  </FormContainer>

                  <div className="flex justify-end gap-4">
                    {step > 0 && <Button onClick={onPrevious}>Atrás</Button>}

                    {userAuthority === 3 && step === 2 ? (
                      <Button
                        type="submit"
                        variant="solid"
                        disabled={!isStep3Complete(values)}
                        loading={isLoading}
                      >
                        Publicar
                      </Button>
                    ) : isLastStep() ? (
                      <Button
                        type="submit"
                        variant="solid"
                        disabled={!isStep4Complete(values)}
                        loading={isLoading}
                      >
                        Publicar
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="solid"
                        disabled={
                          step === 0
                            ? !isStep1Complete(values)
                            : step === 1
                            ? !isStep2Complete(values)
                            : step === 2
                            ? !isStep3Complete(values)
                            : !isStep4Complete(values)
                        }
                        onClick={onNext}
                      >
                        Siguiente
                      </Button>
                    )}
                  </div>

                  {/* <div className="flex justify-end gap-4">
                    {step > 0 && <Button onClick={onPrevious}>Atrás</Button>}
                    {isLastStep() ? (
                      <Button
                        type="submit"
                        variant="solid"
                        disabled={!isStep4Complete(values)}
                        loading={isLoading}
                      >
                        Publicar
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        variant="solid"
                        disabled={
                          step === 0
                            ? !isStep1Complete(values)
                            : step === 1
                            ? !isStep2Complete(values)
                            : step === 2
                            ? !isStep3Complete(values)
                            : !isStep4Complete(values)
                        }
                        onClick={onNext}
                      >
                        Siguiente
                      </Button>
                    )}
                  </div> */}
                </Form>
              </div>
            </Tabs>
          </>
        )
      }}
    </Formik>
  )
}

export default PropertyForm
