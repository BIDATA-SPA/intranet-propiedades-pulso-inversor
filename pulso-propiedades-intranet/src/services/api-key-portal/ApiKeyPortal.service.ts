import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getApiKeyPortalQuery(builder: EndpointBuilderType) {
  return {
    patchApiKeyGenerate: builder.mutation({
      query: ({ id }) => ({
        url: `/users/apikey/generate/${id}`,
        method: 'patch',
      }),
      invalidatesTags: ['ApiKeyPortal', 'Me'] as any,
    }),

    patchApiKeyDeactivate: builder.mutation({
      query: ({ id }) => ({
        url: `/users/apikey/deactivate/${id}`,
        method: 'patch',
      }),
      invalidatesTags: ['ApiKeyPortal', 'Me'] as any,
    }),
  }
}
