import { config } from '@wagmi/test'
import { testHook } from '@wagmi/test/svelte'
import { flushSync } from 'svelte'
import { expect, test, vi } from 'vitest'
import { useChainId } from './useChainId.svelte.js'

test(
  'default',
  testHook(async () => {
    const chainId = $derived.by(useChainId())
    expect(chainId).toMatchInlineSnapshot('1')

    config.setState((x) => ({ ...x, chainId: 456 }))
    const svelte = await import('svelte')
    svelte.getContext = vi.fn().mockReturnValue(config) // TODO: why do i need to mock it again?
    flushSync()
    expect(chainId).toMatchInlineSnapshot('456')
  }),
)

test(
  'parameters: config',
  testHook(
    () => {
      const chainId = $derived.by(useChainId(() => ({ config })))
      expect(chainId).toBeDefined()
    },
    { shouldMockConfig: false },
  ),
)
