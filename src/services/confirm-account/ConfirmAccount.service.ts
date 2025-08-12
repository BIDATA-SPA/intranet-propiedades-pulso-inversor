import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { ConfirmTokenPayload } from './types/confirm-account.type'

export function getConfirmAccountQuery(builder: EndpointBuilderType) {
  return {
    sendConfirmAccountToken: builder.mutation<ConfirmTokenPayload, unknown>({
      query: (body) => ({
        url: '/users/confirm-account',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['ConfirmAccountToken'] as any,
    }),
  }
}
