import type { SignInCredential, SignUpCredential } from '@/@types/auth'
import appConfig from '@/configs/app.config'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { RolesEnum } from '@/enums/roles.enum'
import {
  apiSignIn,
  apiSignOut,
  apiSignUp,
  apiSignUpCustomer,
} from '@/services/AuthService'
import {
  addRefreshTimeout,
  signInSuccess,
  signOutSuccess,
  useAppDispatch,
  useAppSelector,
} from '@/store'
import { useNavigate } from 'react-router-dom'
import openNotification from '../openNotification'
import { refreshSession } from '../refresh-session'
import useQuery from './useQuery'

type Status = 'success' | 'failed'

function useAuth() {
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const query = useQuery()

  const { token, signedIn, refreshTimeouts, rol } = useAppSelector(
    (state) => state.auth.session
  )

  const handleSignOut = () => {
    for (const timeout of refreshTimeouts) {
      clearTimeout(timeout)
    }

    dispatch(signOutSuccess())

    navigate(appConfig.unAuthenticatedEntryPath)
  }

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status
        message: string
      }
    | undefined
  > => {
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

      const redirectUrl = query.get(REDIRECT_URL_KEY)
      navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
      return {
        status: 'success',
        message: '',
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
          status: 'success',
          message: 'ok',
        }
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
        status: 'failed',
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
          status: 'success',
          message: 'ok',
        }
      }
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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
        status: 'failed',
        message:
          errors?.response?.data?.message ||
          errors.toString() ||
          'Este correo ya se encuentra registrado',
      }
    }
  }

  const signOut = async () => {
    await apiSignOut()

    handleSignOut()
  }

  return {
    authenticated: token && signedIn,
    isSuperAdmin: rol === RolesEnum.GERENTE,
    signIn,
    signUp,
    signOut,

    // customer session
    signUpCustomer,
  }
}

export default useAuth
