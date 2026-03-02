import appConfig from '@/configs/app.config'
import { REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE } from '@/constants/api.constant'
import { PERSIST_STORE_NAME } from '@/constants/app.constant'
import deepParseJson from '@/utils/deepParseJson'
import axios from 'axios'
import store, { signOutSuccess } from '../store'

const unauthorizedCode = [401]

const PDP_BASE = import.meta.env.VITE_API_PDP

const BaseService = axios.create({
  timeout: 60000,
  baseURL: appConfig.apiUrl,
})

BaseService.interceptors.request.use(
  (config) => {
    // 1) si YA viene un Authorization (por ejemplo de PDP), NO lo toquemos
    if (config.headers && config.headers.Authorization) {
      return config
    }

    // 2) si la petición va al BFF PDP, tampoco inyectamos el token de Pulso Propiedades
    //    porque PDP usa su propio token
    const targetUrl = (config.baseURL || '') + (config.url || '')
    const isPdpRequest = PDP_BASE && targetUrl.startsWith(PDP_BASE) // https://bff.portaldeportales.cl/...

    if (isPdpRequest) {
      // dejamos pasar tal cual; ya vendrá el header desde la mutation / hook seguro
      return config
    }

    // 3) flujo normal Pulso Propiedades: inyecta token de sesión
    const rawPersistData = localStorage.getItem(PERSIST_STORE_NAME)
    const persistData = deepParseJson(rawPersistData)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let accessToken = (persistData as any).auth?.session?.token

    if (!accessToken) {
      const { auth } = store.getState()
      accessToken = auth?.session?.token
    }

    if (accessToken) {
      // aquí sí metemos el de Pulso Propiedades
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

BaseService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error
    const { auth } = store.getState()

    // ¿esta respuesta viene del BFF PDP?
    const targetUrl = ((config &&
      (config.baseURL || '') + (config.url || '')) ||
      '') as string
    const isPdpResponse =
      PDP_BASE && typeof targetUrl === 'string'
        ? targetUrl.startsWith(PDP_BASE)
        : false

    // si es PDP y dio 401, NO cierres sesión de Pulso Propiedades
    if (
      response &&
      unauthorizedCode.includes(response.status) &&
      !isPdpResponse
    ) {
      for (const timeout of auth.session.refreshTimeouts) {
        clearTimeout(timeout)
      }
      store.dispatch(signOutSuccess())
    }

    // devolvemos el payload de error como lo tenías
    return Promise.reject(error?.response?.data || error)
  }
)

export default BaseService
