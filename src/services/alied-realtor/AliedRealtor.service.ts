/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getAliedRealtorQuery(builder: EndpointBuilderType) {
  return {
    getAllAliedRealtor: builder.query({
      query: ({ limit, page, search = '', orderByRating = 'desc' }) => ({
        url: `users?page=${page}&limit=${limit}&search=${search}&orderByRating=${orderByRating}`,
        method: 'get',
      }),
      providesTags: ['AliedRealtor'] as any,
    }),

    createContactEmailAliedRealtor: builder.mutation({
      query: (body) => ({
        url: 'user-interaction',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['UserInteraction'] as any,
    }),
  }
}
