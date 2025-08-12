/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getReferredRealtorQuery(builder: EndpointBuilderType) {
  return {
    getAllReferredRealtor: builder.query({
      query: ({ limit, page, search = '', paginated = true }) => ({
        url: `user-referral?page=${page}&limit=${limit}&search=${search}&paginated=${paginated}`,
        method: 'get',
      }),
      providesTags: ['ReferredRealtor'] as any,
    }),
  }
}
