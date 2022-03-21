import {
  WaitForTransactionArgs,
  WaitForTransactionResult,
  waitForTransaction,
} from '@wagmi/core'
import { useQuery } from 'react-query'

import { QueryConfig, QueryFunctionArgs } from '../../types'
import { useChainId } from '../utils'

export type UseWaitForTransactionArgs = Partial<WaitForTransactionArgs>

export type UseWaitForTransactionConfig = QueryConfig<
  WaitForTransactionResult,
  Error
>

export const queryKey = ({
  confirmations,
  chainId,
  hash,
  timeout,
  wait,
}: Partial<WaitForTransactionArgs> & {
  chainId?: number
}) =>
  [
    {
      entity: 'waitForTransaction',
      confirmations,
      chainId,
      hash,
      timeout,
      wait,
    },
  ] as const

const queryFn = ({
  queryKey: [{ confirmations, hash, timeout, wait }],
}: QueryFunctionArgs<typeof queryKey>) => {
  if (!hash || !wait) throw new Error('hash or wait is required')
  return waitForTransaction({ confirmations, hash, timeout, wait })
}

export function useWaitForTransaction({
  confirmations,
  hash,
  timeout,
  wait,
  cacheTime,
  enabled = true,
  keepPreviousData,
  select,
  staleTime,
  suspense,
  onError,
  onSettled,
  onSuccess,
}: UseWaitForTransactionArgs & UseWaitForTransactionConfig = {}) {
  const chainId = useChainId()

  return useQuery(
    queryKey({ confirmations, chainId, hash, timeout, wait }),
    queryFn,
    {
      cacheTime,
      enabled: Boolean(enabled && (hash || wait)),
      keepPreviousData,
      select,
      staleTime,
      suspense,
      onError,
      onSettled,
      onSuccess,
    },
  )
}
