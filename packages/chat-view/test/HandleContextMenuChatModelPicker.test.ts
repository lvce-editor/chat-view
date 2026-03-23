import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleContextMenuChatModelPicker from '../src/parts/HandleContextMenuChatModelPicker/HandleContextMenuChatModelPicker.ts'

test('handleContextMenuChatModelPicker should return state', async () => {
  const state = createDefaultState()
  const result = await HandleContextMenuChatModelPicker.handleContextMenuChatModelPicker(state)
  expect(result).toBe(state)
})
