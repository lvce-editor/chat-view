import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletChatStrings from '../ChatStrings/ChatStrings.ts'

export const getMenuEntriesChatHeader = (): readonly MenuEntry[] => {
  // TODO
  return [
    {
      command: 'Chat.showIcons',
      flags: MenuItemFlags.None,
      id: 'showIcons',
      label: ViewletExplorerStrings.cut(),
      id: 'cut',
      label: ViewletChatStrings.cut(),
    },
    {
      command: 'Chat.handleInputCopy',
      flags: MenuItemFlags.None,
      id: 'copy',
      label: ViewletChatStrings.copy(),
    },
    {
      command: 'Chat.handleInputPaste',
      flags: MenuItemFlags.None,
      id: 'copy',
      label: ViewletChatStrings.paste(),
    },
  ]
}
