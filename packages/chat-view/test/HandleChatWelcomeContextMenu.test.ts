import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleChatWelcomeContextMenu from '../src/parts/HandleChatWelcomeContextMenu/HandleChatWelcomeContextMenu.ts'

test('handleChatWelcomeContextMenu should return state unchanged', async () => {
  const state = createDefaultState()
  const result = await HandleChatWelcomeContextMenu.handleChatWelcomeContextMenu(state)
  expect(result).toBe(state)
})
