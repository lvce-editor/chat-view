import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletChatStrings from '../ChatStrings/ChatStrings.ts'

export const getMenuEntriesChatInput = (): readonly MenuEntry[] => {
  return [
    {
      command: 'Chat.handleInputCut',
      flags: MenuItemFlags.None,
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
