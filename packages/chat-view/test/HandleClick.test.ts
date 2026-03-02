/* eslint-disable @cspell/spellchecker */
import { beforeEach, expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { resetChatSessionStorage } from '../src/parts/ChatSessionStorage/ChatSessionStorage.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClick from '../src/parts/HandleClick/HandleClick.ts'

beforeEach(() => {
  resetChatSessionStorage()
})

test('handleClick should create a new session', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'create-session')
  expect(result.sessions).toHaveLength(2)
  expect(result.selectedSessionId).toBe(result.sessions[1].id)
  expect(result.sessions[1].id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
})

test('handleClick should select a session', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await HandleClick.handleClick(state, 'session:session-2')
  expect(result.selectedSessionId).toBe('session-2')
  expect(result.viewMode).toBe('detail')
})

test('handleClick should mark session for rename and prefill composer', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'session-rename:session-1')
  expect(result.renamingSessionId).toBe('session-1')
  expect(result.composerValue).toBe('Chat 1')
})

test('handleClick should delete a session', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
  }
  const result = await HandleClick.handleClick(state, 'SessionDelete', 'session-2')
  expect(result.sessions).toHaveLength(1)
  expect(result.sessions[0].id).toBe('session-1')
  expect(result.selectedSessionId).toBe('session-1')
})

test('handleClick should ignore empty action name', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, '')
  expect(result).toBe(state)
})

test('handleClick should ignore selecting unknown session', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'session:missing')
  expect(result).toBe(state)
})

test('handleClick should allow deleting last session', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    renamingSessionId: 'session-1',
    viewMode: 'detail',
  }
  const result = await HandleClick.handleClick(state, 'SessionDelete', 'session-1')
  expect(result.sessions).toHaveLength(0)
  expect(result.selectedSessionId).toBe('')
  expect(result.renamingSessionId).toBe('')
  expect(result.viewMode).toBe('list')
})

test('handleClick should keep state for unknown action', async () => {
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'unknown-action')
  expect(result).toBe(state)
})

test('handleClick should submit message when clicking send', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = await HandleClick.handleClick(state, 'send')
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleClickSend should submit message', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.rerender': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    composerValue: 'hello',
  }
  const result = await HandleClick.handleClickSend(state)
  expect(result.sessions[0].messages).toHaveLength(2)
  expect(result.sessions[0].messages[0].text).toBe('hello')
  expect(result.sessions[0].messages[1].role).toBe('assistant')
  expect(result.composerValue).toBe('')
  expect(mockRpc.invocations).toEqual([['Chat.rerender']])
})

test('handleClick should save openrouter api key to user settings', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state: ChatState = {
    ...createDefaultState(),
    openRouterApiKeyInput: 'or-key-999',
  }
  const result = await HandleClick.handleClick(state, 'save-openrouter-api-key')
  expect(result.openRouterApiKey).toBe('or-key-999')
  expect(mockRpc.invocations).toEqual([['Preferences.update', { 'secrets.openRouterApiKey': 'or-key-999' }]])
})

test('handleClick should open OpenRouter API keys settings', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state: ChatState = createDefaultState()
  const result = await HandleClick.handleClick(state, 'open-openrouter-api-key-settings')
  expect(result).toBe(state)
  expect(mockRpc.invocations).toEqual([['Main.openUri', 'https://openrouter.ai/settings/keys']])
})

test('handleClickList should open detail for session index from y coordinate', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    height: 400,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
      { id: 'session-3', messages: [], title: 'Chat 3' },
    ],
    width: 200,
    x: 0,
    y: 0,
  }
  const result = await HandleClick.handleClickList(state, 8, 131)
  expect(result.selectedSessionId).toBe('session-3')
  expect(result.viewMode).toBe('detail')
})

test('handleClickList should keep state when click index has no session', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    height: 120,
    sessions: [{ id: 'session-1', messages: [], title: 'Chat 1' }],
    width: 100,
    x: 10,
    y: 20,
  }
  const result = await HandleClick.handleClickList(state, 10, 120)
  expect(result).toBe(state)
})

test('handleClickList should ignore clicks in header area', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    height: 300,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    width: 300,
    x: 100,
    y: 200,
  }
  const result = await HandleClick.handleClickList(state, 120, 220)
  expect(result).toBe(state)
})

test('handleClickList should ignore clicks outside chat bounds', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    height: 300,
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    width: 300,
    x: 100,
    y: 200,
  }
  const result = await HandleClick.handleClickList(state, 99, 250)
  expect(result).toBe(state)
})
