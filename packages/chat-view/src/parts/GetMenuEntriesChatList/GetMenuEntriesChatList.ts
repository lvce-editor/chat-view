import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletChatStrings from '../ChatStrings/ChatStrings.ts'
import type { ContextMenuProps } from '../GetMenuEntries/ContextMenuProps/ContextMenuProps.ts'

type Props = Pick<ContextMenuProps, 'sessionId'>

export const getMenuEntriesChatList = ({ sessionId = '' }: Props = {}): readonly MenuEntry[] => {
  return [
    {
      args: [sessionId],
      command: 'Chat.handleClickRename',
      flags: MenuItemFlags.None,
      id: 'rename',
      label: ViewletChatStrings.rename(),
    },
    {
      args: [sessionId],
      command: 'Chat.handleClickDelete',
      flags: MenuItemFlags.None,
      id: 'archive',
      label: ViewletChatStrings.archive(),
    },
  ]
}
