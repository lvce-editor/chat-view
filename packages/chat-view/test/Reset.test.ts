import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as Reset from '../src/parts/Reset/Reset.ts'
import * as SetChatList from '../src/parts/SetChatList/SetChatList.ts'

test('reset should clear sessions and composer and switch to list mode', async () => {
  const withChatList = SetChatList.setChatList(createDefaultState())
  const state = {
    ...withChatList,
    composerValue: 'hello',
  }

  const result = await Reset.reset(state)

  expect(result.viewMode).toBe('list')
  expect(result.sessions).toEqual([])
  expect(result.selectedSessionId).toBe('')
  expect(result.composerValue).toBe('')
})
