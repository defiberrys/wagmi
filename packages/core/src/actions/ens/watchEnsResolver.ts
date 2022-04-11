import { getClient } from '../../client'
import {
  FetchEnsResolverArgs,
  FetchEnsResolverResult,
  fetchEnsResolver,
} from './fetchEnsResolver'

export type WatchEnsResolverCallback = (
  resolver: FetchEnsResolverResult,
) => void

export function watchEnsResolver(
  args: FetchEnsResolverArgs,
  callback: WatchEnsResolverCallback,
) {
  const client = getClient()
  const handleChange = async () => callback(await fetchEnsResolver(args))
  const unsubscribe = client.subscribe(({ provider }) => provider, handleChange)
  return unsubscribe
}
