import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleChatInputContextMenu from '../src/parts/HandleChatInputContextMenu/HandleChatInputContextMenu.ts'

test('handleChatInputContextMenu should return state unchanged', async () => {
  const state = createDefaultState()
  const result = await HandleChatInputContextMenu.handleChatInputContextMenu(state, 0, 0)
  expect(result).toBe(state)
})
