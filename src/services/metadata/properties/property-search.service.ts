import { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'
import { IMetadata } from './types/metadata.type'

export function getPropertySearchMetadataQuery(builder: EndpointBuilderType) {
  return {
    getPropertySearchMetadata: builder.query<IMetadata, void>({
      query: () => ({
        url: `/properties/box-metadata`,
        method: 'get',
      }),
      providesTags: ['PropertySearch'] as any,
    }),
  }
}
