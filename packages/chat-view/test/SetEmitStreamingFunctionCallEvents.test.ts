import { expect, test } from '@jest/globals'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetEmitStreamingFunctionCallEvents from '../src/parts/SetEmitStreamingFunctionCallEvents/SetEmitStreamingFunctionCallEvents.ts'

test('setEmitStreamingFunctionCallEvents should set emitStreamingFunctionCallEvents to true', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetEmitStreamingFunctionCallEvents.setEmitStreamingFunctionCallEvents(state, true)
  expect(result.emitStreamingFunctionCallEvents).toBe(true)
})

test('setEmitStreamingFunctionCallEvents should set emitStreamingFunctionCallEvents to false', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetEmitStreamingFunctionCallEvents.setEmitStreamingFunctionCallEvents(
    {
      ...state,
      emitStreamingFunctionCallEvents: true,
    },
    false,
  )
  expect(result.emitStreamingFunctionCallEvents).toBe(false)
})
