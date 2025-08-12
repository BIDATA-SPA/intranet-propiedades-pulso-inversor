/* eslint-disable react-hooks/exhaustive-deps */
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useCreateRatingUserMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Rating, ThinStar } from '@smastrom/react-rating'
import { Field, FieldProps, Form, Formik } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect } from 'react'
import { InitialRating } from '../../../../definitions'
import { validationRatingSchema } from '../../../../schema'
/* eslint-disable react-hooks/exhaustive-deps */

export type FormModel = InitialRating

const ratingStyles = {
  itemShapes: ThinStar,
  activeFillColor: '#facc15',
  inactiveFillColor: '#fef08a',
}

export const getRating = (rating) => {
  switch (rating) {
    case 1:
      return 'Insuficiente'
    case 2:
      return 'Aceptable'
    case 3:
      return 'Bueno'
    case 4:
      return 'Muy Bueno'
    case 5:
      return 'Excelente'
    default:
      return 'No calificado/a'
  }
}

const MainContent = ({ currentEmail, onClose }) => {
  const [createRatingUser, { isError, isLoading, isSuccess }] =
    useCreateRatingUserMutation()
  const { showNotification } = useNotification()

  const onSubmit = async (values: FormModel, { setSubmitting }) => {
    setSubmitting(true)
    const data = cloneDeep({
      ...values,
      userId: Number(values.userId),
    })

    await createRatingUser(data)
    setSubmitting(false)
    onClose()
  }

  useEffect(() => {
    if (isSuccess) {
      showNotification('success', 'Éxito', 'Calificación enviada exitosamente')
    }
  }, [isSuccess])

  useEffect(() => {
    if (isError) {
      showNotification(
        'danger',
        'Error',
        'Error al calificar el/la corredor/a, inténtalo más tarde'
      )
    }
  }, [isError])

  return (
    <>
      <Formik
        initialValues={{
          comment: '',
          rating: 0,
          userId: currentEmail?.realtorOwner?.id,
        }}
        validationSchema={validationRatingSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched }) => {
          return (
            <Form>
              <FormContainer>
                <div className="grid grid-cols-1 gap-4 h-auto p-3">
                  <FormItem className=" w-full flex justify-center items-center">
                    <div className="w-full flex justify-center items-center flex-col">
                      <Field name="rating">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Rating
                              transition="zoom"
                              style={{ width: '35%' }}
                              value={values.rating}
                              itemStyles={ratingStyles}
                              onChange={(e) => {
                                form.setFieldValue(field.name, e)
                              }}
                            />
                          )
                        }}
                      </Field>
                      <div>{`Calificación seleccionada: ${getRating(
                        values.rating
                      )}`}</div>
                    </div>
                  </FormItem>

                  <div className="w-full flex justify-end">
                    <FormItem>
                      <Field name="rating">
                        {({ field, form }: FieldProps<FormModel>) => {
                          return (
                            <Button
                              size="xs"
                              variant="solid"
                              color="yellow-500"
                              onClick={() => form.setFieldValue(field.name, 0)}
                            >
                              Resetear calificación {`(${values.rating})`}
                            </Button>
                          )
                        }}
                      </Field>
                    </FormItem>
                  </div>

                  <FormItem
                    label="Comentario"
                    invalid={(errors.comment && touched.comment) as boolean}
                    errorMessage={errors.comment}
                  >
                    <Field name="comment">
                      {({ field, form }: FieldProps<FormModel>) => {
                        return (
                          <Input
                            textArea
                            field={field}
                            size="md"
                            name="comment"
                            placeholder={`Ingresar comentario hacia el corredor ${
                              currentEmail?.realtorOwner?.name || 'Sin nombre'
                            } ${
                              currentEmail?.realtorOwner?.lastName ||
                              'Sin apellido'
                            }`}
                            value={values.comment}
                            onChange={(e) => {
                              form.setFieldValue(field.name, e.target.value)
                            }}
                          />
                        )
                      }}
                    </Field>
                  </FormItem>
                </div>

                <div className="text-right mt-6">
                  <Button
                    className="ltr:mr-2 rtl:ml-2"
                    variant="plain"
                    onClick={onClose}
                  >
                    Cerrar
                  </Button>
                  <Button type="submit" variant="solid" loading={isLoading}>
                    Enviar
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

const UserRating = ({ dialogIsOpen, currentEmail, onClose }) => {
  return (
    <>
      <Dialog isOpen={dialogIsOpen} onClose={onClose} onRequestClose={onClose}>
        <h5 className="mb-4">Calificar corredor/a</h5>
        <MainContent currentEmail={currentEmail} onClose={onClose} />
      </Dialog>
    </>
  )
}

export default UserRating
