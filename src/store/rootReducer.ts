import RtkQueryService from '@/services/RtkQueryService'
import aliedRealtorList, {
  AliedRealtorListState,
} from '@/views/alied-realtor/store'
import ratingUserList, { RatingUserListState } from '@/views/rating-user/store'

import propertiesResumeList, {
  PropertiesResumeListState,
} from '@/views/dashboard-customer/components/dashboard-tabs/dashboard-content/properties/store/resumePropertySlice'
import serviceList, {
  ServiceListState,
} from '@/views/external-services/store/serviceListSlice'
import aliedRealtorRequestList, {
  AliedRealtorRequestListState,
} from '@/views/inbox-request/contact-managment/store'
import campaignsList, {
  CampaignsListState,
} from '@/views/mark-potencial/ads-campaing/store/campaignListSlice'
import brandsList, {
  BrandsListState,
} from '@/views/mark-potencial/mark-design/store/brandListSlice'
import webDesignsList, {
  WebDesignsListState,
} from '@/views/mark-potencial/web-design/store/webDesignListSlice'
import propertiesList, {
  PropertiesListState,
} from '@/views/my-properties/store/propertyListSlice'
import referredRealtorList, {
  ReferredRealtorListState,
} from '@/views/referred-realtor/store'
import toolsAndServices, {
  ToolsAndServicesState,
} from '@/views/tools-and-services/store/toolsAndServicesSlice'

import { AnyAction, CombinedState, Reducer, combineReducers } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'

import crmCalendar, {
  CalendarState,
} from '@/views/my-calendar/store/calendarSlice'

export type RootState = CombinedState<{
  auth: CombinedState<AuthState>
  base: CombinedState<BaseState>
  locale: LocaleState
  theme: ThemeState

  // Modules
  serviceList: ServiceListState
  toolsAndServices: ToolsAndServicesState
  propertiesList: PropertiesListState
  propertiesResumeList: PropertiesResumeListState
  brandsList: BrandsListState
  campaignsList: CampaignsListState
  webDesignsList: WebDesignsListState
  aliedRealtorList: AliedRealtorListState
  aliedRealtorRequestList: AliedRealtorRequestListState
  referredRealtorList: ReferredRealtorListState
  crmCalendar: CalendarState
  ratingUserList: RatingUserListState

  /* eslint-disable @typescript-eslint/no-explicit-any */
  [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
  [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
  auth,
  base,
  locale,
  theme,
  serviceList,
  toolsAndServices,
  propertiesList,
  propertiesResumeList,
  brandsList,
  campaignsList,
  webDesignsList,
  aliedRealtorList,
  aliedRealtorRequestList,
  referredRealtorList,
  crmCalendar,
  ratingUserList,
  [RtkQueryService.reducerPath]: RtkQueryService.reducer,
}

const rootReducer =
  (asyncReducers?: AsyncReducers) => (state: RootState, action: AnyAction) => {
    const combinedReducer = combineReducers({
      ...staticReducers,
      ...asyncReducers,
    })
    return combinedReducer(state, action)
  }

export default rootReducer
