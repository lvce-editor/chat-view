import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleSubmit from '../src/parts/HandleSubmit/HandleSubmit.ts'

test('handleSubmit should add a user message from composer value', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = { ...createDefaultState(), composerValue: 'hello', viewMode: 'detail' as const }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].role).toBe('user')
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.sessions[0].messages[1].text).toBe('Mock AI response: I received "hello".')
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleSubmit should create a new session and switch to detail mode from list mode', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state = { ...createDefaultState(), composerValue: 'first message', viewMode: 'list' as const }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions).toHaveLength(state.sessions.length + 1)
  const newSession = result.sessions.at(-1)
  expect(newSession).toBeDefined()
  expect(newSession?.id).toBe(result.selectedSessionId)
  expect(result.selectedSessionId).not.toBe(state.selectedSessionId)
  expect(result.viewMode).toBe('detail')
  expect(newSession?.messages).toHaveLength(2)
  expect(newSession?.messages[0].role).toBe('user')
  expect(newSession?.messages[0].text).toBe('first message')
  expect(newSession?.messages[1].role).toBe('assistant')
  expect(result.lastSubmittedSessionId).toBe(result.selectedSessionId)
  expect(result.composerValue).toBe('')
  expect(result.focus).toBe('composer')
  expect(result.focused).toBe(true)
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleSubmit should ignore blank composer value', async () => {
  const state = { ...createDefaultState(), composerValue: '   ' }
  const result = await HandleSubmit.handleSubmit(state)
  expect(result.sessions[0].messages).toHaveLength(0)
  expect(result).toBe(state)
})
