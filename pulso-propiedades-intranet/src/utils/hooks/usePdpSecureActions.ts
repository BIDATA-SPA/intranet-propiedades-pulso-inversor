import type {
  PortalPublicationCreate,
  PortalPublicationUpdate,
} from '@/services/portal/portalPublication'
import {
  useCreatePortalPublicationMutation,
  useDeletePortalPublicationByIdMutation,
  useGetPdpTokenMutation,
  useUpdatePortalPublicationByIdMutation,
} from '@/services/RtkQueryService'
import { RootState, useAppDispatch, useAppSelector } from '@/store'
import { setPdpToken } from '@/store/slices/auth/pdpAuthSlice'
import { useCallback } from 'react'

const ONE_HOUR_MS = 60 * 60 * 1000

export function usePdpSecureActions() {
  const dispatch = useAppDispatch()
  const { token, expiresAt } = useAppSelector(
    (state: RootState) => state.pdpAuth
  )

  const [fetchPdpToken] = useGetPdpTokenMutation()
  const [createPortalPublication] = useCreatePortalPublicationMutation()
  const [updatePortalPublicationById] = useUpdatePortalPublicationByIdMutation()
  const [deletePortalPublicationById] = useDeletePortalPublicationByIdMutation()

  // Garantiza token PDP válido
  const ensureToken = useCallback(async (): Promise<string> => {
    const stillValid = token && expiresAt && Date.now() < expiresAt

    if (stillValid) {
      return token as string
    }

    const res = await fetchPdpToken().unwrap()
    const fresh = res.token

    dispatch(
      setPdpToken({
        token: fresh,
        ttlMs: ONE_HOUR_MS,
      })
    )

    return fresh
  }, [token, expiresAt, fetchPdpToken, dispatch])

  // CREATE
  const secureCreate = useCallback(
    async (body: PortalPublicationCreate) => {
      const pdpToken = await ensureToken()
      return createPortalPublication({
        body,
        pdpToken,
      }).unwrap()
    },
    [ensureToken, createPortalPublication]
  )

  // UPDATE
  const secureUpdate = useCallback(
    async (id: string, body: PortalPublicationUpdate) => {
      const pdpToken = await ensureToken()
      return updatePortalPublicationById({
        id,
        body,
        pdpToken,
      }).unwrap()
    },
    [ensureToken, updatePortalPublicationById]
  )

  // DELETE
  const secureDelete = useCallback(
    async (id: string) => {
      const pdpToken = await ensureToken()
      return deletePortalPublicationById({
        id,
        pdpToken,
      }).unwrap()
    },
    [ensureToken, deletePortalPublicationById]
  )

  return {
    ensureToken,
    secureCreate,
    secureUpdate,
    secureDelete,
  }
}
