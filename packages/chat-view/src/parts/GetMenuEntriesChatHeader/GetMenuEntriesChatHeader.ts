import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletExplorerStrings from '../ChatStrings/ChatStrings.ts'

export const getMenuEntriesChatHeader = (): readonly MenuEntry[] => {
  // TODO
  return [
    {
      command: 'Chat.showIcons',
      flags: MenuItemFlags.None,
      id: 'showIcons',
      label: ViewletExplorerStrings.cut(),
    },
    {
      command: 'Chat.handleInputCopy',
      flags: MenuItemFlags.None,
      id: 'copy',
      label: ViewletExplorerStrings.copy(),
    },
    {
      command: 'Chat.handleInputPaste',
      flags: MenuItemFlags.None,
      id: 'copy',
      label: ViewletExplorerStrings.paste(),
    },
  ]
}
