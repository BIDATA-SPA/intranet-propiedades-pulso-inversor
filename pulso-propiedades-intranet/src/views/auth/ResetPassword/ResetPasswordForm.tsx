import type { CommonProps } from '@/@types/common'
import ActionLink from '@/components/shared/ActionLink'
import PasswordInput from '@/components/shared/PasswordInput'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import { useResetPasswordMutation } from '@/services/RtkQueryService'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import openNotification from '@/utils/openNotification'
import { Field, Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as Yup from 'yup'

interface ResetPasswordFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

type ResetPasswordFormSchema = {
  password: string
  confirmPassword: string
}

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Por favor, introduzca su contraseña.'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Sus contraseñas no coinciden.'
  ),
})

const ResetPasswordForm = (props: ResetPasswordFormProps) => {
  const {
    disableSubmit = false,
    className,
    signInUrl = '/iniciar-sesion',
  } = props
  const [searchParams, setSearchParams] = useSearchParams()
  const [token, setToken] = useState(searchParams.get('token'))
  const [resetPassword, { isSuccess, isError, isUninitialized }] =
    useResetPasswordMutation()

  const [resetComplete, setResetComplete] = useState(false)

  const [message, setMessage] = useTimeOutMessage()

  const navigate = useNavigate()

  const onSubmit = async (values: ResetPasswordFormSchema) => {
    const body: ResetPasswordFormSchema & { token: string } = {
      ...values,
      token,
    }

    resetPassword(body)
  }

  const onContinue = () => {
    navigate('/iniciar-sesion')
  }

  useEffect(() => {
    if (!token) {
      navigate('/iniciar-sesion')
    }
  }, [token])

  useEffect(() => {
    if (isSuccess) {
      openNotification(
        'success',
        'Contraseña Reestrablecida',
        'Contraseña Reestrablecida correctamente',
        3
      )

      setResetComplete(true)
    }

    if (!isUninitialized && isError) {
      openNotification(
        'warning',
        'Error',
        'Ocurrio un error al reestablecer la contraseña, por favor intenta más tarde',
        3
      )
    }
  }, [isError, isSuccess])

  return (
    <div className={className}>
      <div className="mb-6">
        {resetComplete ? (
          <>
            <h3 className="mb-1">Reinicio hecho</h3>
            <p>Su contraseña se ha restablecido correctamente.</p>
          </>
        ) : (
          <>
            <h3 className="mb-1">Establecer nueva contraseña</h3>
            <p>Tu nueva contraseña debe ser diferente a la anterior.</p>
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
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              {!resetComplete ? (
                <>
                  <FormItem
                    label="Contraseña"
                    invalid={errors.password && touched.password}
                    errorMessage={errors.password}
                  >
                    <Field
                      autoComplete="off"
                      name="password"
                      placeholder="Introduce la nueva contraseña"
                      component={PasswordInput}
                    />
                  </FormItem>
                  <FormItem
                    label="Confirmar contraseña"
                    invalid={errors.confirmPassword && touched.confirmPassword}
                    errorMessage={errors.confirmPassword}
                  >
                    <Field
                      autoComplete="off"
                      name="confirmPassword"
                      placeholder="Confirma la nueva contraseña"
                      component={PasswordInput}
                    />
                  </FormItem>
                  <Button
                    block
                    loading={isSubmitting}
                    variant="solid"
                    type="submit"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar'}
                  </Button>
                </>
              ) : (
                <Button
                  block
                  variant="solid"
                  type="button"
                  onClick={onContinue}
                >
                  Continuar
                </Button>
              )}

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

export default ResetPasswordForm
