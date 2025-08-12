import { PaginateSearch } from '@/@types/pagination'

import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import {
  PaginatedRealtorIdeas,
  RealtorIdeasPayload,
} from './types/realtor-ideas.type'

export function getRealtorIdeasQuery(builder: EndpointBuilderType) {
  return {
    getRealtorIdeas: builder.query<
      PaginateResult<PaginatedRealtorIdeas>,
      PaginateSearch
    >({
      query: ({ limit = 10, page = 1 }) => ({
        url: `ideas/?page=${page}&limit=${limit}`,
        method: 'get',
      }),
      providesTags: ['RealtorIdeas'] as any,
    }),
    sendRealtorIdea: builder.mutation<RealtorIdeasPayload, unknown>({
      query: (body) => ({
        url: '/ideas',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['RealtorIdeas'] as any,
    }),
    updateRealtorIdea: builder.mutation<RealtorIdeasPayload, unknown>({
      query: ({ id, ...body }) => ({
        url: `ideas/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['RealtorIdeas'] as any,
    }),
  }
}
