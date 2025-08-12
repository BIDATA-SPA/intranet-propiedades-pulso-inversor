import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export const deleteEventService = (builder: EndpointBuilderType) => ({

  deleteEvent: builder.mutation<void, string>({
    query: (id) => ({
      url: `/calendar/${id}`, 
      method: 'DELETE',
    }),
    invalidatesTags: [{ type: 'Event', id: 'LIST' }], 
  }),
})
