import { PaginateSearch } from '@/@types/pagination'

import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import {
  EmailExternalServicesRequestPayload,
  EmailRequestPayload,
  PaginatedExchangeEmailRequests,
} from './types/inbox-request'

export function getEmailRequestsQuery(builder: EndpointBuilderType) {
  return {
    // Get all YoKanjeo email requests
    getExchangeEmailRequest: builder.query<
      PaginateResult<PaginatedExchangeEmailRequests>,
      PaginateSearch
    >({
      query: ({ limit = 10, page = 1 }) => ({
        url: `/properties/get-kanjeo-requests?page=${page}&limit=${limit}`,
        method: 'get',
      }),
      providesTags: ['KanjeoRequestsSent'] as any,
    }),

    // Get all Inbox YoKanjeo email request
    getExchangeEmailInbox: builder.query<
      PaginateResult<PaginatedExchangeEmailRequests>,
      PaginateSearch
    >({
      query: ({ limit = 10, page = 1 }) => ({
        url: `/properties/inbox-requests-kanjeo?page=${page}&limit=${limit}`,
        method: 'get',
      }),
      providesTags: ['KanjeoRequestsInbox'] as any,
    }),

    sendExchangeEmailRequest: builder.mutation<
      {
        name: string
        lastName: string
        to: string
        propertyId: string | number
        typeId: number
        phone: string
        realtorFrom: string
        subject: string
        message: string
      },
      EmailRequestPayload
    >({
      query: (body) => ({
        url: '/properties/send-realtor-contact-email',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['ExchangeRequest'] as any,
    }),

    // External services requests ✅
    sendExternalServicesEmailRequest: builder.mutation<
      {
        to: string
        customerId: number
        externalServiceId: number
        realtorFrom: string
        subject: string
        message: string
      },
      EmailExternalServicesRequestPayload
    >({
      query: (body) => ({
        url: '/external-services/send-external-service-request',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['ExternalServicesRequest'] as any,
    }),

    getExternalServicesEmailRequest: builder.query<
      PaginateResult<PaginatedExchangeEmailRequests>,
      PaginateSearch
    >({
      query: ({ limit = 10, page = 1 }) => ({
        url: `/external-services/external-service-request?page=${page}&limit=${limit}`,
        method: 'get',
      }),
      providesTags: ['ExternalServicesRequest'] as any,
    }),
  }
}
