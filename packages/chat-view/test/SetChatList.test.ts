import { expect, test } from '@jest/globals'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetChatList from '../src/parts/SetChatList/SetChatList.ts'

test('setChatList should switch to list mode and prepare search state', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetChatList.setChatList(state)
  expect(result.viewMode).toBe('list')
  expect(result.selectedSessionId).toBe('session-a')
  expect(result.sessions).toHaveLength(3)
  expect(result.searchEnabled).toBe(true)
  expect(result.searchFieldVisible).toBe(false)
  expect(result.searchValue).toBe('')
})
