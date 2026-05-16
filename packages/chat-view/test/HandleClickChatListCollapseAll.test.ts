import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClickChatListCollapseAll from '../src/parts/HandleClickChatListCollapseAll/HandleClickChatListCollapseAll.ts'

test('handleClickChatListCollapseAll should collapse the list and clamp focus to the visible range', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    chatListExpanded: true,
    listFocusedIndex: 4,
  }

  const result = await HandleClickChatListCollapseAll.handleClickChatListCollapseAll(state)

  expect(result.chatListExpanded).toBe(false)
  expect(result.listFocusedIndex).toBe(2)
})