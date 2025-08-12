import ActionLink from '@/components/shared/ActionLink'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import * as Yup from 'yup'
// Cuando tengas el servicio, importa el hook para la mutación
// import { useSendConfirmationLinkMutation } from '@/services/RtkQueryService'
import { useResendConfirmEmailMutation } from '@/services/RtkQueryService'
import openNotification from '@/utils/openNotification'

type FormModel = {
  email: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Debe ser un correo válido')
    .required('Por favor ingresa tu correo'),
})

const SendConfirmEmail = () => {
  const signInUrl = '/iniciar-sesion'
  const [disabledSendButton, setDisabledSendButton] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [message, setMessage] = useTimeOutMessage()

  // Cuando tengas el servicio, reemplaza esta lógica con el hook real
  const [sendConfirmationLink, { isError, isUninitialized, isSuccess, error }] =
    useResendConfirmEmailMutation()

  const onSubmit = (values: FormModel) => {
    setDisabledSendButton(true)
    setEmailSent(true)

    setTimeout(() => {
      setDisabledSendButton(false)
    }, 60 * 1000)

    sendConfirmationLink(values)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Correo Enviado',
        'El enlace de confirmación fue enviado correctamente',
        3
      )
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        (error as any)?.message || 'Ocurrió un error, intenta más tarde',
        3
      )

      setEmailSent(false)
      setDisabledSendButton(false)
    }
  }, [isSuccess, isError])

  return (
    <div>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-1">Revisa tu correo electrónico</h3>
            <p>Te hemos enviado un enlace de confirmación a tu correo.</p>
          </>
        ) : (
          <>
            <h3 className="mb-1">¿Necesitas confirmar tu correo?</h3>
            <p className="line-clamp-3">
              Ingresa tu dirección de correo para recibir un enlace de
              confirmación.
            </p>
          </>
        )}
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ touched, errors }) => (
          <Form>
            <FormContainer>
              <div className={emailSent ? 'hidden' : ''}>
                <FormItem
                  invalid={!!errors.email && !!touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                  />
                </FormItem>
              </div>
              <Button
                block
                disabled={disabledSendButton}
                variant="solid"
                type="submit"
                className="flex items-center justify-center"
              >
                {emailSent ? (
                  <span className="mr-3">Reenviar enlace</span>
                ) : (
                  'Enviar enlace'
                )}

                {disabledSendButton && (
                  <Countdown
                    renderer={(props) => <div>{props.seconds || '60'}</div>}
                    date={Date.now() + 60000}
                  />
                )}
              </Button>

              <div className="mt-4 text-center">
                <span>Volver a </span>
                <ActionLink to={signInUrl}>Acceder</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SendConfirmEmail
