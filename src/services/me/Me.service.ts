import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getMeQuery(builder: EndpointBuilderType) {
  return {
    getMyInfo: builder.query<any, void>({
      query: () => ({
        url: 'me',
        method: 'get',
      }),
      providesTags: ['Me'], // Agregamos el Tag para caché
    }),
  }
}
