import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SaveState from '../src/parts/SaveState/SaveState.ts'

test('saveState should persist global state without session payloads', () => {
  const state: ChatState = {
    ...createDefaultState(),
    chatListScrollTop: 80,
    composerValue: 'draft',
    messagesScrollTop: 120,
    nextMessageId: 4,
    renamingSessionId: 'session-1',
    searchFieldVisible: true,
    searchValue: 'draft query',
    selectedModelId: 'codex-5.3',
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    systemPrompt: 'You are a helpful coding assistant.',
  }
  const result = SaveState.saveState(state)
  expect(result.composerValue).toBe('draft')
  expect(result.nextMessageId).toBe(4)
  expect('sessions' in result).toBe(false)
  expect(result.selectedModelId).toBe('codex-5.3')
  expect(result.systemPrompt).toBe('You are a helpful coding assistant.')
  expect(result.selectedSessionId).toBe('session-1')
  expect(result.renamingSessionId).toBe('session-1')
  expect(result.searchFieldVisible).toBe(true)
  expect(result.searchValue).toBe('draft query')
  expect(result.viewMode).toBe('list')
  expect(result.chatListScrollTop).toBe(80)
  expect(result.messagesScrollTop).toBe(120)
  expect(result.selectedProjectId).toBe('project-1')
  expect(result.projects).toEqual(state.projects)
  expect(result.projectListScrollTop).toBe(0)
  expect(result.lastNormalViewMode).toBe('list')
})
