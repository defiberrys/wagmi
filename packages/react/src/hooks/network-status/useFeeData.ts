import * as React from 'react'
import { FetchFeeDataArgs, FetchFeeDataResult, fetchFeeData } from '@wagmi/core'
import { useQuery } from 'react-query'

import { QueryConfig, QueryFunctionArgs } from '../../types'
import { useBlockNumber } from '../network-status'
import { useChainId } from '../utils'

type UseFeeDataArgs = Partial<FetchFeeDataArgs> & {
  /** Subscribe to changes */
  watch?: boolean
}

export type UseFeedDataConfig = QueryConfig<FetchFeeDataResult, Error>

export const queryKey = ({
  chainId,
  formatUnits,
}: Partial<FetchFeeDataArgs> & {
  chainId?: number
}) => [{ entity: 'feeData', chainId, formatUnits }] as const

const queryFn = ({
  queryKey: [{ formatUnits }],
}: QueryFunctionArgs<typeof queryKey>) => {
  return fetchFeeData({ formatUnits })
}

export function useFeeData({
  formatUnits = 'wei',
  watch,
  cacheTime,
  enabled = true,
  keepPreviousData,
  select,
  staleTime,
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseFeeDataArgs & UseFeedDataConfig = {}) {
  const chainId = useChainId()

  const feeDataQuery = useQuery(queryKey({ chainId, formatUnits }), queryFn, {
    cacheTime,
    enabled,
    keepPreviousData,
    select,
    staleTime,
    suspense,
    onError,
    onSettled,
    onSuccess,
  })

  const { data: blockNumber } = useBlockNumber({ watch })
  React.useEffect(() => {
    if (!enabled) return
    if (!watch) return
    if (!blockNumber) return
    feeDataQuery.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber])

  return feeDataQuery
}
