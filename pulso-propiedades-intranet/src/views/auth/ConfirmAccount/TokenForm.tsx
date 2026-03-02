/* eslint-disable react-hooks/exhaustive-deps */
import type { CommonProps } from '@/@types/common'
import Button from '@/components/ui/Button'
import { FormContainer } from '@/components/ui/Form'
import { useSendConfirmAccountTokenMutation } from '@/services/RtkQueryService'
import useNotification from '@/utils/hooks/useNotification'
import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

interface SignInFormProps extends CommonProps {
  disableSubmit?: boolean
  forgotPasswordUrl?: string
  signUpUrl?: string
}

type SignInFormSchema = {
  token: string
}

type TServerError = {
  message: string
}

const TokenForm = (props: SignInFormProps) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const [
    sendConfirmAccountToken,
    { data, isLoading, isError, isSuccess, error },
  ] = useSendConfirmAccountTokenMutation()

  const { disableSubmit = false, className } = props
  const query = new URLSearchParams(location.search)
  const token = query.get('token')
  const typedError = error as TServerError

  const onSubmit = async (
    values: SignInFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(true)

    await sendConfirmAccountToken({ ...values })
    setSubmitting(false)
  }

  useEffect(() => {
    if (isError) {
      showNotification(
        'warning',
        'Advertencia',
        'Ocurrio un error al validar tu cuenta, intentalo más tarde'
      )
    }
  }, [isError])

  useEffect(() => {
    if (typedError?.message === 'El token ha expirado') {
      showNotification('danger', 'Error', `${typedError?.message}.`)
    }
  }, [typedError])

  useEffect(() => {
    if (isSuccess || data) {
      showNotification(
        'success',
        'Éxito',
        'Tu cuenta ha sido validada exitosamente.'
      )
      navigate('/iniciar-sesion')
    }
  }, [isSuccess, data])

  return (
    <div className={className}>
      <Formik
        initialValues={{
          token: token ?? null,
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSubmit(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {() => (
          <Form>
            <FormContainer>
              <Button block loading={isLoading} variant="solid" type="submit">
                {isLoading ? 'Validando...' : 'Validar e-mail'}
              </Button>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default TokenForm
