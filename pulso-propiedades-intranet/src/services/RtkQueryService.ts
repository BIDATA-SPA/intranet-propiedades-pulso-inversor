import { ValidateSessionResponse } from '@/@types/auth'
import { addRefreshTimeout } from '@/store'
import { refreshSession } from '@/utils/refresh-session'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import BaseService from './BaseService'
import { getActivitiesLog } from './activities-log/ActivitiesLog.service'
import { getApiKeyPortalQuery } from './api-key-portal/ApiKeyPortal.service'
import { getAuthSignInQuery } from './auth/sign-in/SignIn.service'
import { getCalendarEventsQuery } from './calendar/Calendar.service'
import { deleteEventService } from './calendar/DeleteEvent.service'
import { getVisitOrderQuery } from './calendar/OrVisit.service'
import { getConfirmAccountQuery } from './confirm-account/ConfirmAccount.service'
import { EndpointBuilderType } from './core-entities/paginated-result.entity'
import { getCountriesQuery } from './countries/Country.service'
import { getCustomersSearchQuery } from './customer-search/CustomerSearch.service'
import { getCustomersQuery } from './customers/Customer.service'
import { getDashboardQuery } from './dashboard/Dashboard.service'
import { getDialCodesQuery } from './dial-codes/DialCodes.service'
import { getDisabledReasonsQuery } from './disabled-reasons/DisabledReasons.service'
import { getLocationQuery } from './location/Location.service'
import { getAddressPreferencesQuery } from './me/AddressPreferences.service'
import { getMeQuery } from './me/Me.service'
import { getPropertiesMetadataQuery } from './metadata/properties/properties.service'
import { getPdpAuthQuery } from './pdp/PdpAuth.service'
import { getPortalPublicationsQuery } from './portal/portaPublicationsApi'
import { getPropertiesQuery } from './properties/Property.service'
import { getUserImageQuery } from './user-image/UserImage.service'
import { getUsersQuery } from './user/User.service'

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
    },
    unknown,
    unknown
  > =>
  async (request) => {
    try {
      const response = BaseService(request)
      return response
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      }
    }
  }

const RtkQueryService = createApi({
  reducerPath: 'rtkApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'Me',
    'Users',
    'Roles',
    'Customers',
    'Countries',
    'Properties',
    'SignIn',
    'Countries',
    'States',
    'ConfirmAccountToken',
    'UserImage',
    'DialCodes',
    'ApiKeyPortal',
    'PortalPublication',
  ],
  endpoints: (builder: EndpointBuilderType) => ({
    ...getUsersQuery(builder),
    ...getCustomersQuery(builder),
    ...getMeQuery(builder),
    ...getCountriesQuery(builder),
    ...getPropertiesQuery(builder),
    ...getCustomersSearchQuery(builder),
    ...getDisabledReasonsQuery(builder),
    ...getPropertiesMetadataQuery(builder),
    ...getCalendarEventsQuery(builder),
    ...getDashboardQuery(builder),
    ...getAuthSignInQuery(builder),
    ...getLocationQuery(builder),
    ...getConfirmAccountQuery(builder),
    ...getVisitOrderQuery(builder),
    ...getUserImageQuery(builder),
    ...getActivitiesLog(builder),
    ...getDialCodesQuery(builder),
    ...deleteEventService(builder),
    ...getAddressPreferencesQuery(builder),
    ...getApiKeyPortalQuery(builder),
    ...getPortalPublicationsQuery(builder),
    ...getPdpAuthQuery(builder),

    validateSession: builder.query<ValidateSessionResponse, void>({
      query: () => {
        return {
          url: 'auth/validate',
          method: 'get',
        }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const timeout = setTimeout(async () => {
            await refreshSession()
          }, data.expirationInSeconds * 1000)

          dispatch(addRefreshTimeout({ timeout }))
        } catch (error) {
          throw new Error(error.message)
        }
      },
    }),
  }),
})

export default RtkQueryService
export const {
  useValidateSessionQuery,
  useGetAllCountriesQuery,
  useGetAllUsersQuery,
  useGetAllUsersMetaDataQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useCreateUserMutation,
  useCreateUserCustomerMutation,
  useDisableUserMutation,
  useGetUserRolesQuery,
  useGetUserStatusesQuery,
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  useGetAllPropertiesQuery,
  useLazyGetAllPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useCreatePropertyImagesMutation,
  useDeletePropertyImageMutation,
  useUpdateImageOrderMutation,
  useGetAllCustomersSearchQuery,
  useGetCustomerSearchByIdQuery,
  useCreateCustomerSearchMutation,
  useUpdateCustomerSearchMutation,
  useUpdateCustomerSearchRefreshMutation,
  useGetAllDisabledReasonsQuery,
  useGetPropertiesMetadataQuery,
  useGetMyInfoQuery,
  useGetPreferredAreasQuery,
  useSendPreferredAreasMutation,
  useResetPasswordMutation,
  useRecoverPasswordMutation,
  useCreateEventMutation,
  usePatchEventMutation,
  useGetEventsQuery,
  useCreateVisitOrderMutation,
  usePatchVisitOrderMutation,
  useGetVisitOrderQuery,
  useDeleteEventMutation,
  useGetDashboardQuery,
  useGetActivitiesQuery,
  useSignInAdminMutation,
  useLazyGetAllCountriesQuery,
  useGetAllStatesQuery,
  useSendConfirmAccountTokenMutation,
  useGetUserImageQuery,
  useCreateUserImageMutation,
  useDeleteUserImageMutation,
  useGetAllDialCodesQuery,
  useResendConfirmEmailMutation,
  usePatchApiKeyGenerateMutation,
  usePatchApiKeyDeactivateMutation,
  useGetPortalPublicationByIdQuery,
  useFindPortalPublicationsQuery,
  useCreatePortalPublicationMutation,
  useUpdatePortalPublicationByIdMutation,
  useDeletePortalPublicationByIdMutation,
  useLazyFindPortalPublicationsQuery,
  useGetPdpTokenMutation,
} = RtkQueryService
