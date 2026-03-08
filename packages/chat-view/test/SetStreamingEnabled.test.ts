import { expect, test } from '@jest/globals'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetStreamingEnabled from '../src/parts/SetStreamingEnabled/SetStreamingEnabled.ts'

test('setStreamingEnabled should set streamingEnabled to true', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetStreamingEnabled.setStreamingEnabled(state, true)
  expect(result.streamingEnabled).toBe(true)
})

test('setStreamingEnabled should set streamingEnabled to false', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetStreamingEnabled.setStreamingEnabled(
    {
      ...state,
      streamingEnabled: true,
    },
    false,
  )
  expect(result.streamingEnabled).toBe(false)
})
