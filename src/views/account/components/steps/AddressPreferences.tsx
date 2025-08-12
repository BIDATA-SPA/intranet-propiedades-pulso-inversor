import SegmentItemOption from '@/components/shared/SegmentItemOption'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Segment from '@/components/ui/Segment'
import {
  useGetPreferredAreasQuery,
  useSendPreferredAreasMutation,
} from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Field, FieldArray, Form, Formik, FormikHelpers } from 'formik'
import React, { useEffect, useMemo } from 'react'
import { FaTrash } from 'react-icons/fa'
import { HiCheckCircle } from 'react-icons/hi'
import { LuPlus } from 'react-icons/lu'
import { TbMapPinSearch } from 'react-icons/tb'
import { validationPreferenceAddressSchema } from '../../schema'
import AddressFields from './AddressFields'

interface Preference {
  countryId: number | ''
  stateId: number | ''
  cityId: number | ''
}

interface FormValues {
  cityIds: Preference[]
}

const initialPreference: Preference = {
  countryId: '',
  stateId: '',
  cityId: '',
}

const AddressPreferences: React.FC = () => {
  const { showNotification } = useNotification()
  const [sendPreferredAreas, { isLoading }] = useSendPreferredAreasMutation()

  const {
    data: preferredAreas,
    isLoading: preferredAreasLoading,
    isError: preferredAreasError,
    isSuccess: preferredAreasSuccess,
  } = useGetPreferredAreasQuery({})

  // Adaptamos la respuesta del backend a la estructura del formulario
  const mappedInitialPreferences: Preference[] = useMemo(() => {
    if (!preferredAreasSuccess || !preferredAreas) return []

    return preferredAreas.map((item: any) => ({
      countryId: item.state?.country?.id ?? '',
      stateId: item.state?.id ?? '',
      cityId: item.id ?? '',
    }))
  }, [preferredAreas, preferredAreasSuccess])

  // Envío de formulario
  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>
  ) => {
    const selectedCommunes = values.cityIds.map((pref) => pref.cityId)

    const hasDuplicates = selectedCommunes.some(
      (id, index) => selectedCommunes.indexOf(id) !== index
    )

    if (hasDuplicates) {
      showNotification(
        'warning',
        'Has seleccionado más de una vez la misma comuna',
        ''
      )
      actions.setSubmitting(false)
      return
    }

    try {
      const res = await sendPreferredAreas({
        cityIds: selectedCommunes,
      }).unwrap()
      showNotification('success', res?.message || 'Preferencias guardadas', '')
    } catch (error) {
      showNotification('danger', 'Error al guardar preferencias', '')
    }

    actions.setSubmitting(false)
  }

  // Error al cargar áreas
  useEffect(() => {
    if (preferredAreasError) {
      showNotification('danger', 'Error al cargar tus preferencias', '')
    }
  }, [preferredAreasError])

  return (
    <Formik
      enableReinitialize
      initialValues={{ cityIds: mappedInitialPreferences }}
      validationSchema={validationPreferenceAddressSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, setFieldValue, isSubmitting }) => (
        <Form>
          <FormContainer>
            <FormItem
              asterisk
              label={`Mis búsquedas de preferencia ${
                preferredAreas?.length ? `(${preferredAreas?.length})` : '0'
              }`}
            >
              <Field name="segment">
                {() => (
                  <Segment className="w-full" selectionType="multiple">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                      {preferredAreas?.length
                        ? preferredAreas?.map((area) => (
                            <Segment.Item key={area.id} value={area.id}>
                              {({ onSegmentItemClick, disabled }) => {
                                return (
                                  <div className="text-center">
                                    <SegmentItemOption
                                      hoverable
                                      active={true}
                                      disabled={disabled}
                                      defaultGutter={false}
                                      className="relative min-h-[80px] w-full"
                                      customCheck={
                                        <HiCheckCircle className="text-sky-600 absolute top-2 right-2 text-lg" />
                                      }
                                      onSegmentItemClick={onSegmentItemClick}
                                    >
                                      <div className="flex flex-col items-start mx-4">
                                        <h6>{area?.name || ''}</h6>
                                        <p>
                                          {`${
                                            area?.state && area?.state?.name
                                          }`}
                                          {`${
                                            area?.state?.country &&
                                            `,${area?.state?.country?.name}`
                                          }`}
                                        </p>
                                      </div>
                                    </SegmentItemOption>
                                  </div>
                                )
                              }}
                            </Segment.Item>
                          ))
                        : null}
                    </div>
                  </Segment>
                )}
              </Field>
            </FormItem>

            <FieldArray name="cityIds">
              {({ push, remove }) => (
                <>
                  <div className="flex flex-col items-start justify-start mb-4">
                    <h3 className="mb-4 lg:mb-0 text-[18px] flex items-center">
                      <TbMapPinSearch className="mr-1.5 text-red-400" />
                      Preferencias de Búsqueda
                    </h3>
                    <p>
                      Entérate en tiempo real de las propiedades publicadas con
                      tus parámetros de búsqueda preferencial.
                    </p>
                  </div>

                  <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4">
                    {values.cityIds.map((_, index) => (
                      <React.Fragment key={index}>
                        <AddressFields
                          prefix={`cityIds[${index}]`}
                          values={values}
                          setFieldValue={setFieldValue}
                          errors={errors}
                        />
                        <div className="flex justify-center items-center">
                          <Button
                            variant="solid"
                            type="button"
                            color="red-500"
                            icon={<FaTrash />}
                            onClick={() => remove(index)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>

                  {values.cityIds.length < 5 && (
                    <div className="flex justify-center items-center w-full my-10 lg:my-5 mx-2">
                      <Button
                        type="button"
                        icon={<LuPlus />}
                        onClick={() => push(initialPreference)}
                      >
                        Agregar nueva preferencia de búsqueda{' '}
                        {values.cityIds.length > 0 &&
                          `(${values.cityIds.length})`}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </FieldArray>

            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                variant="solid"
                loading={isSubmitting || isLoading}
              >
                Guardar preferencias
              </Button>
            </div>
          </FormContainer>
        </Form>
      )}
    </Formik>
  )
}

export default AddressPreferences

// import Button from '@/components/ui/Button'
// import { FormContainer } from '@/components/ui/Form'
// import {
//   useGetPreferredAreasQuery,
//   useSendPreferredAreasMutation,
// } from '@/services/RtkQueryService'
// import useNotification from '@/utils/hooks/useNotification'
// import { FieldArray, Form, Formik, FormikHelpers } from 'formik'
// import React, { useEffect, useMemo } from 'react'
// import { FaTrash } from 'react-icons/fa'
// import { LuPlus } from 'react-icons/lu'
// import { TbMapPinSearch } from 'react-icons/tb'
// import { validationPreferenceAddressSchema } from '../../schema'
// import AddressFields from './AddressFields'

// interface Preference {
//   countryId: number | ''
//   stateId: number | ''
//   cityId: number | ''
// }

// interface FormValues {
//   cityIds: Preference[]
// }

// const initialPreference: Preference = {
//   countryId: '',
//   stateId: '',
//   cityId: '',
// }

// const AddressPreferences: React.FC = () => {
//   const { showNotification } = useNotification()

//   const [sendPreferredAreas, { isLoading }] = useSendPreferredAreasMutation()

//   const {
//     data: preferredAreas,
//     isLoading: preferredAreasLoading,
//     isError: preferredAreasError,
//     isSuccess: preferredAreasSuccess,
//   } = useGetPreferredAreasQuery({})

//   // Adaptamos la respuesta del backend a la estructura del formulario
//   const mappedInitialPreferences: Preference[] = useMemo(() => {
//     if (!preferredAreasSuccess || !preferredAreas) return []

//     return preferredAreas.map((item: any) => ({
//       countryId: item.state?.country?.id ?? '',
//       stateId: item.state?.id ?? '',
//       cityId: item.id ?? '',
//     }))
//   }, [preferredAreas, preferredAreasSuccess])

//   // Envío de formulario
//   const handleSubmit = async (
//     values: FormValues,
//     actions: FormikHelpers<FormValues>
//   ) => {
//     const selectedCommunes = values.cityIds.map((pref) => pref.cityId)

//     const hasDuplicates = selectedCommunes.some(
//       (id, index) => selectedCommunes.indexOf(id) !== index
//     )

//     if (hasDuplicates) {
//       showNotification(
//         'warning',
//         'Has seleccionado más de una vez la misma comuna',
//         ''
//       )
//       actions.setSubmitting(false)
//       return
//     }

//     try {
//       const res = await sendPreferredAreas({
//         cityIds: selectedCommunes,
//       }).unwrap()
//       showNotification('success', res?.message || 'Preferencias guardadas', '')
//     } catch (error) {
//       showNotification('danger', 'Error al guardar preferencias', '')
//     }

//     actions.setSubmitting(false)
//   }

//   // Error al cargar áreas
//   useEffect(() => {
//     if (preferredAreasError) {
//       showNotification('danger', 'Error al cargar tus preferencias', '')
//     }
//   }, [preferredAreasError])

//   return (
//     <Formik
//       enableReinitialize
//       initialValues={{ cityIds: mappedInitialPreferences }}
//       validationSchema={validationPreferenceAddressSchema}
//       onSubmit={handleSubmit}
//     >
//       {({ values, errors, setFieldValue, isSubmitting }) => (
//         <Form>
//           <FormContainer>
//             <FieldArray name="cityIds">
//               {({ push, remove }) => (
//                 <>
//                   <div className="flex flex-col items-start justify-start mb-4">
//                     <h3 className="mb-4 lg:mb-0 text-[18px] flex items-center">
//                       <TbMapPinSearch className="mr-1.5 text-red-400" />
//                       Preferencias de Búsqueda
//                     </h3>
//                     <p>
//                       Entérate en tiempo real de las propiedades publicadas con
//                       tus parámetros de búsqueda preferencial.
//                     </p>
//                   </div>

//                   <div className="w-full grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4">
//                     {values.cityIds.map((_, index) => (
//                       <React.Fragment key={index}>
//                         <AddressFields
//                           prefix={`cityIds[${index}]`}
//                           values={values}
//                           setFieldValue={setFieldValue}
//                           errors={errors}
//                         />
//                         <div className="flex justify-center items-center">
//                           <Button
//                             variant="solid"
//                             type="button"
//                             color="red-500"
//                             icon={<FaTrash />}
//                             onClick={() => remove(index)}
//                           >
//                             Eliminar
//                           </Button>
//                         </div>
//                       </React.Fragment>
//                     ))}
//                   </div>

//                   {values.cityIds.length < 5 && (
//                     <div className="flex justify-center items-center w-full my-10 lg:my-5 mx-2">
//                       <Button
//                         type="button"
//                         icon={<LuPlus />}
//                         onClick={() => push(initialPreference)}
//                       >
//                         Agregar nueva preferencia de búsqueda{' '}
//                         {values.cityIds.length > 0 &&
//                           `(${values.cityIds.length})`}
//                       </Button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </FieldArray>

//             <div className="flex justify-end mt-4">
//               <Button
//                 type="submit"
//                 variant="solid"
//                 loading={isSubmitting || isLoading}
//               >
//                 Guardar preferencias
//               </Button>
//             </div>
//           </FormContainer>
//         </Form>
//       )}
//     </Formik>
//   )
// }

// export default AddressPreferences
