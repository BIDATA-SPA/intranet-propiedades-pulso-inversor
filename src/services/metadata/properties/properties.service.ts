/* eslint-disable @typescript-eslint/no-explicit-any */
import { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'

export function getPropertiesMetadataQuery(builder: EndpointBuilderType) {
  return {
    getPropertiesMetadata: builder.query({
      query: () => ({
        url: `/properties/metadata`,
        method: 'get',
      }),
      providesTags: ['Properties'] as any,
    }),
  }
}
