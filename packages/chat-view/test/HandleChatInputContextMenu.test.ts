import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleChatInputContextMenu from '../src/parts/HandleChatInputContextMenu/HandleChatInputContextMenu.ts'

test('handleChatInputContextMenu should return state unchanged', async () => {
  const state = createDefaultState()
  const result = await HandleChatInputContextMenu.handleChatInputContextMenu(state)
  expect(result).toBe(state)
})
