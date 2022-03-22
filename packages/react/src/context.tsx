import * as React from 'react'
import {
  WagmiClient,
  ClientConfig as WagmiClientConfig,
  createClient as createWagmiClient,
} from '@wagmi/core'
import {
  QueryClient,
  QueryClientConfig,
  QueryClientProvider,
} from 'react-query'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'

import { deserialize, serialize } from './utils'

export const Context = React.createContext<WagmiClient | undefined>(undefined)

export type ClientConfig = WagmiClientConfig & {
  queryClient?: QueryClient
}

const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      notifyOnChangeProps: 'tracked',
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
}

export function createClient({
  queryClient = new QueryClient(defaultQueryClientConfig),
  ...config
}: ClientConfig = {}) {
  const client = createWagmiClient(config)
  const persistor = createWebStoragePersistor({
    storage: (client.storage as Storage) || window.localStorage,
    serialize,
    deserialize,
  })
  persistQueryClient({
    queryClient,
    persistor,
    dehydrateOptions: {
      shouldDehydrateQuery: (query) => query.cacheTime !== 0,
    },
  })
  return Object.assign(client, { queryClient })
}

export type ProviderProps = {
  /** React-decorated WagmiClient instance */
  client?: ReturnType<typeof createClient>
}

export function Provider({
  children,
  client = createClient(),
}: React.PropsWithChildren<ProviderProps>) {
  // Attempt to connect on mount
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    ;(async () => {
      if (!client.config.autoConnect) return
      await client.autoConnect()
    })()
  }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <Context.Provider value={client}>
      <QueryClientProvider client={client.queryClient}>
        {children}
      </QueryClientProvider>
    </Context.Provider>
  )
}

export function useClient() {
  const client = React.useContext(Context)
  if (!client) throw Error('Must be used within WagmiProvider')
  return client
}
