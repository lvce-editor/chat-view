import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { useMockApi } from '../src/parts/UseMockApi/UseMockApi.ts'

test('useMockApi should enable mock mode and set default command id', () => {
  const state = createDefaultState()
  const result = useMockApi(state, true)
  expect(result.useMockApi).toBe(true)
  expect(result.mockApiCommandId).toBe('ChatE2e.mockApi')
})

test('useMockApi should enable mock mode and set custom command id', () => {
  const state = createDefaultState()
  const result = useMockApi(state, true, 'ChatTest.customApi')
  expect(result.useMockApi).toBe(true)
  expect(result.mockApiCommandId).toBe('ChatTest.customApi')
})

test('useMockApi should disable mock mode', () => {
  const state = {
    ...createDefaultState(),
    mockApiCommandId: 'ChatTest.customApi',
    useMockApi: true,
  }
  const result = useMockApi(state, false)
  expect(result.useMockApi).toBe(false)
  expect(result.mockApiCommandId).toBe('ChatTest.customApi')
})
