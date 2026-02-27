import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleSubmit from '../src/parts/HandleSubmit/HandleSubmit.ts'

test('handleSubmit should add a user message from composer value', async () => {
  const state = { ...createDefaultState(), composerValue: 'hello' }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].role).toBe('user')
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.sessions[0].messages[1].text).toBe('Mock AI response: I received "hello".')
  expect(result.composerValue).toBe('')
})

test('handleSubmit should ignore blank composer value', async () => {
  const state = { ...createDefaultState(), composerValue: '   ' }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(0)
  expect(result.ignoreNextInput).toBe(true)
})
