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
import { getMarketingSelectsQuery } from './marketing/brand/Selects.service'
import { getAddressPreferencesQuery } from './me/AddressPreferences.service'
import { getMeQuery } from './me/Me.service'
import { getCustomerSearchMetadataQuery } from './metadata/customer-search/customer-search.service'
import { getExternalServiceMetadataQuery } from './metadata/external-services/external-service.service'
import { getPropertiesMetadataQuery } from './metadata/properties/properties.service'
import { getPropertySearchMetadataQuery } from './metadata/properties/property-search.service'
import { getReferralRealtorMetadataQuery } from './metadata/referred-realtor/ReferredRealtor.service'
import { getNotificationsQuery } from './notification/notification.service'
import { getPdpAuthQuery } from './pdp/PdpAuth.service'
import { getPortalPublicationsQuery } from './portal/portaPublicationsApi'
import { getPropertiesQuery } from './properties/Property.service'
import { getUserRatingQuery } from './rating-user/RatingUser.service'
import { getReferredRealtorQuery } from './referred-realtor/ReferredRealtor.service'
import { getSupportRequestQuery } from './support/SupportRequest.service'
import { getToolsAndServicesQuery } from './tools-and-services/ToolsAndServices.service'
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
    'GetKanjeoRequests',
    'ToolsAndServices',
    'KanjeEmialRequests',
    'InboxRequestStatuses',
    'KanjeInboxRequest',
    'KanjeSentRequest',
    'AliedRealtorRequest',
    'ExternalServicesRequest',
    'InboxMetadata',
    'RequestMetadata',
    'PropertiesSearch',
    'SupportRequest',
    'SignIn',
    'Countries',
    'States',
    'ConfirmAccountToken',
    'RequestApplicantSignature',
    'Notifications',
    'RealtorIdeas',
    'CustomerSearch',
    'PropertySearch',
    'ExternalServices',
    'UserImage',
    'ServiceRequestPrices',
    'ServiceRequestTypes',
    'ServiceRequestDates',
    'ServiceRequestStatus',
    'AliedRealtor',
    'UserInteraction',
    'DialCodes',
    'ReferredRealtor',
    'ReferralRealtorMetadata',
    'UserRating',
    'PreferredAreas',
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
    ...getToolsAndServicesQuery(builder),
    ...getCalendarEventsQuery(builder),
    ...getDashboardQuery(builder),
    ...getSupportRequestQuery(builder),
    ...getAuthSignInQuery(builder),
    ...getLocationQuery(builder),
    ...getConfirmAccountQuery(builder),
    ...getVisitOrderQuery(builder),
    ...getNotificationsQuery(builder),
    ...getCustomerSearchMetadataQuery(builder),
    ...getPropertySearchMetadataQuery(builder),
    ...getExternalServiceMetadataQuery(builder),
    ...getUserImageQuery(builder),
    ...getActivitiesLog(builder),
    ...getMarketingSelectsQuery(builder),
    ...getDialCodesQuery(builder),
    ...getReferredRealtorQuery(builder),
    ...getReferralRealtorMetadataQuery(builder),
    ...getUserRatingQuery(builder),
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
  useGetAllRootFoldersQuery,
  useCreateRootFolderMutation,
  useGetRootFolderByIdQuery,
  useCreateRootFileMutation,
  useUpdateRootFolderMutation,
  useCreateEventMutation,
  usePatchEventMutation,
  useGetEventsQuery,
  useCreateVisitOrderMutation,
  usePatchVisitOrderMutation,
  useGetVisitOrderQuery,
  useDeleteEventMutation,
  useGetDashboardQuery,
  useGetActivitiesQuery,
  useGetSupportRequestQuery,
  useSendSupportRequestMutation,
  useGetSupportCategoriesQuery,
  useSignInAdminMutation,
  useLazyGetAllCountriesQuery,
  useGetAllStatesQuery,
  useSendConfirmAccountTokenMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useGetCustomerSearchMetadataQuery,
  useGetPropertySearchMetadataQuery,
  useGetExternalServicesMetadataQuery,
  useGetUserImageQuery,
  useCreateUserImageMutation,
  useDeleteUserImageMutation,
  useGetServiceRequestPricesQuery,
  useGetServiceRequestTypesQuery,
  useGetServiceRequestDatesQuery,
  useGetServiceRequestStatusQuery,
  useSendServiceRequestBrandMutation,
  useGetServiceRequestBrandQuery,
  useDeleteServiceRequestBrandMutation,
  useGetServiceRequestBrandPublicityCampaignQuery,
  useGetServiceRequestBrandWebDesignQuery,
  useGetAllDialCodesQuery,
  useGetAllReferredRealtorQuery,
  useGetReferralRealtorMetadataQuery,
  useGetAllRatingUsersQuery,
  useCreateRatingUserMutation,
  useCreateRatingUserByCustomerMutation,
  useCreateRatingUserSendMailMutation,
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
