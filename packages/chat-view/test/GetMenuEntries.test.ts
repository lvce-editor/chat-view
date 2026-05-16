import { expect, test } from '@jest/globals'
import * as GetMenuEntries from '../src/parts/GetMenuEntries/GetMenuEntries.ts'
import { MenuChatList, MenuChatListToggle } from '../src/parts/GetMenuEntryIds/GetMenuEntryIds.ts'

test('getMenuEntries should pass the session id through for chat list archive actions', () => {
  const entries = GetMenuEntries.getMenuEntries(MenuChatList, {
    menuId: MenuChatList,
    sessionId: 'session-1',
  })

  expect(entries).toHaveLength(2)
  expect(entries[1]).toMatchObject({
    args: ['session-1'],
    command: 'Chat.handleClickDelete',
    id: 'archive',
  })
})

test('getMenuEntries should return the dedicated toggle-row menu entries', () => {
  const entries = GetMenuEntries.getMenuEntries(MenuChatListToggle, {
    menuId: MenuChatListToggle,
  })

  expect(entries.map((entry) => entry.id)).toEqual(['mark-all-read', 'archive-all', 'separator', 'collapse-all'])
})
