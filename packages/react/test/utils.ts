import { BaseProvider, WebSocketProvider } from '@ethersproject/providers'
import { act, renderHook } from '@testing-library/react-hooks'

import { Contract } from 'ethers/lib/ethers'

import { ClientConfig, Connector, createClient } from '../src'
import {
  getMockConnector,
  getProvider,
  getSigners,
} from '../../core/test/utils'

type Config = Partial<ClientConfig>

export function setupWagmiClient(config: Config = {}) {
  return createClient<BaseProvider, WebSocketProvider>({
    connectors: [
      getMockConnector({
        signer: getSigners()[0],
      }),
    ],
    provider: getProvider,
    ...config,
  })
}

export async function actHookConnect(config: {
  connector?: Connector
  utils: ReturnType<typeof renderHook>
}) {
  const connector = config.connector
  const getConnect = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.connect || utils.result.current
  const utils = config.utils

  await act(async () => {
    const connect = getConnect(utils)
    connect.connect?.(connector ?? connect.connectors?.[0])
  })

  const { waitFor } = utils
  await waitFor(() => getConnect(utils).isConnected)
}

export async function actHookDisconnect(config: {
  utils: ReturnType<typeof renderHook>
}) {
  const getDisconnect = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.disconnect || utils.result.current
  const utils = config.utils

  await act(async () => {
    const disconnect = getDisconnect(utils)
    disconnect.disconnect?.()
  })

  const { waitFor } = utils
  await waitFor(() => getDisconnect(utils).isSuccess)
}

export async function actHookNetwork(config: {
  chainId: number
  utils: ReturnType<typeof renderHook>
}) {
  const chainId = config.chainId
  const getNetwork = (utils: ReturnType<typeof renderHook>) =>
    (utils.result.current as any)?.network || utils.result.current
  const utils = config.utils

  await act(async () => {
    getNetwork(utils).switchNetwork(chainId)
  })

  const { waitFor } = utils
  await waitFor(() => getNetwork(utils).isSuccess)
}

export async function getUnclaimedTokenId(
  addressOrName: string,
  maxAttempts = 3,
) {
  function getRandomTokenId(from: number, to: number) {
    return Math.floor(Math.random() * to) + from
  }

  let attempts = 0
  const provider = getProvider()
  const contract = new Contract(
    addressOrName,
    [
      'function ownerOf(uint256 _tokenId) external view returns (address)',
      'function totalSupply() view returns (uint256)',
    ],
    provider,
  )
  const totalSupply = await contract.totalSupply()
  while (attempts < maxAttempts) {
    const randomTokenId = getRandomTokenId(1, totalSupply)
    try {
      await contract.ownerOf(randomTokenId)
    } catch (error) {
      return randomTokenId
      break
    }
    attempts += 1
  }
  return false
}
