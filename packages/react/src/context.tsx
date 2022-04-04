import * as React from 'react'
import { BaseProvider, WebSocketProvider } from '@ethersproject/providers'
import {
  WagmiClient,
  ClientConfig as WagmiClientConfig,
  createClient as createWagmiClient,
} from '@wagmi/core'
import { QueryClient, QueryClientProvider } from 'react-query'
import { persistQueryClient } from 'react-query/persistQueryClient-experimental'
import { createWebStoragePersistor } from 'react-query/createWebStoragePersistor-experimental'

import { deserialize, serialize } from './utils'

type DecoratedWagmiClient<
  TProvider extends BaseProvider = BaseProvider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = WagmiClient<TProvider, TWebSocketProvider> & { queryClient: QueryClient }
export const Context = React.createContext<
  DecoratedWagmiClient<BaseProvider, WebSocketProvider> | undefined
>(undefined)

export type ClientConfig<
  TProvider extends BaseProvider = BaseProvider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = WagmiClientConfig<TProvider, TWebSocketProvider> & {
  queryClient?: QueryClient
}
export function createClient<
  TProvider extends BaseProvider,
  TWebSocketProvider extends WebSocketProvider,
>({
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        cacheTime: 60 * 60 * 24, // 24 hours
        notifyOnChangeProps: 'tracked',
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  }),
  ...config
}: ClientConfig<TProvider, TWebSocketProvider> = {}) {
  const client = createWagmiClient<TProvider, TWebSocketProvider>(config)
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

export type ProviderProps<
  TProvider extends BaseProvider = BaseProvider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
> = {
  /** React-decorated WagmiClient instance */
  client?: DecoratedWagmiClient<TProvider, TWebSocketProvider>
}
export function Provider<
  TProvider extends BaseProvider,
  TWebSocketProvider extends WebSocketProvider,
>({
  children,
  client = createClient<TProvider, TWebSocketProvider>(),
}: React.PropsWithChildren<ProviderProps<TProvider, TWebSocketProvider>>) {
  // Attempt to connect on mount
  React.useEffect(() => {
    ;(async () => {
      if (!client.config.autoConnect) return
      await client.autoConnect()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Context.Provider value={client as unknown as DecoratedWagmiClient}>
      <QueryClientProvider client={client.queryClient}>
        {children}
      </QueryClientProvider>
    </Context.Provider>
  )
}

export function useClient<
  TProvider extends BaseProvider,
  TWebSocketProvider extends WebSocketProvider = WebSocketProvider,
>() {
  const client = React.useContext(Context) as unknown as DecoratedWagmiClient<
    TProvider,
    TWebSocketProvider
  >
  if (!client) throw Error('Must be used within WagmiProvider')
  return client
}
