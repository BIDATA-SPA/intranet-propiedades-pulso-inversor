import type { CommonProps } from '@/@types/common'
import ActionLink from '@/components/shared/ActionLink'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useRecoverPasswordMutation } from '@/services/RtkQueryService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import openNotification from '@/utils/openNotification'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown'
import * as Yup from 'yup'

interface ForgotPasswordFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

type FormModel = {
  email: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Por Favor ingresa tu correo'),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const { className, signInUrl = '/iniciar-sesion' } = props
  const [disabledSendButton, setDisabledSendButton] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [message, setMessage] = useTimeOutMessage()

  const [recoverPassword, { isError, isUninitialized, isSuccess, error }] =
    useRecoverPasswordMutation()

  const onSubmit = (values: FormModel) => {
    setDisabledSendButton(true)
    setEmailSent(true)

    setTimeout(() => {
      setDisabledSendButton(false)
    }, 60 * 1000)

    recoverPassword(values)
  }

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Correo Enviado',
        'Correo Enviado correctamente',
        3
      )
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        (error as any).message || 'Ocurrio un error, intenta más tarde',
        3
      )

      setEmailSent(false)
      setDisabledSendButton(false)
    }
  }, [isSuccess, isError])

  return (
    <div className={className}>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-1">Comprueba tu correo electrónico</h3>
            <p>
              Hemos enviado una instrucción de recuperación de contraseña a su
              correo electrónico.
            </p>
          </>
        ) : (
          <>
            <h3 className="mb-1">¿Ha olvidado su contraseña?</h3>
            <p className="line-clamp-3">
              Introduzca su dirección de correo electrónico para recibir un
              código de verificación.
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
                  invalid={errors.email && touched.email}
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
                  <span className="mr-3">Reenviar código</span>
                ) : (
                  'Enviar código'
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

export default ForgotPasswordForm
