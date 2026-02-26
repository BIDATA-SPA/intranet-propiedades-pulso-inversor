import ActionLink from '@/components/shared/ActionLink'
import PasswordInput from '@/components/shared/PasswordInput'
import { InputGroup } from '@/components/ui'
import Button from '@/components/ui/Button'
import { FormContainer, FormItem } from '@/components/ui/Form'
import type { InputProps } from '@/components/ui/Input'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { countryList } from '@/constants/countries.constant'
import useAuth from '@/utils/hooks/useAuth'
import useNotification from '@/utils/hooks/useNotification'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import type { FieldInputProps } from 'formik'
import { Field, FieldProps, Form, Formik } from 'formik'
import { ComponentType } from 'react'
import { HiCheck } from 'react-icons/hi'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import type { OptionProps, SingleValueProps } from 'react-select'
import { components } from 'react-select'
import { validationSchema } from '../schema'
import { SignUpFormProps, SignUpFormSchema } from '../types'

type CountryOption = {
  label: string
  dialCode: string
  value: string
}

const { SingleValue } = components

const PhoneSelectOption = ({
  innerProps,
  data,
  isSelected,
}: OptionProps<CountryOption>) => {
  return (
    <div
      className={`cursor-pointer flex items-center justify-between p-2 ${
        isSelected
          ? 'bg-gray-100 dark:bg-gray-500'
          : 'hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
      {...innerProps}
    >
      <div className="flex items-center gap-2">
        <span>
          {`${data?.label}`} {`(${data?.dialCode})`}
        </span>
        {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
      </div>
    </div>
  )
}

const PhoneControl = (props: SingleValueProps<CountryOption>) => {
  const selected = props.getValue()[0]
  return (
    <SingleValue {...props}>
      {selected && (
        <span>
          {selected?.label} {`(${selected?.dialCode})`}
        </span>
      )}
    </SingleValue>
  )
}

const NumberInput = (props: InputProps) => {
  return <Input {...props} value={props.field.value} />
}

const NumericFormatInput = ({
  onValueChange,
  ...rest
}: Omit<NumericFormatProps, 'form'> & {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  form: any
  field: FieldInputProps<unknown>
}) => {
  return (
    <NumericFormat
      customInput={Input as ComponentType}
      type="text"
      autoComplete="off"
      onValueChange={onValueChange}
      {...rest}
    />
  )
}

const SignUpCustomerForm = (props: SignUpFormProps) => {
  const {
    disableSubmit = false,
    className,
    signInUrl = '/iniciar-sesion',
  } = props
  const { signUpCustomer } = useAuth()

  const [_, setMessage] = useTimeOutMessage()
  const { showNotification } = useNotification()

  const countryOptions = countryList?.map((option) => ({
    value: `${option.id}`,
    label: `${option.country}`,
    dialCode: `${option.dialCode}`,
  }))

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
      dialCodeId,
      phone,
      planId: 1,
      rut: '',
      address: {
        street: '',
        countryId: null,
        stateId: null,
        cityId: null,
      },
      origin: 'pulsoPropiedades',
    }

    try {
      setSubmitting(true)

      const result = await signUpCustomer(payload)

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
          name: '',
          lastName: '',
          phone: '',
          dialCodeId: '',
          email: '',
          password: '',
          confirmPassword: '',
          origin: 'pulsoPropiedades',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          onSignUp(values, setSubmitting)

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

              <FormItem
                label="Teléfono celular"
                invalid={
                  (errors.dialCodeId && touched.dialCodeId) ||
                  (errors.phone && touched.phone)
                }
                errorMessage={errors.phone}
              >
                <InputGroup>
                  <Field name="dialCodeId">
                    {({ field, form }: FieldProps) => (
                      <Select<CountryOption>
                        className="min-w-[180px]"
                        placeholder="Cód. País"
                        components={{
                          Option: PhoneSelectOption,
                          SingleValue: PhoneControl,
                        }}
                        field={field}
                        form={form}
                        options={countryOptions}
                        value={countryOptions?.find(
                          (country) => country.value === values?.dialCodeId
                        )}
                        onChange={(country) =>
                          form.setFieldValue(field.name, country?.value)
                        }
                      />
                    )}
                  </Field>
                  <Field name="phone">
                    {({ field, form }: FieldProps) => {
                      return (
                        <NumericFormatInput
                          form={form}
                          field={field}
                          customInput={NumberInput as ComponentType}
                          placeholder="Teléfono celular"
                          onValueChange={(e) => {
                            form.setFieldValue(field.name, e.value)
                          }}
                        />
                      )
                    }}
                  </Field>
                </InputGroup>
              </FormItem>

              <FormItem
                label="Correo electrónico (E-mail de acceso)"
                invalid={errors.email && touched.email}
                errorMessage={errors.email}
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder="Ingresar e-mail"
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
                color="gray-500"
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

export default SignUpCustomerForm
