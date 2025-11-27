/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'
import type {
  PortalError402,
  PortalFindParams,
  PortalPublication,
  PortalPublicationCreate,
  PortalPublicationUpdate,
} from './portalPublication'

const BASE = `${import.meta.env.VITE_API_PDP}`

// Limpia filtros vacíos
const cleanQuery = (obj: Record<string, any>) => {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    if (typeof v === 'string' && v.trim() === '') continue
    out[k] = v
  }
  return out
}

export const getPortalPublicationsQuery = (builder: EndpointBuilderType) => ({
  // ─────────────────────────────
  // GET /publications/:id
  // ─────────────────────────────
  getPortalPublicationById: builder.query<
    PortalPublication,
    { id: string; pdpToken?: string } | string
  >({
    query: (arg) => {
      const id = typeof arg === 'string' ? arg : arg.id
      const pdpToken = typeof arg === 'string' ? undefined : arg.pdpToken
      return {
        url: `${BASE}/publications/${id}`,
        method: 'get',
        headers: pdpToken
          ? {
              Authorization: `Bearer ${pdpToken}`,
            }
          : undefined,
      }
    },
    providesTags: (_res, _err, arg) => {
      const id = typeof arg === 'string' ? arg : arg.id
      return [{ type: 'PortalPublication' as const, id }]
    },
  }),

  // ─────────────────────────────
  // GET /publications
  // ─────────────────────────────
  findPortalPublications: builder.query<
    { items: PortalPublication[]; total: number },
    (PortalFindParams & { pdpToken?: string }) | void
  >({
    query: (params) => {
      const { pdpToken, ...rest } = params || {}
      return {
        url: `${BASE}/publications`,
        method: 'get',
        params: cleanQuery({
          page: 1,
          page_size: 25,
          portal: 'pulsoPropiedades',
          ...rest,
        }),
        headers: pdpToken
          ? {
              Authorization: `Bearer ${pdpToken}`,
            }
          : undefined,
      }
    },
    transformResponse: (response: any, meta: any) => {
      const headers = meta?.headers ?? {}
      const headerTotal =
        headers['x-total-count'] ??
        headers['x-total'] ??
        headers['total'] ??
        headers['x-total-items']

      const items: PortalPublication[] = Array.isArray(response)
        ? response
        : response?.items ?? response?.data ?? []

      const total =
        headerTotal != null
          ? Number(headerTotal)
          : Array.isArray(response)
          ? response.total ?? response.count ?? items.length
          : response?.total ?? response?.count ?? items.length

      return { items, total: Number.isFinite(total) ? total : items.length }
    },
    providesTags: ['PortalPublication'] as any[],
  }),

  // ─────────────────────────────
  // POST /publications
  // ─────────────────────────────
  createPortalPublication: builder.mutation<
    PortalPublication,
    { body: PortalPublicationCreate; pdpToken: string }
  >({
    query: ({ body, pdpToken }) => ({
      url: `${BASE}/publications`,
      method: 'post',
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pdpToken}`, // <- correcto
      },
      transformRequest: [
        (data, headers) => {
          if (headers) {
            headers['Content-Type'] = 'application/json'
          }
          return JSON.stringify(data ?? {})
        },
      ],
    }),
    invalidatesTags: ['PortalPublication'] as any[],
  }),

  // ─────────────────────────────
  // PUT /publications/:id
  // ─────────────────────────────
  updatePortalPublicationById: builder.mutation<
    PortalPublication,
    { id: string; body: PortalPublicationUpdate; pdpToken: string }
  >({
    query: ({ id, body, pdpToken }) => ({
      url: `${BASE}/publication/${id}`,
      method: 'put',
      data: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pdpToken}`, // <- cambiado
      },
      transformRequest: [
        (data, headers) => {
          if (headers) headers['Content-Type'] = 'application/json'
          return JSON.stringify(data ?? {})
        },
      ],
    }),
    invalidatesTags: (_res, _err, { id }) => [
      { type: 'PortalPublication' as const, id },
    ],
  }),

  // ─────────────────────────────
  // DELETE /publications/:id
  // ─────────────────────────────
  deletePortalPublicationById: builder.mutation<
    PortalPublication[] | PortalError402,
    { id: string; pdpToken: string }
  >({
    query: ({ id, pdpToken }) => ({
      url: `${BASE}/publication/${id}`,
      method: 'delete',
      headers: {
        Authorization: `Bearer ${pdpToken}`, // <- cambiado
      },
    }),
    invalidatesTags: ['PortalPublication'] as any[],
  }),
})
