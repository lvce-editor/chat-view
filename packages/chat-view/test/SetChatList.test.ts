import { expect, test } from '@jest/globals'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetChatList from '../src/parts/SetChatList/SetChatList.ts'

test('setChatList should switch to detail mode', () => {
  const state = CreateDefaultState.createDefaultState()
  const result = SetChatList.setChatList(state)
  expect(result.viewMode).toBe('detail')
  expect(result.selectedSessionId).toBe('session-a')
  expect(result.sessions).toHaveLength(3)
})
