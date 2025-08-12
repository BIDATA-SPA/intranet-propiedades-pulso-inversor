import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export function getUserImageQuery(builder: EndpointBuilderType) {
  return {
    getUserImage: builder.query<void, string>({
      query: (name: string) => ({
        url: `users/image/${name}`,
        method: 'get',
        responseType: 'blob',
      }),
      providesTags: ['UserImage'] as any,
    }),

    createUserImage: builder.mutation({
      query: ({ id, body }: { id: string; body: FormData }) => ({
        url: `users/image/${id}`,
        method: 'POST',
        data: body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['UserImage'] as any,
    }),

    deleteUserImage: builder.mutation<void, { name: string }>({
      query: ({ name }) => ({
        url: `users/image/${name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['UserImage'] as any,
    }),
  }
}
