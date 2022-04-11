import {
  getMockConnector,
  getProvider,
  getSigners,
  getWebSocketProvider,
} from '../test'
import { Client, createClient, getClient } from './client'
import { createStorage } from './storage'

describe('createClient', () => {
  it('returns client', () => {
    const client = createClient()
    expect(client).toBeInstanceOf(Client)
  })

  describe('config', () => {
    describe('autoConnect', () => {
      it('true', async () => {
        const client = createClient({ autoConnect: true })
        expect(client.status).toMatchInlineSnapshot(`"connecting"`)
        await client.autoConnect()
        expect(client.status).toMatchInlineSnapshot(`"disconnected"`)
      })

      it('false', () => {
        const client = createClient({ autoConnect: false })
        expect(client.status).toMatchInlineSnapshot(`"disconnected"`)
      })
    })

    describe('connectors', () => {
      it('default', () => {
        const client = createClient()
        expect(client.connectors.map((x) => x.name)).toMatchInlineSnapshot(`
          [
            "Injected",
          ]
        `)
      })

      it('custom', () => {
        const client = createClient({
          connectors: [
            getMockConnector({
              signer: getSigners()[0],
            }),
          ],
        })
        expect(client.connectors.map((x) => x.name)).toMatchInlineSnapshot(`
          [
            "Mock",
          ]
        `)
      })
    })

    describe('provider', () => {
      it('default', () => {
        const client = createClient()
        expect(client.provider).toBeDefined()
      })

      it('custom', () => {
        const client = createClient({
          provider: getProvider,
        })
        expect(client.provider).toMatchInlineSnapshot(
          `"<Provider network={31337} />"`,
        )
      })
    })

    describe('storage', () => {
      it('default', () => {
        const client = createClient()
        expect(client.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `)
      })

      it('custom', () => {
        const client = createClient({
          storage: createStorage({ storage: window.localStorage }),
        })
        expect(client.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `)
      })
    })

    describe('webSocketProvider', () => {
      it('default', () => {
        const client = createClient()
        expect(client.webSocketProvider).toBeUndefined()
      })

      it('custom', async () => {
        const client = createClient({
          webSocketProvider: getWebSocketProvider,
        })
        await client.webSocketProvider?.destroy()
        expect(client.webSocketProvider).toMatchInlineSnapshot(
          `"<WebSocketProvider network={31337} />"`,
        )
      })
    })
  })
})

describe('getClient', () => {
  it('returns client', () => {
    createClient()
    expect(getClient()).toBeDefined()
  })
})
