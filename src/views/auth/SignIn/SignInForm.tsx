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
        password: values.password,
        grant_type: '',
      })

      if ('error' in result) {
        const { message, statusCode } = result.error.data || {}

        // Mostrar mensaje en un toast
        if (statusCode === 401) {
          showNotification(
            'danger',
            'Acceso no autorizado',
            'Usuario o contraseña incorrectos.'
          )
        } else {
          showNotification(
            'warning',
            'Error',
            message || 'Ha ocurrido un problema con el servidor.'
          )
        }
        resetForm({
          values: { username: '', password: '', grant_type: '' },
        })
        return
      }

      const { type, rol }: SignInResponse = result.data

      // User type logic
      if (type === userTypes[0] && rol === userTypes[0]) {
        showNotification(
          'danger',
          'Error',
          'Este usuario no pertenece a esta sesión'
        )
        resetForm({
          values: { username: '', password: '', grant_type: '' },
        })
      } else if (type === userTypes[1] && rol === userTypes[1]) {
        signIn({ username: normalizedEmail, password })
        showNotification('success', 'Éxito', 'Sesión iniciada exitosamente.')
      } else if (type === userTypes[2] && rol === userTypes[2]) {
        signIn({ username: normalizedEmail, password })
        showNotification('success', 'Éxito', 'Sesión iniciada exitosamente.')
      } else {
        showNotification(
          'warning',
          'Advertencia',
          'Tipo de usuario no reconocido.'
        )
      }
    } catch (err: any) {
      showNotification(
        'warning',
        'Error',
        err?.message || 'Ocurrió un error inesperado.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  // const onSignIn = async (
  //   values: SignInFormSchema,
  //   { setSubmitting, resetForm }
  // ) => {
  //   if (disableSubmit) {
  //     setSubmitting(false)
  //     return
  //   }

  //   const { username, password } = values
  //   const normalizedEmail = username.toLowerCase().trim()

  //   try {
  //     const {
  //       data: { type, rol },
  //     }: { data: SignInResponse } | any = await signInAdmin({
  //       username: normalizedEmail,
  //       password: values.password,
  //       grant_type: '',
  //     })

  //     // Super admin session
  //     if (type === userTypes[0] && rol === userTypes[0]) {
  //       resetForm({
  //         values: { username: '', password: '', grant_type: '' },
  //       })
  //       showNotification(
  //         'danger',
  //         'Error',
  //         'Este usuario no pertenece a esta sesión'
  //       )
  //     }

  //     // Realtor session
  //     if (type === userTypes[1] && rol === userTypes[1]) {
  //       signIn({ username: normalizedEmail, password })
  //       showNotification('success', 'Éxito', 'Sesión iniciada exitosamente.')
  //     }

  //     // Customer session
  //     if (type === userTypes[2] && rol === userTypes[2]) {
  //       signIn({ username: normalizedEmail, password })
  //       showNotification('success', 'Éxito', 'Sesión iniciada exitosamente.')
  //     }
  //   } catch (err) {
  //     showNotification('warning', 'Error', `${err && err.message}`)
  //     resetForm({
  //       values: { username: '', password: '', grant_type: '' },
  //     })
  //   } finally {
  //     setSubmitting(false)
  //   }
  // }

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
