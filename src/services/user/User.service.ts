import { PaginateSearch } from '@/@types/pagination'
import { Select } from '@/@types/select'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { User } from './types/user.type'

export function getUsersQuery(builder: EndpointBuilderType) {
  return {
    getAllUsers: builder.query<
      PaginateResult<User> | Select[],
      PaginateSearch & {
        search?: string
        paginated?: boolean
        orderByRating?: string
        transformToSelectOptions?: boolean
      }
    >({
      query: ({ limit, page, search, paginated, orderByRating = 'desc' }) => ({
        url: `users?${page ? `page=${page}` : ''}${
          limit ? `&limit=${limit}` : ''
        }${search ? `&search=${search}` : ''}${
          paginated !== undefined ? `&paginated=${paginated}` : ''
        }${orderByRating ? `orderByRating=${orderByRating}` : ''}`,
        method: 'get',
      }),

      transformResponse: (
        baseQueryReturnValue: PaginateResult<User> | Select[],
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return (baseQueryReturnValue as unknown as User[]).map((item) => ({
            value: parseInt(item.id),
            label: `${item.name} ${item.lastName}`,
          }))
        }

        return baseQueryReturnValue
      },

      providesTags: ['Users'] as any,
    }),

    getAllUsersMetaData: builder.query<
      { totalUsers: number; activeUsers: number; newUsers: number },
      {}
    >({ query: () => ({ url: 'users/metadata', method: 'get' }) }),

    getUserById: builder.query<User, string>({
      query: (id: string) => ({ url: `users/${id}`, method: 'get' }),
      providesTags: ['Users'] as any,
    }),

    updateUser: builder.mutation<
      User,
      Pick<User, 'name' | 'lastName'> & {
        email: string
        rolId: number
        id: string
      }
    >({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Users'] as any,
    }),

    updateUserPassword: builder.mutation<
      { message: string },
      { password: string; confirmPassword: string; id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `users/${id}/password`,
        method: 'patch',
        data: body,
      }),
    }),

    getUserRoles: builder.query<
      Array<{ id: number; name: string } | Select>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({ url: 'users/roles', method: 'get' }),
      transformResponse: (
        baseQueryReturnValue: Array<{ id: number; name: string }>,
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        }
        return baseQueryReturnValue
      },
    }),

    getUserStatuses: builder.query<
      Array<{ id: number; name: string } | Select>,
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({ url: 'users/statuses', method: 'get' }),
      transformResponse: (
        baseQueryReturnValue: Array<{ id: number; name: string }>,
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return baseQueryReturnValue.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        }
        return baseQueryReturnValue
      },
    }),

    createUser: builder.mutation<
      User,
      {
        name: string
        lastName: string
        email: string
        password: string
        rolId: number
      }
    >({
      query: (body) => ({
        url: 'users',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Users'] as any,
    }),

    createUserCustomer: builder.mutation<
      User,
      {
        name: string
        lastName: string
        email: string
        password: string
        rolId: number
      }
    >({
      query: (body) => ({
        url: 'customer-access',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['CustomerAccess'] as any,
    }),

    disableUser: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({ url: `users/${id}`, method: 'delete' }),
      invalidatesTags: ['Users'] as any,
    }),

    resetPassword: builder.mutation<
      { message: string },
      { password: string; confirmPassword: string; token: string }
    >({
      query: (body) => ({
        url: 'users/reset-password',
        method: 'post',
        data: body,
      }),
    }),

    recoverPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: 'users/send-link-for-recover-password',
        method: 'post',
        data: body,
      }),
    }),

    resendConfirmEmail: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: 'users/resend-confirm-account-email',
        method: 'post',
        data: body,
      }),
    }),
  }
}
