import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { MenuChatList } from '../src/parts/GetMenuEntryIds/GetMenuEntryIds.ts'
import * as HandleChatListContextMenu from '../src/parts/HandleChatListContextMenu/HandleChatListContextMenu.ts'

test('handleChatListContextMenu should focus the clicked item and invoke ContextMenu.show2 for session items', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    height: 400,
    uid: 7,
    width: 300,
  }
  const result = await HandleChatListContextMenu.handleChatListContextMenu(state, 100, 60)

  expect(mockRpc.invocations).toEqual([
    [
      'ContextMenu.show2',
      7,
      MenuChatList,
      100,
      60,
      { menuId: MenuChatList, pinned: false, sessionId: 'session-1', sessionPinningEnabled: state.sessionPinningEnabled },
    ],
  ])
  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: 0,
    listFocusOutline: true,
  })
})

test('handleChatListContextMenu should pass pinned session state to the context menu', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    height: 400,
    sessions: [{ id: 'session-1', messages: [], pinned: true, projectId: '', title: 'Chat 1' }],
    uid: 7,
    width: 300,
  }
  await HandleChatListContextMenu.handleChatListContextMenu(state, 100, 60)

  expect(mockRpc.invocations).toEqual([
    [
      'ContextMenu.show2',
      7,
      MenuChatList,
      100,
      60,
      { menuId: MenuChatList, pinned: true, sessionId: 'session-1', sessionPinningEnabled: state.sessionPinningEnabled },
    ],
  ])
})

test('handleChatListContextMenu should ignore clicks outside list bounds', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    height: 400,
    uid: 7,
    width: 300,
  }
  const result = await HandleChatListContextMenu.handleChatListContextMenu(state, 100, 500)

  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
})
