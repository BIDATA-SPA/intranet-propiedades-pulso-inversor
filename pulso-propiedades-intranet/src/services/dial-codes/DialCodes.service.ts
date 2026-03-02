import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getDialCodesQuery(builder: EndpointBuilderType) {
  return {
    getAllDialCodes: builder.query({
      query: ({ limit = 234, page = 1, paginated = false }) => ({
        url: `dial-code?page=${page}&limit=${limit}${
          paginated !== undefined ? `&paginated=${paginated}` : ''
        }`,
        method: 'get',
      }),

      providesTags: ['DialCodes'] as any,
    }),
  }
}
