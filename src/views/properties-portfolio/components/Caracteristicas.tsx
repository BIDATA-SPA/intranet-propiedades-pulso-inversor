/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import { injectReducer } from '@/store'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { Caracteristicas as CaracteristicasType } from '../store'
import reducer, { useAppSelector } from '../store'
import FormSwitcher from './form-amenities/FormSwitcher'

injectReducer('accountDetailForm', reducer)

type FormModel = CaracteristicasType

type CaracteristicasProps = {
  data: CaracteristicasType
  onNextChange?: (
    values: FormModel,
    formName: string,
    setSubmitting: (isSubmitting: boolean) => void
  ) => void
  onBackChange?: () => void
  currentStepStatus?: string
}

const validationSchema = Yup.object().shape({
  externalLink: Yup.string()
    .nullable()
    .notRequired()
    .url('Debe ser una URL válida.'),
  highlighted: Yup.boolean(),
  observations: Yup.string()
    .nullable()
    .notRequired()
    .max(5120, 'No puede exceder los 5120 caracteres.'),
  characteristics: Yup.object().shape({
    locatedInCondominium: Yup.boolean(),
    surface: Yup.number()
      .typeError('Debe ser un número válido.')
      .min(0, 'No se aceptan valores negativos.'),
    constructedSurface: Yup.number()
      .typeError('Debe ser un número válido.')
      .min(0, 'No se aceptan valores negativos.'),

    numberOfVacantFloors: Yup.number()
      .optional()
      .nullable()
      .typeError('Debe ser un número válido.')
      .min(0, 'No se aceptan valores negativos.'),
    numberOfMeetingRooms: Yup.number()
      .optional()
      .nullable()
      .typeError('Debe ser un número válido.')
      .min(0, 'No se aceptan valores negativos.'),
    hasKitchenet: Yup.boolean().nullable(),
    officeNumber: Yup.number()
      .typeError('Debe ser un número válido.')
      .min(0, 'No se aceptan valores negativos.')
      .optional()
      .nullable(),
    floorLevelLocation: Yup.string().nullable().notRequired(),

    commonExpenses: Yup.string().nullable().notRequired(),
    floors: Yup.string().nullable().notRequired(),
    numberOfFloors: Yup.string().nullable().notRequired(),
    terraces: Yup.string().nullable().notRequired(),
    terraceM2: Yup.number()
      .optional()
      .nullable()
      .typeError('Debe ser un número válido.')
      .min(0, 'No se aceptan valores negativos.'),
    bathrooms: Yup.string().nullable().notRequired(),
    bedrooms: Yup.string().nullable().notRequired(),
    hasKitchen: Yup.boolean(),
    typeOfKitchen: Yup.string().nullable().notRequired(),
    hasHeating: Yup.boolean(),
    typeOfSecurity: Yup.array().optional(),
    isFurnished: Yup.boolean(),
    hasAirConditioning: Yup.boolean(),
    hasGarage: Yup.boolean(),
    numberOfParkingSpaces: Yup.string().nullable().notRequired(),
    hasParking: Yup.boolean(),
    hasElevator: Yup.boolean(),
    hasGym: Yup.boolean(),
    hasSwimmingPool: Yup.boolean(),
    hasBarbecueArea: Yup.boolean(),
    propertyTitle: Yup.string()
      .required('Esta campo es requerido.')
      .min(20, 'El largo mínimo es de 20 caracteres.')
      .max(250, 'No puede exceder los 250 caracteress.'),
    propertyDescription: Yup.string()
      .required('Esta campo es requerido.')
      .min(20, 'El largo mínimo es de 20 caracteres.')
      .max(5120, 'No puede exceder los 5120 caracteres.'),
  }),
  // locatedInGallery: Yup.boolean().nullable(), ⚠️ no esta en la api
  // locatedFacingTheStreet: Yup.boolean().nullable(), ⚠️ no esta en la api
  // numberOfPrivate: Yup.number()
  //   .optional()
  //   .nullable()
  //   .typeError('Debe ser un número válido.')
  //   .min(0, 'No se aceptan valores negativos.'), ⚠️ no esta en la api
})

