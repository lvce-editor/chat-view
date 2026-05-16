import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import { menuEntrySeparator } from '../MenuEntrySeparator/MenuEntrySeparator.ts'
import * as ViewletChatStrings from '../ChatStrings/ChatStrings.ts'

export const getMenuEntriesChatListToggle = (): readonly MenuEntry[] => {
  return [
    {
      command: 'Chat.handleClickChatListMarkAllAsRead',
      flags: MenuItemFlags.None,
      id: 'mark-all-read',
      label: ViewletChatStrings.markAllAsRead(),
    },
    {
      command: 'Chat.handleClickChatListArchiveAll',
      flags: MenuItemFlags.None,
      id: 'archive-all',
      label: ViewletChatStrings.archiveAll(),
    },
    menuEntrySeparator,
    {
      command: 'Chat.handleClickChatListCollapseAll',
      flags: MenuItemFlags.None,
      id: 'collapse-all',
      label: ViewletChatStrings.collapseAllChats(),
    },
  ]
}