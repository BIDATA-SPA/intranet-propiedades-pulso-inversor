import * as Yup from 'yup'

export function toAbsoluteUrl(hostOrPath?: string | null) {
  if (!hostOrPath) return null
  let s = String(hostOrPath).trim()
  if (/^https?:\/\//i.test(s)) return s
  s = s.replace(/^\/+|\/+$/g, '')
  return `https://${s}`
}

// opcional: normalizar onBlur igual que en el schema .transform()
export function normalizeWebLikeSchema(val?: string | null) {
  if (!val) return val ?? ''
  let s = String(val).trim()
  s = s.replace(/^(https?:)?\/\//i, '') // quita http(s):// o //
  s = s.replace(/^\/+|\/+$/g, '') // quita / inicial/final
  return s.toLowerCase()
}

const validationSchema = Yup.object().shape({})

export const WEBPAGE_HOST_RE = /^www\.[a-z0-9-]+(\.[a-z0-9-]+)+([\/][^\s]*)?$/i

export const webPageSchema = Yup.string()
  .trim()
  .nullable()
  .notRequired()
  .test(
    'is-http-or-https-url',
    'Ingresa una URL válida que comience con http:// o https://',
    (value) => {
      if (!value) return true // opcional
      try {
        const u = new URL(value)
        // Debe ser http(s)
        if (!/^https?:$/.test(u.protocol)) return false
        // host presente y con al menos un punto (dominio.tld)
        if (!u.hostname || !u.hostname.includes('.')) return false
        return true
      } catch {
        return false
      }
    }
  )
  // (opcional) evita URLs absurdamente largas
  .max(2048, 'La URL es demasiado larga')

const validationEditSchema = Yup.object().shape({
  name: Yup.string().required('Este campo es requerido'),
  lastName: Yup.string().required('Este campo es requerido'),
  phone: Yup.string().optional(),
  dialCodeId: Yup.string().optional(),
  webPage: webPageSchema,
})

const validationPreferenceAddressSchema = Yup.object().shape({
  preferences: Yup.array()
    .of(
      Yup.object().shape({
        countryId: Yup.number()
          .required('Seleccione un País')
          .typeError('Seleccione un País válido'),
        stateId: Yup.number()
          .required('Seleccione una Región')
          .typeError('Seleccione una Región válida'),
        cityIds: Yup.array()
          .of(Yup.number().required('Seleccione al menos una Comuna'))
          .min(1, 'Seleccione al menos una Comuna')
          .required('Seleccione al menos una Comuna'),
      })
    )
    .min(1, 'Debe agregar al menos una preferencia')
    .max(5, 'Solo puede tener hasta 5 preferencias')
    .test(
      'no-duplicate-cities',
      'No puede seleccionar la misma comuna más de una vez',
      function (preferences) {
        if (!preferences) return true

        const allCityIds = preferences.flatMap((pref) => pref.cityIds || [])
        const uniqueCityIds = new Set(allCityIds)

        return allCityIds.length === uniqueCityIds.size
      }
    ),
})

export {
  validationEditSchema,
  validationPreferenceAddressSchema,
  validationSchema,
}
