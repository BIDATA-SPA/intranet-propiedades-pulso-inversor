import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { VisitOrd, CreateVisitOrd } from './types/calendar.type'

export function getVisitOrderQuery(builder: EndpointBuilderType) {
  return {
    createVisitOrder: builder.mutation<VisitOrd, CreateVisitOrd>({
      query: (body) => ({
        url: 'calendar/visit-order',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['VisitOrd'] as any,
    }),

    patchVisitOrder: builder.mutation<
      VisitOrd,
      Partial<CreateVisitOrd> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `calendar/visit-order/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['VisitOrd'] as any,
    }),

    getVisitOrder: builder.query<VisitOrd, void>({
      query: () => ({
        url: 'calendar/visit-order',
        method: 'get',
      }),
      providesTags: ['VisitOrd'] as any,
    }),
  }
}
