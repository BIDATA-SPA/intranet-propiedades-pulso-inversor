import { PaginateSearch } from '@/@types/pagination'
import { Select } from '@/@types/select'
import {
    EndpointBuilderType,
    PaginateResult,
} from '../core-entities/paginated-result.entity'
import {
    CreateCustomerSearchBody,
    CustomerSearch,
} from './types/customer-search'

export function getCustomersSearchQuery(builder: EndpointBuilderType) {
    return {
        getAllCustomersSearch: builder.query<
            PaginateResult<CustomerSearch> | Select[],
            PaginateSearch & {
                search: string
                paginated?: boolean
                transformToSelectOptions?: boolean
            }
        >({
            query: ({ limit, page, search, paginated }) => ({
                url: `customer-search?page=${page}&limit=${limit}${
                    search ? `&search=${search}` : ''
                }${paginated !== undefined ? `&paginated=${paginated}` : ''}`,
                method: 'get',
            }),

            transformResponse: (
                baseQueryReturnValue: PaginateResult<CustomerSearch> | Select[],
                meta,
                arg: { transformToSelectOptions?: boolean }
            ) => {
                if (arg.transformToSelectOptions) {
                    return (
                        baseQueryReturnValue as unknown as CustomerSearch[]
                    ).map((item) => ({
                        value: parseInt(item.id),
                        label: `${item.name} ${item.lastName}`,
                    }))
                }
                return baseQueryReturnValue
            },

            providesTags: ['CustomersSearch'] as any,
        }),

        getCustomerSearchById: builder.query<CustomerSearch, string>({
            query: (id: string) => ({
                url: `customer-search/${id}`,
                method: 'get',
            }),
            providesTags: ['CustomersSearch'] as any,
        }),

        createCustomerSearch: builder.mutation<
            CustomerSearch,
            CreateCustomerSearchBody
        >({
            query: (body) => ({
                url: 'customer-search',
                method: 'post',
                data: body,
            }),
            invalidatesTags: ['Customers'] as any,
        }),

        updateCustomerSearch: builder.mutation<
            CustomerSearch,
            Partial<CreateCustomerSearchBody> & { id: string }
        >({
            query: ({ id, ...body }) => ({
                url: `customer-search/${id}`,
                method: 'patch',
                data: body,
            }),
            invalidatesTags: ['CustomersSearch'] as any,
        }),

        updateCustomerSearchRefresh: builder.mutation<
            CustomerSearch,
            Partial<CreateCustomerSearchBody> & { id: string }
        >({
            query: ({ id }) => ({
                url: `customer-search/${id}/refresh-search`,
                method: 'patch',
            }),
        }),
        providesTags: ['Properties'] as any,
    }
}
