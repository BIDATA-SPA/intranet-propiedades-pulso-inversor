import { Select } from '@/@types/select'
import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { Country } from './types/country.type'

export function getCountriesQuery(builder: EndpointBuilderType) {
  return {
    getAllCountries: builder.query<
      Array<Country> | Select[],
      { transformToSelectOptions?: boolean }
    >({
      query: () => ({ url: 'countries', method: 'get' }),

      transformResponse: (
        baseQueryReturnValue: Array<Country> | Select[],
        meta,
        arg: { transformToSelectOptions?: boolean }
      ) => {
        if (arg.transformToSelectOptions) {
          return (baseQueryReturnValue as unknown as Country[]).map((item) => ({
            value: item.id,
            label: `${item.name}`,
          }))
        }

        return baseQueryReturnValue
      },

      providesTags: ['Countries'] as any,
    }),
  }
}
