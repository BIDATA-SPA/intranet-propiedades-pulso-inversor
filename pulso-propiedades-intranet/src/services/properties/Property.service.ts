/* eslint-disable @typescript-eslint/no-explicit-any */
import { Property } from '@/@types/modules/property.type'
import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreatePropertyBody } from './types/property.type'

export function getPropertiesQuery(builder: EndpointBuilderType) {
  return {
    getAllProperties: builder.query<PaginateResult<Property>, PaginateSearch>({
      query: ({
        limit,
        page,
        search = '',
        inExchange = false,
        sold = false,
        deRegistered = false,
        disabled = false,
        favorites = false,
        orderById = 'asc',
        orderByPrice = 'asc',
        currencyId = '',
      }) => ({
        url: `properties?page=${page}&limit=${limit}&search=${search}&inExchange=${inExchange}&sold=${sold}&deRegistered=${deRegistered}&disabled=${disabled}&favorites=${favorites}&orderById=${orderById}&orderByPrice=${orderByPrice}&currencyId=${currencyId}`,
        method: 'get',
      }),
      providesTags: ['Properties'] as any,
    }),

    getPropertyById: builder.query<Property, string>({
      query: (id: string) => ({ url: `properties/${id}`, method: 'get' }),
      providesTags: ['Properties'] as any,
    }),

    createProperty: builder.mutation<Property, CreatePropertyBody>({
      query: (body) => ({
        url: 'properties',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Properties'] as any,
    }),

    updateProperty: builder.mutation<Property, Partial<any> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `properties/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Properties'] as any,
    }),

    deleteProperty: builder.mutation<void, string>({
      query: (id) => ({
        url: `properties/${id}`,
        method: 'delete',
      }),
      invalidatesTags: ['Properties'] as any,
    }),

    createPropertyImages: builder.mutation({
      query: ({ id, body }) => ({
        url: `/properties/images/${id}`,
        method: 'POST',
        data: body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['Properties'] as any,
    }),

    deletePropertyImage: builder.mutation<void, { name: string }>({
      query: ({ name }) => ({
        url: `properties/images/${name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Properties'] as any,
    }),

    updateImageOrder: builder.mutation<
      void,
      { id: string; images: { id: number; number: number }[] }
    >({
      query: ({ id, images }) => ({
        url: `properties/images/${id}`,
        method: 'PATCH',
        data: { images },
      }),
      invalidatesTags: ['Properties'] as any,
    }),
  }
}
