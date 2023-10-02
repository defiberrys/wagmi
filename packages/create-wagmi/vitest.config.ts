import { defineProject } from 'vitest/config'

// https://vitest.dev/config
export default defineProject({
  test: {
    name: 'create-wagmi',
    environment: 'node',
    testTimeout: 10_000,
  },
})
