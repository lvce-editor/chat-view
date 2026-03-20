import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'

export const getMenuEntriesChatList = (): readonly MenuEntry[] => {
  return [
    {
      command: 'Chat.handleClickRename',
      flags: MenuItemFlags.None,
      id: 'rename',
      label: ViewletExplorerStrings.rename(),
    },
    {
      command: 'Chat.handleClickArchive',
      flags: MenuItemFlags.None,
      id: 'archive',
      label: ViewletExplorerStrings.archive(),
    },
  ]
}
