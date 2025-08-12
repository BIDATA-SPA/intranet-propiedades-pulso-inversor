import { EndpointBuilderType } from '../core-entities/paginated-result.entity'
import { Opportunity, TPrice } from './types/yokanjeo.type'

export function getOpportunitiesQuery(builder: EndpointBuilderType) {
  return {
    createOpportunity: builder.mutation<
      Opportunity,
      {
        customerId?: string
        typeOfOperationId?: string
        typeOfPropertyId?: string
        currencyId?: string
        propertyPrice?: TPrice
        bedrooms?: string
        bathrooms?: string
        locatedInCondominium?: boolean
        hasSecurity?: boolean
        hasParking?: boolean
        hasSwimmingPool?: boolean
        address: {
          country: string
          region: string
          commune: string
          city: string
          address: string
        }
      }
    >({
      query: (body) => ({
        url: '/procanje/buzon-de-clientes/crear',
        method: 'post',
        data: body,
      }),
      invalidatesTags: ['Procanje'] as any,
    }),
  }
}
