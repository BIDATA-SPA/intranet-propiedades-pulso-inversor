/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { RolesEnum } from '@/enums/roles.enum'
import {
  apiSignIn,
  apiSignUp,
  apiSignUpCustomer,
  apiSignUpWebinar,
} from '@/services/AuthService'
import { useGetPdpTokenMutation } from '@/services/RtkQueryService'
import {
  addRefreshTimeout,
  signInSuccess,
  signOutSuccess,
  useAppDispatch,
  useAppSelector,
} from '@/store'
import { setPdpToken } from '@/store/slices/auth/pdpAuthSlice'
import { useNavigate } from 'react-router-dom'
import openNotification from '../openNotification'
import { refreshSession } from '../refresh-session'
import useQuery from './useQuery'

type Status = 'success' | 'failed'

const ONE_HOUR_MS = 60 * 60 * 1000 // 1 hora

function useAuth() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const query = useQuery()

  const { token, signedIn, rol } = useAppSelector((state) => state.auth.session)

  // servicio que trae el token PDP
  const [fetchPdpToken] = useGetPdpTokenMutation()

  const handleSignOut = () => {
    // limpia sesión de PDP
    dispatch(
      signInSuccess({
        access_token: null,
        refresh_token: null,
        expirationInSeconds: null,
        type: null,
        rol: null,
        sede: null,
      })
    )
    dispatch(signOutSuccess())

    // limpia token de PDP
    dispatch(
      setPdpToken({
        token: '',
        ttlMs: -1,
      })
    )
  }

  const signIn = async (
    values: SignInCredential
  ): Promise<{ status: Status; message: string } | undefined> => {
    try {
      const resp = await apiSignIn(values)
      if (!resp.data) {
        return
      }

      const {
        access_token,
        refresh_token,
        expirationInSeconds,
        type,
        rol,
        sede,
      } = resp.data
      dispatch(
        signInSuccess({
          access_token,
          refresh_token,
          expirationInSeconds,
          type,
          rol,
          sede,
        })
      )

      const timeout = setTimeout(async () => {
        await refreshSession()
      }, expirationInSeconds * 1000)
      dispatch(addRefreshTimeout({ timeout }))

      try {
        const { token: pdpToken } = await fetchPdpToken().unwrap()

        dispatch(
          setPdpToken({
            token: pdpToken,
            ttlMs: ONE_HOUR_MS,
          })
        )
      } catch (pdpErr) {
        //
      }

      const redirectUrl = query.get(REDIRECT_URL_KEY)
      navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)

      return {
        status: 'success',
        message: '',
      }
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.message || errors.toString(),
      }
    }
  }

  const signUp = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUp(values)
      if (resp.data) {
        openNotification(
          'success',
          'Registro Completo',
          '¡Cuenta creada exitosamente! Revise la bandeja de entrada de su e-mail para verificar la cuenta.',
          4
        )

        setTimeout(() => {
          navigate(appConfig.unAuthenticatedEntryPath)
        }, 4 * 1000)

        return {
          status: 'success' as const,
          message: 'ok',
        }
      }
    } catch (errors: any) {
      openNotification(
        'warning',
        'Error al crear cuenta',
        'Al parecer este correo ya se encuentra registrado. Por favor, recupera tu contraseña o utiliza un correo diferente.',
        4
      )

      setTimeout(() => {
        navigate('/crear-cuenta')
      }, 4 * 1000)

      return {
        status: 'failed' as const,
        message:
          errors?.response?.data?.message ||
          errors.toString() ||
          'Este correo ya se encuentra registrado',
      }
    }
  }

  const signUpCustomer = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUpCustomer(values)
      if (resp.data) {
        openNotification(
          'success',
          'Registro Completo',
          '¡Cuenta creada exitosamente! Revise la bandeja de entrada de su e-mail para verificar la cuenta.',
          4
        )

        setTimeout(() => {
          navigate(appConfig.unAuthenticatedEntryPath)
        }, 4 * 1000)

        return {
          status: 'success' as const,
          message: 'ok',
        }
      }
    } catch (errors: any) {
      openNotification(
        'warning',
        'Error al crear cuenta',
        'Al parecer este correo ya se encuentra registrado. Por favor, recupera tu contraseña o utiliza un correo diferente.',
        4
      )

      setTimeout(() => {
        navigate('/crear-cuenta')
      }, 4 * 1000)

      return {
        status: 'failed' as const,
        message:
          errors?.response?.data?.message ||
          errors.toString() ||
          'Este correo ya se encuentra registrado',
      }
    }
  }

  const signUpWebinar = async (values: SignUpCredential) => {
    try {
      const resp = await apiSignUpWebinar(values)
      if (resp.data) {
        openNotification(
          'success',
          'Registro Completo',
          '¡Registro exitoso! Redireccionando...',
          4
        )

        setTimeout(() => {
          window.location.href = 'https://procanje.com/evento-webinar'
        }, 4 * 1000)

        return {
          status: 'success' as const,
          message: 'ok',
        }
      }
    } catch (errors: any) {
      openNotification(
        'warning',
        'Error al crear cuenta',
        'Al parecer este correo ya se encuentra registrado. Por favor, utiliza un correo diferente.',
        4
      )

      setTimeout(() => {
        navigate('/webinar')
      }, 4 * 1000)

      return {
        status: 'failed' as const,
        message:
          errors?.response?.data?.message ||
          errors.toString() ||
          'Este correo ya se encuentra registrado',
      }
    }
  }

  const signOut = async () => {
    handleSignOut()
    navigate('/iniciar-sesion')
  }

  return {
    authenticated: token && signedIn,
    isSuperAdmin: rol === RolesEnum.GERENTE,
    signIn,
    signUp,
    signOut,
    signUpCustomer,
    signUpWebinar,
  }
}

export default useAuth
