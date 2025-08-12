import { EndpointBuilderType } from '@/services/core-entities/paginated-result.entity'
import { TMetaData } from './types/metadata.type'

export function getReferralRealtorMetadataQuery(builder: EndpointBuilderType) {
  return {
    getReferralRealtorMetadata: builder.query<TMetaData, void>({
      query: () => ({
        url: `/user-referral/metadata`,
        method: 'get',
      }),
      providesTags: ['ReferralRealtorMetadata'] as any,
    }),
  }
}
