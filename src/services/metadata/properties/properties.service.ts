/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'

export type GetPropertiesMetadataParams = {
  cacheUserKey: string
}

export type PropertiesMetadataResponse = {
  totalProperties: number
  totalPropertiesInExchange: number
  totalPropertiesSold: number
}

export function getPropertiesMetadataQuery(builder: EndpointBuilderType) {
  return {
    getPropertiesMetadata: builder.query<
      PropertiesMetadataResponse,
      GetPropertiesMetadataParams
    >({
      query: () => ({
        url: '/properties/metadata',
        method: 'get',
      }),
      providesTags: ['PropertiesMetadata'] as any,
    }),
  }
}
