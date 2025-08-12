import { useGetPropertiesMetadataQuery } from '@/services/RtkQueryService'
import { IMetadata } from '@/services/metadata/properties/types/metadata.type'

export const useMetadata = () => {
  const {
    data: metadata,
    isFetching: isMetadataFetching,
    isError: isMetadataError,
    error: isMetadataErrorMsg,
  } = useGetPropertiesMetadataQuery()

  const meta: IMetadata = {
    totalProperties: metadata?.totalProperties,
    totalPropertiesInExchange: metadata?.totalPropertiesInExchange,
    totalPropertiesSold: metadata?.totalPropertiesSold,
  }

  return {
    metadata: meta,
    isMetadataFetching,
    isMetadataError,
    isMetadataErrorMsg,
  }
}
