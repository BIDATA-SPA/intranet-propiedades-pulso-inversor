import { PaginateSearch } from '@/@types/pagination'

import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import {
  PaginatedSupportRequest,
  SupportRequestPayload,
} from './types/support.type'

export function getSupportRequestQuery(builder: EndpointBuilderType) {
  return {
    getSupportRequest: builder.query<
      PaginateResult<PaginatedSupportRequest>,
      PaginateSearch
    >({
      query: ({ limit = 10, page = 1 }) => ({
        url: `/support-tickets?page=${page}&limit=${limit}`,
        method: 'get',
      }),

      providesTags: ['SupportRequest'] as any,
    }),
    sendSupportRequest: builder.mutation<SupportRequestPayload, unknown>({
      query: (body) => ({
        url: '/support-tickets',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['SupportRequest'] as any,
    }),
    getSupportCategories: builder.query<
      { id: number; name: string; image: string }[],
      void
    >({
      query: () => ({
        url: '/support-tickets/categories',
        method: 'get',
      }),
    }),
  }
}
