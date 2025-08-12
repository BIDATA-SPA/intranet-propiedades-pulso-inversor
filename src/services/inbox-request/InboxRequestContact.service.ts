/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getAliedRealtorRequestQuery(builder: EndpointBuilderType) {
  return {
    getAllAliedRealtorRequest: builder.query({
      query: ({ limit, page, search = '', filterType = 'all' }) => ({
        url: `user-interaction?page=${page}&limit=${limit}&search=${search}&filterType=${filterType}`,
        method: 'get',
      }),
      providesTags: ['AliedRealtorRequest'] as any,
    }),
  }
}
