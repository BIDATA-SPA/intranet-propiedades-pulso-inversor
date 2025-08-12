import { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'
import { IMetadata } from './types/metadata.type'

export function getPropertiesMetadataQuery(builder: EndpointBuilderType) {
  return {
    getPropertiesMetadata: builder.query<IMetadata, void>({
      query: () => ({
        url: `/properties/metadata`,
        method: 'get',
      }),
      providesTags: ['Properties'] as any,
    }),
  }
}
