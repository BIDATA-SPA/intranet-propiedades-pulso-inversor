/* eslint-disable react-hooks/exhaustive-deps */
import { AdaptableCard } from '@/components/shared'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useCreateRatingUserByCustomerMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { getRating } from '@/views/inbox-request/kanje-managment/components/tabs/components/Inbox/UserRating'
import { Rating, ThinStar } from '@smastrom/react-rating'
import { Field, Form, Formik } from 'formik'
import cloneDeep from 'lodash/cloneDeep'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import { validationRatingSchema } from '../schema'

const ratingStyles = {
  itemShapes: ThinStar,
  activeFillColor: '#facc15',
  inactiveFillColor: '#fef08a',
}

const RatingForm = () => {
  const navigate = useNavigate()
  const { userId, customerId } = useParams()
  const { showNotification } = useNotification()
  const [createRatingUserByCustomer, { isError, isLoading, isSuccess }] =
    useCreateRatingUserByCustomerMutation()

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
    <div>
      <Formik
        initialValues={{
          comment: '',
          rating: 0,
        }}
        validationSchema={validationRatingSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const { comment, rating } = values

          const data = cloneDeep({
            comment,
            rating,
            userId: +userId,
            customerId: +customerId,
          })

          try {
            await createRatingUserByCustomer(data)
            setSubmitting(false)
            navigate('/iniciar-sesion')
          } catch (error) {
            setSubmitting(false)
          }
        }}
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form>
            <FormContainer className="w-full md:w-4/6 lg:w-3/6 xl:w-3/6 mx-auto border rounded-2xl p-4 lg:p-6 dark:border-gray-700 border-t-4 border-t-sky-500">
              <div className="w-[90%] mx-auto flex justify-center flex-col">
                <div className="w-full flex justify-center items-center mb-4">
                  <img
                    src="/img/logo/logo-light-full.png"
                    className="w-36 object-cover md:h-full md:w-48"
                    alt="Procanje ligth logo"
                  />
                </div>

                <h2 className="text-center text-xl mb-2">
                  Califica la experiencia con tu corredor de propiedades
                </h2>
                <p className="italic">
                  {`Comparte tu experiencia y ayuda a mejorar nuestro servicio calificando la atención recibida.`}
                </p>
              </div>

              <AdaptableCard className="w-[95%] lg:w-[90%] mx-auto">
                <FormItem className="w-full flex justify-center items-center">
                  <div className="w-full flex justify-center items-center flex-col my-6">
                    <Field name="rating">
                      {({ field, form }) => (
                        <Rating
                          transition="zoom"
                          style={{ width: '35%' }}
                          value={values.rating}
                          itemStyles={ratingStyles}
                          onChange={(e) => form.setFieldValue(field.name, e)}
                        />
                      )}
                    </Field>
                    <div>{`Calificación seleccionada: ${getRating(
                      values.rating
                    )}`}</div>
                  </div>
                </FormItem>

                <FormItem
                  label="Comentarios"
                  invalid={(errors.comment && touched.comment) as boolean}
                  errorMessage={errors.comment}
                >
                  <Field name="comment">
                    {({ field, form }) => (
                      <Input
                        textArea
                        field={field}
                        size="md"
                        name="comment"
                        placeholder="Deja un comentario a tu corredor/a..."
                        value={values.comment}
                        onChange={(e) =>
                          form.setFieldValue(field.name, e.target.value)
                        }
                      />
                    )}
                  </Field>
                </FormItem>
              </AdaptableCard>

              <div className="text-right mt-6 flex gap-4 w-full justify-end">
                <Button
                  type="button"
                  variant="solid"
                  color="gray-400"
                  onClick={() => navigate('/iniciar-sesion')}
                >
                  Volver
                </Button>

                <Button
                  type="submit"
                  variant="solid"
                  loading={isLoading}
                  disabled={isSubmitting}
                >
                  Enviar
                </Button>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default RatingForm
