import { expect, test } from '@jest/globals'
import { MenuItemFlags } from '@lvce-editor/constants'
import * as GetMenuEntriesChatListToggle from '../src/parts/GetMenuEntriesChatListToggle/GetMenuEntriesChatListToggle.ts'

test('getMenuEntriesChatListToggle should return bulk menu items for the show more row', () => {
  const entries = GetMenuEntriesChatListToggle.getMenuEntriesChatListToggle()

  expect(entries).toEqual([
    {
      command: 'Chat.handleClickChatListMarkAllAsRead',
      flags: MenuItemFlags.None,
      id: 'mark-all-read',
      label: 'Mark All as Read',
    },
    {
      command: 'Chat.handleClickChatListArchiveAll',
      flags: MenuItemFlags.None,
      id: 'archive-all',
      label: 'Archive All',
    },
    {
      command: '',
      flags: MenuItemFlags.Separator,
      id: 'separator',
      label: '',
    },
    {
      command: 'Chat.handleClickChatListCollapseAll',
      flags: MenuItemFlags.None,
      id: 'collapse-all',
      label: 'Collapse All',
    },
  ])
})