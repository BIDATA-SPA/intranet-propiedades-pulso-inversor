import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { RatingUser, RatingUserByCustomer, RatingUserSendEmail } from './types'

export function getUserRatingQuery(builder: EndpointBuilderType) {
  return {
    getAllRatingUsers: builder.query({
      query: ({ limit, page, search = '', paginated = true }) => ({
        url: `user-rating?page=${page}&limit=${limit}&search=${search}&paginated=${paginated}`,
        method: 'get',
      }),
      providesTags: ['UserRating'] as any,
    }),

    createRatingUser: builder.mutation<RatingUser, RatingUser>({
      query: (body) => ({ url: 'user-rating', method: 'post', data: body }),
      invalidatesTags: ['UserRating'] as any,
    }),

    createRatingUserByCustomer: builder.mutation<
      RatingUserByCustomer,
      RatingUserByCustomer
    >({
      query: (body) => ({
        url: 'user-rating/customer',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['UserRating'] as any,
    }),

    createRatingUserSendMail: builder.mutation<
      RatingUserSendEmail,
      RatingUserSendEmail
    >({
      query: (body) => ({
        url: 'user-rating/customer/send-email',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['UserRating'] as any,
    }),
  }
}
