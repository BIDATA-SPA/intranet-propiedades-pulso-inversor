import { PaginateSearch } from '@/@types/pagination'
import { Select } from '@/@types/select'
import {
  EndpointBuilderType,
  PaginateResult,
} from '../core-entities/paginated-result.entity'
import { CreateCustomerBody, Customer } from './types/customer.type'

export function getCustomersQuery(builder: EndpointBuilderType) {
  return {
    getAllCustomers: builder.query<
      PaginateResult<Customer> | Select[],
      PaginateSearch & {
        search: string
        paginated?: boolean
        transformToSelectOptions?: boolean
      }
    >({
      query: ({ limit, page, search, paginated }) => ({
        url: `customers?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ''
        }${paginated !== undefined ? `&paginated=${paginated}` : ''}`,
        method: 'get',
      }),

      transformResponse: (
        baseQueryReturnValue: PaginateResult<Customer> | Select[],
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return (baseQueryReturnValue as unknown as Customer[]).map(
            (item) => ({
              value: parseInt(item.id),
              label: `${item.name} ${item.lastName} ${
                item?.alias && `(${item.alias})`
              }`,
            })
          )
        }
        return baseQueryReturnValue
      },

      providesTags: ['Customers'] as any,
    }),

    getCustomerById: builder.query<Customer, string>({
      query: (id: string) => ({ url: `customers/${id}`, method: 'get' }),
      providesTags: ['Customers'] as any,
    }),

    createCustomer: builder.mutation<Customer, CreateCustomerBody>({
      query: (body) => ({ url: 'customers', method: 'post', data: body }),
      invalidatesTags: ['Customers'] as any,
    }),

    updateCustomer: builder.mutation<
      Customer,
      Partial<CreateCustomerBody> & { id: string }
    >({
      query: ({ id, ...body }) => ({
        url: `customers/${id}`,
        method: 'patch',
        data: body,
      }),
      invalidatesTags: ['Customers'] as any,
    }),

    deleteCustomer: builder.mutation<void, string>({
      query: (id) => ({
        url: `customers/${id}`,
        method: 'delete',
      }),
      invalidatesTags: ['Customers'] as any,
    }),
  }
}
