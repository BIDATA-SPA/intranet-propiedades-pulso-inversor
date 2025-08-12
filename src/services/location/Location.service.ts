import { PaginateSearch } from '@/@types/pagination'
import { Select } from '@/@types/select'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { Country, States } from './types/location.type'

export function getLocationQuery(builder: EndpointBuilderType) {
  return {
    getAllCountries: builder.query<
      PaginateResult<Country> | Select[],
      PaginateSearch & {
        search?: string
        paginated?: boolean
        transformToSelectOptions?: boolean
      }
    >({
      query: ({ limit, page, paginated = false }) => ({
        url: `countries?page=${page}&limit=${limit}${
          paginated !== undefined ? `&paginated=${paginated}` : ''
        }`,
        method: 'get',
      }),
      transformResponse: (
        baseQueryReturnValue: PaginateResult<Country>,
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return (baseQueryReturnValue as Country[]).map((item) => ({
            value: item.id,
            label: item.name,
          }))
        }
        return baseQueryReturnValue
      },
      providesTags: ['Countries'] as any,
    }),

    getAllStates: builder.query<
      PaginateResult<States> | Select[],
      PaginateSearch & {
        countryId: number
        paginated?: boolean
        transformToSelectOptions?: boolean
      }
    >({
      query: ({ limit, page, paginated = false }) => ({
        url: `states?page=${page}&limit=${limit}${
          paginated !== undefined ? `&paginated=${paginated}` : ''
        }`,
        method: 'get',
      }),
      transformResponse: (
        baseQueryReturnValue: PaginateResult<States>,
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return (baseQueryReturnValue as States[])?.map((item) => ({
            value: item.id,
            label: item.name,
            cities: item.cities,
          }))
        }
        return baseQueryReturnValue
      },
      providesTags: ['States'] as any,
    }),
  }
}
