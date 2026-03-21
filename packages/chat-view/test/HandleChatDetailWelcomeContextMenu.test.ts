import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleChatDetailWelcomeContextMenu from '../src/parts/HandleChatDetailWelcomeContextMenu/HandleChatDetailWelcomeContextMenu.ts'

test('handleChatDetailWelcomeContextMenu should return state unchanged', async () => {
  const state = createDefaultState()
  const result = await HandleChatDetailWelcomeContextMenu.handleChatDetailWelcomeContextMenu(state)
  expect(result).toBe(state)
})
