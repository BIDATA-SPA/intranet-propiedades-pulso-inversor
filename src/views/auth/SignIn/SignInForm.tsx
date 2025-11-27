import { SignInResponse } from '@/@types/auth'
import type { CommonProps } from '@/@types/common'
import ActionLink from '@/components/shared/ActionLink'
import PasswordInput from '@/components/shared/PasswordInput'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import { useSignInAdminMutation } from '@/services/RtkQueryService'
import useAuth from '@/utils/hooks/useAuth'
import useNotification from '@/utils/hooks/useNotification'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { userTypes } from '../definitions'

interface SignInFormProps extends CommonProps {
  disableSubmit?: boolean
  forgotPasswordUrl?: string
  signUpUrl?: string
  signInUrlCustomer?: string
}

type SignInFormSchema = {
  username: string
  password: string
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required('Por favor, ingresa tu usuario'),
  password: Yup.string().required('Por favor, ingresa tu contraseña'),
})

const SignInForm = (props: SignInFormProps) => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = '/recuperar-contraseña',
    signUpUrl = '/crear-cuenta',
  } = props
  const [signInAdmin, { isLoading, error }] = useSignInAdminMutation()
  const { showNotification } = useNotification()
  const [message, setMessage] = useTimeOutMessage()

  const { signIn } = useAuth()

  const onSignIn = async (
    values: SignInFormSchema,
    { setSubmitting, resetForm }
  ) => {
    if (disableSubmit) {
      setSubmitting(false)
      return
    }

    const { username, password } = values
    const normalizedEmail = username.toLowerCase().trim()

    try {
      const result = await signInAdmin({
        username: normalizedEmail,
        password,
        grant_type: '',
      })

      // CASO 1: Credenciales inválidas
      if ('error' in result && result.error?.message === 'Unauthorized') {
        showNotification(
          'danger',
          'Credenciales inválidas',
          'Usuario o contraseña incorrectos.'
        )
        resetForm({
          values: { username: '', password: '', grant_type: '' },
        })
        return
      }

      // CASO 2: Usuario no ha confirmado su email
      if (
        'error' in result &&
        result.error?.message?.toLowerCase()?.includes('confirma tu cuenta')
      ) {
        showNotification(
          'warning',
          'Cuenta no confirmada',
          'Debes confirmar tu correo electrónico para poder iniciar sesión.'
        )
        resetForm({
          values: { username: '', password: '', grant_type: '' },
        })
        return
      }

      // CASO 3: Inicio de sesión exitoso
      if ('data' in result && result.data?.access_token) {
        const { type, rol }: SignInResponse = result.data

        if (type === userTypes[0] && rol === userTypes[0]) {
          showNotification(
            'danger',
            'Acceso denegado',
            'Este usuario no pertenece a esta sesión.'
          )
          resetForm({
            values: { username: '', password: '', grant_type: '' },
          })
          return
        }

        if (
          (type === userTypes[1] && rol === userTypes[1]) ||
          (type === userTypes[2] && rol === userTypes[2])
        ) {
          signIn({ username: normalizedEmail, password })
          showNotification('success', 'Éxito', 'Sesión iniciada exitosamente.')
          return
        }

        // Caso no contemplado de tipo o rol
        showNotification(
          'warning',
          'Advertencia',
          'Tipo de usuario no reconocido. Contacta al administrador.'
        )
        return
      }

      // CASO 4: Error inesperado sin estructura clara
      showNotification(
        'warning',
        'Error inesperado',
        'Ha ocurrido un problema con el servidor. Intenta más tarde.'
      )
      resetForm({
        values: { username: '', password: '', grant_type: '' },
      })
    } catch (err: any) {
      // Errores de red o excepciones no controladas
      showNotification(
        'danger',
        'Error inesperado',
        err?.message || 'Ocurrió un error inesperado en el servidor.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={className}>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          <>{message}</>
        </Alert>
      )}
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, formikHelpers) => {
          if (!disableSubmit) {
            onSignIn(values, formikHelpers)
          } else {
            formikHelpers.setSubmitting(false)
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Correo electrónico"
                invalid={(errors.username && touched.username) as boolean}
                errorMessage={errors.username}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="username"
                  placeholder="Introduce tu usuario"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Contraseña"
                invalid={(errors.password && touched.password) as boolean}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="Introduce tu contraseña"
                  component={PasswordInput}
                />
              </FormItem>
              <div className="flex justify-end mb-6">
                <ActionLink to={forgotPasswordUrl}>
                  Recuperar contraseña
                </ActionLink>
              </div>
              <Button block loading={isLoading} variant="solid" type="submit">
                {isSubmitting ? 'Ingresando...' : 'Ingresar'}
              </Button>
              <div className="mt-4 text-center">
                <span>{`¿Aún no tiene cuenta?`} </span>
                <ActionLink to={signUpUrl}>Regístrate</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignInForm
