// src/services/portal/portalBridge.ts

import {
  mapSpcToPortalCreate,
  mapSpcToPortalUpdate,
} from './mappers/toPortalPublication'
import { portalApi } from './portaPublicationsApi'
import { SpcProperty } from './types'

export const bridgeCreateFromSpc = (spc: SpcProperty) => {
  const payload = mapSpcToPortalCreate(spc)
  return portalApi.endpoints.createPortalPublication.initiate(payload)
}

export const bridgeUpdateFromSpc = (spc: SpcProperty) => {
  const payload = mapSpcToPortalUpdate(spc)
  return portalApi.endpoints.updatePortalPublicationById.initiate({
    id: spc.id,
    body: payload,
  })
}
