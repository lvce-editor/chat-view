import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletChatStrings from '../ChatStrings/ChatStrings.ts'

export const getMenuEntriesChatList = (sessionId: string = '', pinned = false, sessionPinningEnabled = true): readonly MenuEntry[] => {
  return [
    {
      args: [sessionId],
      command: 'Chat.handleClickRename',
      flags: MenuItemFlags.None,
      id: 'rename',
      label: ViewletChatStrings.rename(),
    },
    ...(sessionPinningEnabled
      ? [
          {
            args: [sessionId],
            command: 'Chat.handleClickPin',
            flags: MenuItemFlags.None,
            id: pinned ? 'unpin' : 'pin',
            label: pinned ? ViewletChatStrings.unpinChatSession() : ViewletChatStrings.pinChatSession(),
          },
        ]
      : []),
    {
      args: [sessionId],
      command: 'Chat.handleClickDelete',
      flags: MenuItemFlags.None,
      id: 'archive',
      label: ViewletChatStrings.archive(),
    },
  ]
}
