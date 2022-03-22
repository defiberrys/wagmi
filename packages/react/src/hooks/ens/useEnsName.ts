import { useQuery } from 'react-query'
import { FetchEnsNameResult, fetchEnsName } from '@wagmi/core'

import { QueryConfig, QueryFunctionArgs } from '../../types'
import { useChainId } from '../utils'

export type UseEnsNameArgs = {
  /** Address */
  address?: string
}

export type UseEnsNameConfig = QueryConfig<FetchEnsNameResult, Error>

export const queryKey = ({
  address,
  chainId,
}: {
  address?: string
  chainId?: number
}) => [{ entity: 'ensName', address, chainId }] as const

const queryFn = ({
  queryKey: [{ address }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!address) throw new Error('address is required')
  return fetchEnsName({ address })
}

export function useEnsName({
  address,
  cacheTime,
  enabled = true,
  keepPreviousData,
  select,
  staleTime = 1000 * 60 * 60 * 24, // 24 hours
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseEnsNameArgs & UseEnsNameConfig = {}) {
  const chainId = useChainId()
  return useQuery(queryKey({ address, chainId }), queryFn, {
    cacheTime,
    enabled: Boolean(enabled && address && chainId),
    keepPreviousData,
    select,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })
}
