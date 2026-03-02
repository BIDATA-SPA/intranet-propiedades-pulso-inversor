import { useGetPropertiesMetadataQuery } from '@/services/RtkQueryService'

export const useMetadata = () => {
  const {
    data: metadata,
    isFetching: isMetadataFetching,
    isError: isMetadataError,
    error: isMetadataErrorMsg,
  } = useGetPropertiesMetadataQuery()

  const meta = {
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
