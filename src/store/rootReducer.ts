import RtkQueryService from '@/services/RtkQueryService'
import pdpAuth, { PdpAuthState } from '@/store/slices/auth/pdpAuthSlice'
import propertiesList, {
  PropertiesListState,
} from '@/views/my-properties/store/propertyListSlice'

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
  propertiesList: PropertiesListState
  crmCalendar: CalendarState
  pdpAuth: PdpAuthState
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
  propertiesList,
  crmCalendar,
  pdpAuth,
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
