import * as React from 'react'
import {
  SendTransactionArgs,
  SendTransactionResult,
  sendTransaction,
} from '@wagmi/core'
import { useMutation } from 'react-query'

import { MutationConfig } from '../../types'

export type UseSendTransactionArgs = Partial<SendTransactionArgs>

export type UseSendTransactionConfig = MutationConfig<
  SendTransactionResult,
  Error,
  UseSendTransactionArgs
>

export const mutationKey = (args: UseSendTransactionArgs) =>
  [{ entity: 'sendTransaction', ...args }] as const

const mutationFn = (args: UseSendTransactionArgs) => {
  const { request } = args
  if (!request) throw new Error('request is required')
  return sendTransaction({ request })
}

export function useSendTransaction({
  request,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSendTransactionArgs & UseSendTransactionConfig = {}) {
  const { mutate, mutateAsync, ...transactionMutation } = useMutation(
    mutationKey({ request }),
    mutationFn,
    {
      onError,
      onMutate,
      onSettled,
      onSuccess,
    },
  )

  const sendTransaction = React.useCallback(
    (args?: SendTransactionArgs) => mutate(args || { request }),
    [mutate, request],
  )

  const sendTransactionAsync = React.useCallback(
    (args?: SendTransactionArgs) => mutateAsync(args || { request }),
    [mutateAsync, request],
  )

  return {
    ...transactionMutation,
    sendTransaction,
    sendTransactionAsync,
  }
}
