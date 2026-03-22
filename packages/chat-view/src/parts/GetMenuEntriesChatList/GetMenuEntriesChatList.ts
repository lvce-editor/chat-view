import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'

export const getMenuEntriesChatList = (sessionId: string = ''): readonly MenuEntry[] => {
  return [
    {
      args: [sessionId],
      command: 'Chat.handleClickRename',
      flags: MenuItemFlags.None,
      id: 'rename',
      label: ViewletExplorerStrings.rename(),
    },
    {
      args: [sessionId],
      command: 'Chat.handleClickDelete',
      flags: MenuItemFlags.None,
      id: 'archive',
      label: ViewletExplorerStrings.archive(),
    },
  ]
}