const Caracteristicas = ({
  data = {
    externalLink: '',
    highlighted: false,
    propertyStatusId: 4,
    observations: '',
    disableReason: '',
    characteristics: {
      rol: '', // ✅
      locatedInCondominium: false, //✅
      numberOfVacantFloors: '', //✅
      numberOfMeetingRooms: '', //✅
      hasKitchenet: false, // ✅
      hasHouse: false, //✅
      officeNumber: '', //✅
      floorLevelLocation: '', //✅
      commonExpenses: '', //✅
      numberOfFloors: '', //✅
      terraces: '', //✅
      terraceM2: '', //✅
      bathrooms: '', //✅
      bedrooms: '', //✅
      surfaceUnit: 'm2', //✅
      typeOfKitchen: '', //✅
      hasHeating: false, //✅
      numberOfParkingSpaces: '', //✅
      hasSecurity: false, //✅
      typeOfSecurity: [], //✅
      isFurnished: false, //✅
      hasAirConditioning: false, //✅
      hasGarage: false, // ✅
      hasParking: false, //✅
      hasElevator: false, //✅
      hasGym: false, //✅
      hasSwimmingPool: false, //✅
      hasBarbecueArea: false, //✅
      propertyTitle: '', //✅
      propertyDescription: '', //✅
      hasKitchen: false, //✅
      surface: '', //✅
      constructedSurface: '', //✅
      hasServiceRoom: false, //✅
      hasLivingRoom: false, //✅
      floorNumber: 0, //✅
      geography: '', //✅
      storageCount: 0, //✅
      ceilingType: '', //✅
      flooringType: '', //✅
      unitNumber: '', //✅
      hasHomeOffice: false, //✅
      hasDiningRoom: false, //✅
      hasYard: false, //✅
      hasGuestBathroom: false, //✅
      hasSuite: false, //✅
      hasWalkInCloset: false, //✅
      hasPlayRoom: false, //✅
      hasPlayground: false, //✅
      hasFireplace: false, //✅
      hasPaddleCourt: false, //✅
      hasPartyRoom: false, //✅
      hasSoccerField: false, //✅
      hasTennisCourt: false, //✅
      hasBasketballCourt: false, //✅
      contactHours: '', //✅
      yearOfConstruction: 0, //✅
      hasJacuzzi: false, //✅
      hasHorseStable: false, //✅
      landShape: '', //✅
      distanceToAsphalt: 0, //✅
      has24hConcierge: false, //✅
      hasInternetAccess: false, //✅
      hasNaturalGas: false, //✅
      hasRunningWater: false, //✅
      hasTelephoneLine: false, //✅
      hasSewerConnection: false, //✅
      hasElectricity: false, //✅
      hasMansard: false, //✅
      hasBalcony: false, //✅
      hasClosets: false, //✅
      hasVisitorParking: false, //✅
      hasGreenAreas: false, //✅
      hasMultiSportsCourt: false, //✅
      hasRefrigerator: false, //✅
      hasCinemaArea: false, //✅
      hasSauna: false, //✅
      houseType: '', //✅
      apartmentType: '', //✅
      unitsPerFloor: 0, //✅
      hasLaundryRoom: false, //✅
      hasMultipurposeRoom: false, //✅
      petsAllowed: false, //✅
      isCommercialUseAllowed: false, //✅
      condominiumClosed: false, //✅
      hasConcierge: false, //✅
      hasWasherConnection: false, //✅
      hasElectricGenerator: false, //✅
      hasSolarEnergy: false, //✅
      hasCistern: false, //✅
      hasBolier: false, //✅
      buildingName: '', //✅
      buildingType: '', //✅
      hasSecondLevel: false, //✅
    },
  },
  onNextChange,
  onBackChange,
  currentStepStatus,
}: CaracteristicasProps) => {
  const formData = useAppSelector(
    (state) => state.accountDetailForm.data.formData
  )

  // Get "Tipo de Inmueble"
  const typeOfPropertyId = formData.informacionPrincipal.typeOfPropertyId

  const onNext = (
    values: FormModel,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    onNextChange?.(values, 'caracteristicas', setSubmitting)
  }

  const onBack = () => {
    onBackChange?.()
  }

  return (
    <>
      <div className="mb-8">
        <h3 className="mb-2">Características</h3>
      </div>
      <Formik
        enableReinitialize
        initialValues={data}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true)
          setTimeout(() => {
            onNext(values, setSubmitting)
          }, 1000)
        }}
      >
        {({ values, touched, errors, isSubmitting }) => {
          return (
            <Form>
              <FormContainer>
                <FormSwitcher
                  typeOfPropertyId={typeOfPropertyId}
                  values={values}
                  touched={touched}
                  errors={errors}
                />

                <div className="flex justify-start gap-2">
                  <Button type="button" onClick={onBack}>
                    Volver
                  </Button>
                  <Button loading={isSubmitting} variant="solid" type="submit">
                    {currentStepStatus === 'complete' ? 'Guardar' : 'Siguiente'}
                  </Button>
                </div>
              </FormContainer>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default Caracteristicas
