import { useGetPropertiesMetadataQuery } from '@/services/RtkQueryService'
import { skipToken } from '@reduxjs/toolkit/query'

interface UseMetadataParams {
  cacheUserKey?: string
}

export const useMetadata = ({ cacheUserKey }: UseMetadataParams) => {
  const queryArg = cacheUserKey ? { cacheUserKey } : skipToken

  const {
    data: metadata,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetPropertiesMetadataQuery(queryArg, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  })

  const meta = {
    totalProperties: metadata?.totalProperties ?? 0,
    totalPropertiesInExchange: metadata?.totalPropertiesInExchange ?? 0,
    totalPropertiesSold: metadata?.totalPropertiesSold ?? 0,
  }

  return {
    metadata: meta,
    isMetadataLoading: isLoading,
    isMetadataFetching: isFetching,
    isMetadataError: isError,
    isMetadataErrorMsg: error,
    refetchMetadata: refetch,
  }
}
