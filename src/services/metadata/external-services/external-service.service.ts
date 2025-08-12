import { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'
import { IMetadata } from './types/metadata.type'

export function getExternalServiceMetadataQuery(builder: EndpointBuilderType) {
  return {
    getExternalServicesMetadata: builder.query<IMetadata, void>({
      query: () => ({
        url: `/external-services/metadata`,
        method: 'get',
      }),
      providesTags: ['ExternalService'] as any,
    }),
  }
}
