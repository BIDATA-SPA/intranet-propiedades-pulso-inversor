import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import {
  InboxRequestStatuses,
  UpdateKanjeoRequestStatusBody,
  requestApplicantSignatureBody,
} from './types/inbox-request'

export function getInboxRequestStatusesQuery(builder: EndpointBuilderType) {
  return {
    getAllStatuses: builder.query({
      query: () => ({
        url: `/properties/kanjeo-requets-statuses`,
        method: 'get',
      }),
      transformResponse: (response: InboxRequestStatuses[]) => {
        return response.map((status) => ({
          value: status.id,
          label: status.name,
        }))
      },
    }),

    updateKanjeoRequestsStatus: builder.mutation<
      UpdateKanjeoRequestStatusBody,
      UpdateKanjeoRequestStatusBody
    >({
      query: (body) => ({
        url: 'properties/update-kanjeo-requests-status',
        method: 'post',
        data: body,
      }),
      invalidatesTags: [
        { type: 'KanjeInboxRequest' },
        { type: 'KanjeSentRequest' },
        { type: 'ExternalServicesRequest' },
      ] as never,
    }),

    // Signature contract
    requestApplicantSignature: builder.mutation<
      requestApplicantSignatureBody,
      { kanjeoRequestId: number }
    >({
      query: (body) => ({
        url: 'properties/kanjeo-request-applicant-signature',
        method: 'post',
        data: body,
      }),
      invalidatesTags: [{ type: 'RequestApplicantSignature' }] as never,
    }),
  }
}
