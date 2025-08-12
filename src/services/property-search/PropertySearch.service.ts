import { PaginateSearch } from '@/@types/pagination'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { PropertySearch } from './types/property-search'

export function getPropertiesSearchQuery(builder: EndpointBuilderType) {
  return {
    getAllPropertiesSearch: builder.query<
      PaginateResult<PropertySearch>,
      PaginateSearch & {
        search: string
        paginated?: boolean
        transformToSelectOptions?: boolean
      }
    >({
      query: ({ limit, page, search, paginated }) => ({
        url: `properties/box?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ''
        }${paginated !== undefined ? `&paginated=${paginated}` : ''}`,
        method: 'get',
      }),

      providesTags: ['PropertiesSearch'] as any,
    }),

    getPropertySearchById: builder.query<PropertySearch, string>({
      query: (id: string) => ({
        url: `properties/box/${id}`,
        method: 'get',
      }),
      providesTags: ['PropertiesSearch'] as any,
    }),
  }
}
