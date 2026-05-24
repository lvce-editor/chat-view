import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { MenuChatList, MenuChatListToggle } from '../src/parts/GetMenuEntryIds/GetMenuEntryIds.ts'
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

  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 7, MenuChatList, 100, 60, { menuId: MenuChatList, sessionId: 'session-1' }]])
  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: 0,
    listFocusOutline: true,
  })
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

test('handleChatListContextMenu should show the toggle-row context menu for show more', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state: ChatState = {
    ...createDefaultState(),
    height: 400,
    sessions: [
      { id: 'session-1', messages: [], projectId: 'project-1', status: 'idle' as const, title: 'Chat 1' },
      { id: 'session-2', messages: [], projectId: 'project-1', status: 'idle' as const, title: 'Chat 2' },
      { id: 'session-3', messages: [], projectId: 'project-1', status: 'idle' as const, title: 'Chat 3' },
      { id: 'session-4', messages: [], projectId: 'project-1', status: 'idle' as const, title: 'Chat 4' },
      { id: 'session-5', messages: [], projectId: 'project-1', status: 'idle' as const, title: 'Chat 5' },
    ],
    uid: 7,
    width: 300,
  }
  const result = await HandleChatListContextMenu.handleChatListContextMenu(state, 100, 220)

  expect(mockRpc.invocations).toEqual([['ContextMenu.show2', 7, MenuChatListToggle, 100, 220, { menuId: MenuChatListToggle }]])
  expect(result).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: -1,
    listFocusOutline: false,
  })
})
