/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getAddressPreferencesQuery(builder: EndpointBuilderType) {
  return {
    getPreferredAreas: builder.query({
      query: () => ({
        url: `/me/preferred-areas`,
        method: 'get',
      }),
      providesTags: ['PreferredAreas', 'Me'] as any,
    }),

    sendPreferredAreas: builder.mutation({
      query: (body) => ({
        url: '/me/preferred-areas',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['PreferredAreas'] as any,
    }),
  }
}
