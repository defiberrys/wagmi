import * as React from 'react'
import { FetchSignerResult, fetchSigner, watchSigner } from '@wagmi/core'
import { useQuery, useQueryClient } from 'react-query'

import { QueryConfig } from '../../types'

export type UseSignerConfig = Omit<
  QueryConfig<FetchSignerResult, Error>,
  'cacheTime' | 'staleTime' | 'enabled'
>

export const queryKey = () => [{ entity: 'signer' }] as const

export const queryFn = () => fetchSigner()

export function useSigner({
  onError,
  onSettled,
  onSuccess,
}: UseSignerConfig = {}) {
  const signerQuery = useQuery(queryKey(), queryFn, {
    cacheTime: 0,
    enabled: false,
    onError,
    onSettled,
    onSuccess,
  })

  const queryClient = useQueryClient()
  React.useEffect(() => {
    const unwatch = watchSigner((signer) =>
      queryClient.setQueryData(queryKey(), signer),
    )
    return unwatch
  }, [queryClient])

  const status = !signerQuery.data ? 'loading' : signerQuery.status

  return {
    ...signerQuery,
    isIdle: false,
    isFetching: signerQuery.isFetching || status === 'loading',
    isLoading: signerQuery.isLoading || status === 'loading',
    status,
  }
}
