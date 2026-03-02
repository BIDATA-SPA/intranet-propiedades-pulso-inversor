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
      //   locatedInGallery: false, ⚠️ no esta en la api
      //   numberOfPrivate: '', ⚠️ no esta en la api
      //   locatedFacingTheStreet: false ⚠️ no esta en la api
      //   typeOfHeating: '', ⚠️ no esta en la api
      //   floors: '', ⚠️ no esta en la api
      //   orientation: ⚠️ no esta en la api
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

                {/* <FormItem
                  label="Enlace de la propiedad publicada en otros portales (Enlace público)."
                  className="border-2 p-3 rounded-lg dark:border-gray-600"
                  invalid={errors.externalLink && touched.externalLink}
                  errorMessage={errors.externalLink}
                >
                  <Field name="externalLink">
                    {({ field, form }: FieldProps<FormModel>) => {
                      return (
                        <Input
                          prefix={<TbWorldSearch className="text-xl" />}
                          field={field}
                          type="text"
                          size="md"
                          className="mb-2 border-sky-500/60 border-[3px] rounded-lg"
                          placeholder="Ej: https://www.portalinmobiliario.com/detalles-de-mi-publicacion"
                          value={values.externalLink}
                          onChange={(e) => {
                            form.setFieldValue(field.name, e.target.value)
                          }}
                        />
                      )
                    }}
                  </Field>
                </FormItem> */}

                {/* PARCELA */}
                {/* {formData.informacionPrincipal.typeOfPropertyId ===
                  'Parcela' && <PlotFields values={values} />}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 md:grid-cols-2 md:gap-3 mt-4 place-content-center justify-items-center text-center">
                  <FormItem label="¿En condominio?">
                    <Field name="characteristics.locatedInCondominium">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={
                              values.characteristics?.locatedInCondominium
                            }
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.locatedInCondominium
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Destacar Propiedad">
                    <Field name="highlighted">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.highlighted}
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.highlighted
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div> */}

                {/* ✅ */}
                {/* 
                {userAuthority === 2 ? (
                  <div className="w-full">
                    <FormItem
                      label="Observación y/o detalles"
                      invalid={errors.observations && touched.observations}
                      errorMessage={errors.observations}
                    >
                      <Field name="observations">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Input
                              textArea
                              field={field}
                              size="md"
                              placeholder="Ingresa algo que necesita saber el comprador: Año de Propiedad, Ubicación cerca de..."
                              value={values?.observations}
                              onChange={(e) =>
                                form.setFieldValue(field.name, e.target.value)
                              }
                            />
                          )
                        }}
                      </Field>
                    </FormItem>
                  </div>
                ) : null} */}

                {/* <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
                  <FormItem
                    label="Superficie de terreno"
                    invalid={
                      errors.characteristics?.surface &&
                      touched.characteristics?.surface
                    }
                    errorMessage={errors.characteristics?.surface}
                  >
                    <Field name="characteristics.surface">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <InputGroup>
                            <Input
                              type="number"
                              field={field}
                              size="md"
                              placeholder="Ej: 200 - 100.5"
                              value={values.characteristics?.surface}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                            <Addon size="md">m2</Addon>
                          </InputGroup>
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem
                    label="Superficie construida"
                    invalid={
                      errors.characteristics?.constructedSurface &&
                      touched.characteristics?.constructedSurface
                    }
                    errorMessage={errors.characteristics?.constructedSurface}
                  >
                    <Field name="characteristics.constructedSurface">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <InputGroup>
                            <Input
                              type="number"
                              field={field}
                              size="md"
                              placeholder="Ej: 180 - 80.5"
                              value={values.characteristics?.constructedSurface}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                            <Addon size="md">m2</Addon>
                          </InputGroup>
                        )
                      }}
                    </Field>
                  </FormItem>
                </div> */}

                {/* OFICINA */}
                {/* {formData.informacionPrincipal?.typeOfPropertyId ===
                  'Oficina' && (
                  <OfficeFields
                    values={values}
                    errors={errors}
                    touched={touched}
                  />
                )} */}
                {/* OFICINA */}

                {/* LOCAL COMERCIAL */}
                {/* {formData.informacionPrincipal?.typeOfPropertyId ===
                  'Local Comercial' && (
                  <CommercialPremisesFields
                    values={values}
                    errors={errors}
                    touched={touched}
                  />
                )} */}
                {/* LOCAL COMERCIAL */}

                {/* <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
                  <FormItem
                    label="Número de pisos"
                    asterisk={
                      formData.informacionPrincipal.typeOfPropertyId ===
                        'Casa' ||
                      formData.informacionPrincipal.typeOfPropertyId ===
                        'Departamento'
                    }
                    invalid={
                      errors.characteristics?.numberOfFloors &&
                      touched.characteristics?.numberOfFloors
                    }
                  >
                    <Field name="characteristics.numberOfFloors">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Select
                            isClearable
                            field={field}
                            options={filterFloors}
                            placeholder="Seleccionar..."
                            value={filterFloors?.filter(
                              (option) =>
                                option.value ===
                                values.characteristics.numberOfFloors
                            )}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option?.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Terraza(s)">
                    <Field name="characteristics.terraces">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Select
                            isClearable
                            field={field}
                            options={filterTerraces}
                            placeholder="Seleccionar..."
                            value={filterTerraces?.filter(
                              (option) =>
                                option.value === values.characteristics.terraces
                            )}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option?.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem
                    label="M2 Terraza"
                    invalid={
                      errors.characteristics?.terraceM2 &&
                      touched.characteristics?.terraceM2
                    }
                    errorMessage={errors.characteristics?.terraceM2}
                  >
                    <Field name="characteristics.terraceM2">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <InputGroup>
                            <Input
                              type="number"
                              field={field}
                              size="md"
                              placeholder="Ej: 20 - 10.5"
                              value={values.characteristics?.terraceM2}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e.target.value)
                              }}
                            />
                            <Addon size="md">m2</Addon>
                          </InputGroup>
                        )
                      }}
                    </Field>
                  </FormItem>
                </div> */}

                {/* <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-3">
                  <FormItem label="Baño(s)">
                    <Field name="characteristics.bathrooms">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Select
                            isClearable
                            field={field}
                            options={filterBathrooms}
                            placeholder="Seleccionar..."
                            value={filterBathrooms?.filter(
                              (option) =>
                                option.value ===
                                values.characteristics.bathrooms
                            )}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option?.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Dormitorio(s)">
                    <Field name="characteristics.bedrooms">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Select
                            isClearable
                            field={field}
                            options={filterBedrooms}
                            placeholder="Seleccionar..."
                            value={filterBedrooms?.filter(
                              (option) =>
                                option.value ===
                                values.characteristics?.bedrooms
                            )}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option?.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div> */}

                {/* aca */}
                {/* <div className="grid grid-cols-2 gap-0 md:gap-3">
                  <FormItem
                    label="Cocina(s)"
                    className="flex justify-items-center items-start md:items-center"
                  >
                    <Field name="characteristics.hasKitchen">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics.hasKitchen}
                            className="my-3"
                            onChange={() => {
                              if (values.characteristics.hasKitchen) {
                                form.setFieldValue(
                                  'characteristics.typeOfKitchen',
                                  ''
                                )
                              }
                              form.setFieldValue(
                                field.name,
                                !values.characteristics.hasKitchen
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Tipo">
                    <Field name="characteristics.typeOfKitchen">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Select
                            isClearable
                            isDisabled={!values.characteristics?.hasKitchen}
                            field={field}
                            options={filterTypeOfKitchens}
                            placeholder="Seleccionar..."
                            value={filterTypeOfKitchens?.filter(
                              (option) =>
                                option.value ===
                                values.characteristics?.typeOfKitchen
                            )}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option?.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div>

                <div className="grid grid-cols-2 gap-0 md:gap-3">
                  <FormItem
                    label="Calefacción"
                    className="flex justify-items-center items-start md:items-center"
                  >
                    <Field name="characteristics.hasHeating">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics.hasHeating}
                            className="my-3"
                            onChange={() => {
                              if (values.characteristics.hasHeating) {
                                form.setFieldValue(
                                  'characteristics.typeOfHeating',
                                  ''
                                )
                              }
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasHeating
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Tipo" className="relative">
                    <Field name="characteristics.typeOfHeating">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Select
                            isClearable
                            isDisabled={!values.characteristics?.hasHeating}
                            field={field}
                            options={filterTypeOfHeating}
                            placeholder="Seleccionar"
                            value={filterTypeOfHeating?.filter(
                              (option) =>
                                option.value ===
                                values.characteristics?.typeOfHeating
                            )}
                            onChange={(option) => {
                              form.setFieldValue(field.name, option?.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div> */}

                {/* <div className="grid grid-cols-2 gap-0 md:gap-3">
                  <FormItem
                    label="Seguridad"
                    className="flex justify-items-center items-start md:items-center"
                  >
                    <Field name="characteristics.hasSecurity">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics?.hasSecurity}
                            className="my-3"
                            onChange={() => {
                              if (values.characteristics.hasSecurity) {
                                form.setFieldValue(
                                  'characteristics.typeOfSecurity',
                                  []
                                )
                              }

                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasSecurity
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Tipo de seguridad" className="relative">
                    <Field name="characteristics.typeOfSecurity">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Select
                            isMulti
                            isClearable
                            isDisabled={!values.characteristics.hasSecurity}
                            placeholder="Seleccionar"
                            value={values.characteristics.typeOfSecurity}
                            options={filterTypeOfSecurity as any}
                            onChange={(option: any) => {
                              form.setFieldValue(field.name, option)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-0 md:gap-3 place-content-start md:place-content-center justify-items-start md:justify-items-center text-start md:text-center">
                  <FormItem label="Amoblada">
                    <Field name="characteristics.isFurnished">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values?.characteristics?.isFurnished}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.isFurnished
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="A. acondicionado">
                    <Field name="characteristics.hasAirConditioning">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics?.hasAirConditioning}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasAirConditioning
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Garage">
                    <Field name="characteristics.hasGarage">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics?.hasGarage}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasGarage
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Estacionamiento">
                    <Field name="characteristics.hasParking">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics?.hasParking}
                            className="my-3"
                            onChange={() => {
                              if (field.name) {
                                form.setFieldValue(
                                  'characteristics.numberOfParkingSpaces',
                                  ''
                                )
                              }

                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasParking
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  {values.characteristics.hasParking && (
                    <div className="w-[85%] lg:w-2/3">
                      <FormItem label="Estacionamiento(s)">
                        <Field name="characteristics.numberOfParkingSpaces">
                          {({ field, form }: FieldProps<FormModel>) => {
                            return (
                              <Select
                                isClearable
                                field={field}
                                isDisabled={!values.characteristics.hasParking}
                                options={filterParkingSpaces}
                                placeholder="Seleccionar..."
                                value={filterParkingSpaces?.filter(
                                  (option) =>
                                    option.value ===
                                    values.characteristics
                                      ?.numberOfParkingSpaces
                                )}
                                onChange={(option) => {
                                  form.setFieldValue(field.name, option?.value)
                                }}
                              />
                            )
                          }}
                        </Field>
                      </FormItem>
                    </div>
                  )}

                  <FormItem label="Ascensor">
                    <Field name="characteristics.hasElevator">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics?.hasElevator}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasElevator
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Gimnasio">
                    <Field name="characteristics.hasGym">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics?.hasGym}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasGym
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Piscina">
                    <Field name="characteristics.hasSwimmingPool">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics?.hasSwimmingPool}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasSwimmingPool
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>

                  <FormItem label="Quincho">
                    <Field name="characteristics.hasBarbecueArea">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Switcher
                            checked={values.characteristics?.hasBarbecueArea}
                            className="my-3"
                            onChange={() => {
                              form.setFieldValue(
                                field.name,
                                !values.characteristics?.hasBarbecueArea
                              )
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div> */}

                {/* <FormItem
                  asterisk
                  label="Titulo de la Propiedad"
                  invalid={
                    errors.characteristics?.propertyTitle &&
                    touched.characteristics?.propertyTitle
                  }
                  errorMessage={errors.characteristics?.propertyTitle}
                >
                  <Field name="characteristics.propertyTitle">
                    {({ field, form }: FieldProps<FormModel>) => {
                      return (
                        <Input
                          field={field}
                          type="text"
                          size="md"
                          className="mb-2"
                          placeholder="Ingresar un titulo"
                          value={values.characteristics?.propertyTitle}
                          onChange={(e) => {
                            form.setFieldValue(field.name, e.target.value)
                          }}
                        />
                      )
                    }}
                  </Field>
                </FormItem>

                <FormItem
                  asterisk
                  label="Descripción de la Propiedad"
                  className="mb-6"
                  invalid={
                    errors.characteristics?.propertyDescription &&
                    touched.characteristics?.propertyDescription
                  }
                  errorMessage={errors.characteristics?.propertyDescription}
                >
                  <Field name="characteristics.propertyDescription">
                    {({ field, form }: FieldProps) => (
                      <RichTextEditor
                        value={field.value}
                        placeholder="Ingresar una descripción de la propiedad..."
                        onChange={(val) => {
                          form.setFieldValue(field.name, val)
                        }}
                      />
                    )}
                  </Field>
                </FormItem> */}

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
