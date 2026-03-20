import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleChatHeaderContextMenu from '../src/parts/HandleChatHeaderContextMenu/HandleChatHeaderContextMenu.ts'

test('handleChatHeaderContextMenu should return state', async () => {
  const state = createDefaultState()
  const result = await HandleChatHeaderContextMenu.handleChatHeaderContextMenu(state)
  expect(result).toBe(state)
})
