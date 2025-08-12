import { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'
import { IMetadata } from './types/metadata.type'

export function getCustomerSearchMetadataQuery(builder: EndpointBuilderType) {
  return {
    getCustomerSearchMetadata: builder.query<IMetadata, void>({
      query: () => ({
        url: `/customer-search/metadata`,
        method: 'get',
      }),
      providesTags: ['CustomerSearch'] as any,
    }),
  }
}
