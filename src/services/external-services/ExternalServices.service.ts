import { PaginateSearch } from '@/@types/pagination'
import {
    EndpointBuilderType,
    PaginateResult,
} from '../core-entities/paginated-result.entity'
import { ExternalServices } from './types/external-services.type'

export function getExternalServicesQuery(builder: EndpointBuilderType) {
    return {
        getAllExternalServices: builder.query<
            PaginateResult<ExternalServices>,
            PaginateSearch & { paginated: boolean; search: string }
        >({
            query: ({ paginated, search }) => ({
                url: `external-services/folders?paginated=${paginated}${
                    search ? `&search=${search}` : ''
                }`,
                method: 'get',
            }),
            providesTags: ['ExternalServices'] as any,
        }),

        getExternalServiceById: builder.query<ExternalServices, string>({
            query: (id: string) => ({
                url: `external-services/folders/${id}`,
                method: 'get',
            }),
            providesTags: ['ExternalServices'] as any,
        }),

        getAllServicesByFolder: builder.query<
            PaginateResult<ExternalServices>, // aginateResult<Customer>
            PaginateSearch & {
                search: string
                paginated?: boolean
                folderId?: string
            }
        >({
            query: ({ limit, page, search, paginated, folderId }) => ({
                url: `external-services?page=${page}&limit=${limit}&folderId=${folderId}${
                    search ? `&search=${search}` : ''
                }${paginated !== undefined ? `&paginated=${paginated}` : ''}`,
                method: 'get',
            }),

            providesTags: ['ExternalFolderServices'] as any,
        }),
    }
}
