import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { Notification } from './types/notification.type'

export function getNotificationsQuery(builder: EndpointBuilderType) {
  return {
    getNotifications: builder.query<
      PaginateResult<Notification> | Array<Notification>,
      PaginateSearch & {
        paginated?: boolean
      }
    >({
      query: ({ limit, page, paginated }) => ({
        url: 'notifications',
        method: 'get',
        params: { limit, page, paginated },
      }),
      providesTags: ['Notifications'] as any,
    }),

    markNotificationAsRead: builder.mutation<
      { message: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `notifications/${id}/mark-as-read`,
        method: 'post',
      }),
      invalidatesTags: ['Notifications'] as any,
    }),

    markAllNotificationsAsRead: builder.mutation<
      { message: string },
      { notificationsId: Array<string> }
    >({
      query: ({ notificationsId }) => ({
        url: `notifications/mark-all-as-read`,
        method: 'post',
        data: { notificationsId },
      }),
      invalidatesTags: ['Notifications'] as any,
    }),
  }
}
