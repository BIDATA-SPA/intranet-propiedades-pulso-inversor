import { TSelect } from '@/utils/types/new-property/selects'
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'

export interface DisabledReason {
    id: string
    name: string
}

export function getDisabledReasonsQuery(builder: EndpointBuilderType) {
    return {
        getAllDisabledReasons: builder.query<TSelect[], void>({
            query: () => ({
                url: `/properties/disabled-reasons`,
                method: 'get',
            }),
            transformResponse: (response: DisabledReason[]): TSelect[] => {
                return response.map((reason) => ({
                    value: reason.id,
                    label: reason.name,
                }))
            },
            providesTags: ['DisabledReasons'],
        }),
    }
}
