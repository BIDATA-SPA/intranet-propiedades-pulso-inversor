/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'

export const getPdpAuthQuery = (builder: EndpointBuilderType) => ({
  getPdpToken: builder.mutation<{ token: string }, void>({
    query: () => ({
      url: import.meta.env.VITE_LOGIN_CUSTOM_TOKEN,
      method: 'post',
      data: {},
      headers: {
        'X-Api-Key': import.meta.env.VITE_PORTAL_PDP_TOKEN_KEY,
        'Content-Type': 'application/json',
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
  }),
})
