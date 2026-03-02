import type { CommonProps } from '@/@types/common'
import ActionLink from '@/components/shared/ActionLink'
import PasswordInput from '@/components/shared/PasswordInput'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import useAuth from '@/utils/hooks/useAuth'
import useNotification from '@/utils/hooks/useNotification'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import { useParams, useSearchParams } from 'react-router-dom'
import { components } from 'react-select'
import * as Yup from 'yup'

interface SignUpFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

type SignUpFormSchema = {
  name: string
  lastName: string
  dialCodeId: string
  phone: string
  email: string
  password: string
  referralCode?: string
  origin: string
}

const COMPANY_DOMAIN = '@pulsopropiedades.cl'
const EMAIL_DOMAIN_REGEX = /^[^\s@]+@pulsopropiedades\.cl$/i

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Este campo es obligatorio.'),
  lastName: Yup.string().required('Este campo es obligatorio.'),
  phone: Yup.string().optional(),
  dialCodeId: Yup.string().optional(),
  referralCode: Yup.string().optional(),
  origin: Yup.string().optional(),

  email: Yup.string()
    .transform((v) => (v ? v.trim().toLowerCase() : v))
    .email('Email no válido.')
    .required('Por favor, introduzca su e-mail.')
    .matches(
      EMAIL_DOMAIN_REGEX,
      'El correo o dominio no pertenece a Pulso Propiedades'
    ),

  password: Yup.string()
    .min(8, 'Debe tener al menos 8 caracteres')
    .matches(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .matches(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .matches(/\d/, 'Debe contener al menos un número')
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      'Debe contener al menos un carácter especial (,.*&%)'
    )
    .notOneOf(
      ['password', '123456', 'google', 'contraseña', '12345678'],
      'No debe ser una palabra común o muy predecible'
    )
    .required('La contraseña es obligatoria'),

  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Tus contraseñas no coinciden.'
  ),
})

type CountryOption = {
  label: string
  dialCode: string
  value: string
}

const { SingleValue } = components

const SignUpForm = (props: SignUpFormProps) => {
  const {
    disableSubmit = false,
    className,
    signInUrl = '/iniciar-sesion',
  } = props
  const [searchParams] = useSearchParams()
  const { signUp } = useAuth()
  const [_, setMessage] = useTimeOutMessage()
  const { referralCode } = useParams()
  const { showNotification } = useNotification()

  const onSignUp = async (
    values: SignUpFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const { name, lastName, password, email, dialCodeId, phone } = values
    const normalizedEmail = email.toLowerCase().trim()

    const payload = {
      name,
      lastName,
      password,
      email: normalizedEmail,
      phone,
      dialCodeId,
      origin: 'pulsoPropiedades',
      ...(referralCode ? { referralCode } : {}),
    }

    try {
      setSubmitting(true)
      const result = await signUp(payload)

      if (result?.status === 'failed') {
        setMessage(result.message)
      }

      setSubmitting(false)
    } catch (error) {
      showNotification(
        'danger',
        'Error',
        '¡Ha ocurrido un error al crear tu usuario, ¡inténtalo más tarde!'
      )
    }
  }

  return (
    <div className={className}>
      <Formik
        initialValues={{
          name: searchParams.get('name') ?? '',
          lastName: searchParams.get('lastName') ?? '',
          phone: '',
          dialCodeId: '',
          email: searchParams.get('email') ?? '',
          password: '',
          confirmPassword: '',
          referralCode: '',
          origin: 'pulsoPropiedades',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignUp(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ values, touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:gap-5 mt-4">
                <FormItem
                  label="Nombre"
                  invalid={errors.name && touched.name}
                  errorMessage={errors.name}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="name"
                    placeholder="Ingresar Nombre"
                    component={Input}
                  />
                </FormItem>

                <FormItem
                  label="Apellidos"
                  invalid={errors.lastName && touched.lastName}
                  errorMessage={errors.lastName}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="lastName"
                    placeholder="Ingresar Apellidos"
                    component={Input}
                  />
                </FormItem>
              </div>

              {/* End phone */}
              <FormItem
                label="Correo electrónico (E-mail de acceso)"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder={`usuario${COMPANY_DOMAIN}`}
                  component={Input}
                />
              </FormItem>

              <FormItem
                label="Contraseña"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="Ingrese su contraseña"
                  component={PasswordInput}
                />
                <small>
                  Crea una contraseña segura con letras, números y símbolos
                  combinados.
                </small>
              </FormItem>
              <FormItem
                label="Confirmar contraseña"
                invalid={errors.confirmPassword && touched.confirmPassword}
                errorMessage={errors.confirmPassword}
              >
                <Field
                  autoComplete="off"
                  name="confirmPassword"
                  placeholder="Confirme su contraseña"
                  component={PasswordInput}
                />
              </FormItem>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? 'Creando cuenta...' : 'Registrarse'}
              </Button>
              <div className="mt-4 text-center text-base">
                <span>¿Ya tiene una cuenta? </span>
                <ActionLink to={signInUrl}>Acceder</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignUpForm
