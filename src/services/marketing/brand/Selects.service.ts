import { PaginateSearch } from '@/@types/pagination'

import {
  EndpointBuilderType,
  PaginateResult,
} from '../../core-entities/paginated-result.entity'
import { IBody, IItem, IPaginated, ServiceRequest } from './types'

export function getMarketingSelectsQuery(builder: EndpointBuilderType) {
  const API = '/service-request/'

  return {
    getServiceRequestPrices: builder.query<
      PaginateResult<IPaginated>,
      PaginateSearch
    >({
      query: () => ({
        url: `${API}prices`,
        method: 'get',
      }),
      transformResponse: (response: { data: IItem[] }) => {
        return response.data.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      },

      providesTags: ['ServiceRequestPrices'] as any,
    }),

    getServiceRequestTypes: builder.query<
      PaginateResult<IPaginated>,
      PaginateSearch
    >({
      query: () => ({
        url: `${API}types`,
        method: 'get',
      }),

      transformResponse: (response: { data: IItem[] }) => {
        return response.data.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      },
      providesTags: ['ServiceRequestTypes'] as any,
    }),

    getServiceRequestDates: builder.query<
      PaginateResult<IPaginated>,
      PaginateSearch
    >({
      query: () => ({
        url: `${API}dates`,
        method: 'get',
      }),

      transformResponse: (response: { data: IItem[] }) => {
        return response.data.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      },

      providesTags: ['ServiceRequestDates'] as any,
    }),

    getServiceRequestStatus: builder.query<
      PaginateResult<IPaginated>,
      PaginateSearch
    >({
      query: () => ({
        url: `${API}status`,
        method: 'get',
      }),

      transformResponse: (response: { data: IItem[] }) => {
        return response.data.map((item) => ({
          value: item.id,
          label: item.name,
        }))
      },

      providesTags: ['ServiceRequestStatus'] as any,
    }),

    sendServiceRequestBrand: builder.mutation<IBody, unknown>({
      query: (body) => ({
        url: `${API}`,
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['ServiceRequest'] as any,
    }),

    deleteServiceRequestBrand: builder.mutation<void, string>({
      query: (id) => ({
        url: `${API}${id}`,
        method: 'delete',
      }),
      invalidatesTags: ['ServiceRequest'] as any,
    }),

    // Filtred services by "Publicity campaign"
    getServiceRequestBrandPublicityCampaign: builder.query<
      PaginateResult<ServiceRequest>,
      PaginateSearch
    >({
      query: ({ limit, page, typeServiceId = 1 }) => ({
        url: `service-request?limit=${limit}&page=${page}&typeServiceId=${typeServiceId}`,
        method: 'get',
      }),
      providesTags: ['ServiceRequest'] as any,
    }),

    // Filtred services by "Brand campaign"
    getServiceRequestBrand: builder.query<
      PaginateResult<ServiceRequest>,
      PaginateSearch
    >({
      query: ({ limit, page, typeServiceId = 2 }) => ({
        url: `service-request?limit=${limit}&page=${page}&typeServiceId=${typeServiceId}`,
        method: 'get',
      }),
      providesTags: ['ServiceRequest'] as any,
    }),

    // Filtred services by "Web design"
    getServiceRequestBrandWebDesign: builder.query<
      PaginateResult<ServiceRequest>,
      PaginateSearch
    >({
      query: ({ limit, page, typeServiceId = 3 }) => ({
        url: `service-request?limit=${limit}&page=${page}&typeServiceId=${typeServiceId}`,
        method: 'get',
      }),
      providesTags: ['ServiceRequest'] as any,
    }),
  }
}
