import * as Yup from 'yup'

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Este campo es obligatorio.'),
  lastName: Yup.string().required('Este campo es obligatorio.'),
  phone: Yup.string().required('Este campo es obligatorio.'),
  dialCodeId: Yup.string().required('Este campo es obligatorio.'),
  referralCode: Yup.string().optional(),
  email: Yup.string()
    .email('Email no válido.')
    .required('Por favor, introduzca su e-mail.'),
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Tus contraseñas no coinciden.')
    .required('Este campo es obligatorio.'),
})
