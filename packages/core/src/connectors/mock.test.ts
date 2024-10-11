import { connect, getWalletClient } from '@wagmi/core'
import { accounts, config } from '@wagmi/test'
import { expect, test } from 'vitest'
import { mock } from './mock.js'

test('setup', () => {
  const connectorFn = mock({ accounts })
  const connector = config._internal.connectors.setup(connectorFn)
  expect(connector.name).toEqual('Mock Connector')
})

test('connector client is defined', async () => {
  const connectorFn = mock({ accounts })
  const connector = config._internal.connectors.setup(connectorFn)

  await connect(config, { connector })
  await expect(getWalletClient(config)).resolves.toBeDefined()
})

test('behavior: features.connectError', () => {
  const connectorFn = mock({ accounts, features: { connectError: true } })
  const connector = config._internal.connectors.setup(connectorFn)
  expect(() => connector.connect()).rejects.toThrowErrorMatchingInlineSnapshot(`
    [UserRejectedRequestError: User rejected the request.

    Details: Failed to connect.
    Version: viem@2.17.0]
  `)
})

test('behavior: connector.getProvider request errors', async () => {
  const connectorFn = mock({
    accounts,
    features: {
      signMessageError: true,
      signTypedDataError: true,
      switchChainError: true,
      watchAssetError: true,
    },
  })
  const connector = config._internal.connectors.setup(
    connectorFn,
  ) as ReturnType<typeof connectorFn>
  const provider = await connector.getProvider()

  expect(
    provider.request({
      method: 'eth_signTypedData_v4',
      params: [] as any,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [UserRejectedRequestError: User rejected the request.

    Details: Failed to sign typed data.
    Version: viem@2.17.0]
  `)

  expect(
    provider.request({
      method: 'wallet_switchEthereumChain',
      params: [] as any,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [UserRejectedRequestError: User rejected the request.

    Details: Failed to switch chain.
    Version: viem@2.17.0]
  `)

  expect(
    provider.request({
      method: 'wallet_watchAsset',
      params: [] as any,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [UserRejectedRequestError: User rejected the request.

    Details: Failed to switch chain.
    Version: viem@2.17.0]
  `)

  expect(
    provider.request({
      method: 'personal_sign',
      params: [] as any,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [UserRejectedRequestError: User rejected the request.

    Details: Failed to sign message.
    Version: viem@2.17.0]
  `)
})
