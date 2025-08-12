import { ValidateSessionResponse } from '@/@types/auth'
import { addRefreshTimeout } from '@/store'
import { refreshSession } from '@/utils/refresh-session'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import BaseService from './BaseService'
import { getActivitiesLog } from './activities-log/ActivitiesLog.service'
import { getAliedRealtorQuery } from './alied-realtor/AliedRealtor.service'
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
import { getBannerAdvertisingQuery } from './external-services/BannerAdvertising.service'
import { getExternalServicesQuery } from './external-services/ExternalServices.service'
import { getEmailRequestsQuery } from './inbox-request/InboxRequest.service'
import { getAliedRealtorRequestQuery } from './inbox-request/InboxRequestContact.service'
import { getInboxRequestStatusesQuery } from './inbox-request/InboxRequestStatuses.service'
import { getEmailRequestsMetadataQuery } from './inbox-request/Metadata.service'
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
import { getPropertiesQuery } from './properties/Property.service'
import { getPropertiesSearchQuery } from './property-search/PropertySearch.service'
import { getUserRatingQuery } from './rating-user/RatingUser.service'
import { getRealtorIdeasQuery } from './realtor-ideas/RealtorIdeas.service'
import { getReferredRealtorQuery } from './referred-realtor/ReferredRealtor.service'
import { getSupportRequestQuery } from './support/SupportRequest.service'
import { getToolsAndServicesQuery } from './tools-and-services/ToolsAndServices.service'
import { getUserImageQuery } from './user-image/UserImage.service'
import { getUsersQuery } from './user/User.service'
import { getOpportunitiesQuery } from './yokanjeo/YoKanjeo.service'

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
  ],
  endpoints: (builder: EndpointBuilderType) => ({
    ...getUsersQuery(builder),
    ...getCustomersQuery(builder),
    ...getMeQuery(builder),
    ...getCountriesQuery(builder),
    ...getPropertiesQuery(builder),
    ...getOpportunitiesQuery(builder),
    ...getCustomersSearchQuery(builder),
    ...getDisabledReasonsQuery(builder),
    ...getPropertiesMetadataQuery(builder),
    ...getExternalServicesQuery(builder),
    ...getEmailRequestsQuery(builder),
    ...getToolsAndServicesQuery(builder),
    ...getInboxRequestStatusesQuery(builder),
    ...getEmailRequestsMetadataQuery(builder),
    ...getPropertiesSearchQuery(builder),
    ...getCalendarEventsQuery(builder),
    ...getDashboardQuery(builder),
    ...getSupportRequestQuery(builder),
    ...getAuthSignInQuery(builder),
    ...getLocationQuery(builder),
    ...getConfirmAccountQuery(builder),
    ...getVisitOrderQuery(builder),
    ...getNotificationsQuery(builder),
    ...getRealtorIdeasQuery(builder),
    ...getCustomerSearchMetadataQuery(builder),
    ...getPropertySearchMetadataQuery(builder),
    ...getExternalServiceMetadataQuery(builder),
    ...getUserImageQuery(builder),
    ...getActivitiesLog(builder),
    ...getMarketingSelectsQuery(builder),
    ...getAliedRealtorQuery(builder),
    ...getDialCodesQuery(builder),
    ...getAliedRealtorRequestQuery(builder),
    ...getReferredRealtorQuery(builder),
    ...getReferralRealtorMetadataQuery(builder),
    ...getUserRatingQuery(builder),
    ...getBannerAdvertisingQuery(builder),
    ...deleteEventService(builder),
    ...getAddressPreferencesQuery(builder),
    ...getApiKeyPortalQuery(builder),

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

  //countries
  useGetAllCountriesQuery,
  //end countries

  //users
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
  //end users

  //customers
  useGetAllCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  //end customers

  // properties
  useGetAllPropertiesQuery,
  useLazyGetAllPropertiesQuery,
  useGetPropertyByIdQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useCreatePropertyImagesMutation,
  useDeletePropertyImageMutation,
  useUpdateImageOrderMutation,
  // end properties

  // customer-search
  useGetAllCustomersSearchQuery,
  useGetCustomerSearchByIdQuery,
  useCreateCustomerSearchMutation,
  useUpdateCustomerSearchMutation,
  useUpdateCustomerSearchRefreshMutation,
  // end customer-search

  // property-search
  useGetAllPropertiesSearchQuery,
  useGetPropertySearchByIdQuery,
  // end property-search

  // properties - disabled reasons
  useGetAllDisabledReasonsQuery,
  // end properties - disabled reasons

  // metadata
  // Properties
  useGetPropertiesMetadataQuery,

  // End Properties

  // end metadata

  // External services
  useGetAllExternalServicesQuery,
  useGetExternalServiceByIdQuery,
  useGetAllServicesByFolderQuery,
  // Banner
  useGetAllBannersQuery,
  useGetBannerByIdQuery,
  useGetBannerImageByNameQuery,
  // End External services

  // me
  useGetMyInfoQuery,
  useGetPreferredAreasQuery,
  useSendPreferredAreasMutation,
  // end me

  // yoKanjeo
  useCreateOpportunityMutation,
  // yoKanjeo
  useResetPasswordMutation,
  useRecoverPasswordMutation,

  // inbox requests
  // YoKanjeo email requests
  useGetExchangeEmailRequestQuery,
  useSendExchangeEmailRequestMutation,
  useSendExternalServicesEmailRequestMutation,
  useGetExternalServicesEmailRequestQuery,
  useGetExchangeEmailInboxQuery,
  useGetAllStatusesQuery,
  useUpdateKanjeoRequestsStatusMutation,
  useGetInboxMetadataQuery,
  useGetRequestMetadataQuery,

  // tools and services
  useGetAllRootFoldersQuery,
  useCreateRootFolderMutation,
  useGetRootFolderByIdQuery,
  useCreateRootFileMutation,
  useUpdateRootFolderMutation,

  // CALENDAR
  useCreateEventMutation,
  usePatchEventMutation,
  useGetEventsQuery,
  useCreateVisitOrderMutation,
  usePatchVisitOrderMutation,
  useGetVisitOrderQuery,
  useDeleteEventMutation,

  // useCreateEventCalendarMutation,
  // useGetEventCalendarQuery,
  // usePatchEventCalendarMutation,
  // CALENDAR VISIT ORDER
  // useCreateVisitOrderMutation,
  // usePatchVisitOrderMutation,
  // useGetVisitOrderQuery,

  //Dashboard
  useGetDashboardQuery,

  //Activities Log
  useGetActivitiesQuery,

  // Support
  useGetSupportRequestQuery,
  useSendSupportRequestMutation,
  useGetSupportCategoriesQuery,
  // End Support

  // Sign-in
  useSignInAdminMutation,
  // end Sign-in

  // location selects
  useLazyGetAllCountriesQuery,
  useGetAllStatesQuery,
  // end location select

  // confirm account
  useSendConfirmAccountTokenMutation,
  // end confirm account

  // signature contract
  useRequestApplicantSignatureMutation,
  // end signature contract

  // notifications
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  // end notifications

  // realtor ideas
  useGetRealtorIdeasQuery,
  useSendRealtorIdeaMutation,
  useUpdateRealtorIdeaMutation,
  // end realtor ideas

  // customer search metadata
  useGetCustomerSearchMetadataQuery,
  // end customer search metadata

  // property search metadata
  useGetPropertySearchMetadataQuery,
  // end search metadata

  // external services metadata
  useGetExternalServicesMetadataQuery,
  // end external services metadata

  // user image
  useGetUserImageQuery,
  useCreateUserImageMutation,
  useDeleteUserImageMutation,
  // end user image

  //** MARKETING HOOKS */
  // service requet
  useGetServiceRequestPricesQuery,
  useGetServiceRequestTypesQuery,
  useGetServiceRequestDatesQuery,
  useGetServiceRequestStatusQuery,
  useSendServiceRequestBrandMutation,
  useGetServiceRequestBrandQuery,
  useDeleteServiceRequestBrandMutation,

  // Publicity campaign
  useGetServiceRequestBrandPublicityCampaignQuery,
  useGetServiceRequestBrandWebDesignQuery,
  // end service requet

  // Alied realtor
  useGetAllAliedRealtorQuery,
  useCreateContactEmailAliedRealtorMutation,
  // end Alied realtor

  // Dial Code
  useGetAllDialCodesQuery,
  // End Dial Code

  // Alied Realtor Request
  useGetAllAliedRealtorRequestQuery,
  // End Alied Realtor Request

  // Referred Realtors
  useGetAllReferredRealtorQuery,
  // End Referred Realtors

  // Referred Realtors metadata
  useGetReferralRealtorMetadataQuery,
  // End Referred Realtors metadata

  // User Rating
  useGetAllRatingUsersQuery,
  useCreateRatingUserMutation,
  useCreateRatingUserByCustomerMutation,
  useCreateRatingUserSendMailMutation,
  useResendConfirmEmailMutation,
  // End User Rating

  //   User Api Key
  usePatchApiKeyGenerateMutation,
  usePatchApiKeyDeactivateMutation,
  //   End User Api Key
} = RtkQueryService
