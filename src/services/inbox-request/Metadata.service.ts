import { PaginateSearch } from '@/@types/pagination'

import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { PaginatedExchangeEmailRequests } from './types/inbox-request'

export function getEmailRequestsMetadataQuery(builder: EndpointBuilderType) {
  return {
    getInboxMetadata: builder.query({
      query: () => ({
        url: `/properties/inbox-request-kanjeo-metadata`,
        method: 'get',
      }),
      providesTags: ['InboxMetadata'] as any,
    }),
    getRequestMetadata: builder.query<
      PaginateResult<PaginatedExchangeEmailRequests>,
      PaginateSearch
    >({
      query: () => ({
        url: `/properties/kanjeo-request-metadata`,
        method: 'get',
      }),
      providesTags: ['RequestMetadata'] as any,
    }),
  }
}
