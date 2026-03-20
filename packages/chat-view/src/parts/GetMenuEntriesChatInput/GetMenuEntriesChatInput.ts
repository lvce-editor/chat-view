import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ViewletExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'

export const getMenuEntriesChatInput = (): readonly MenuEntry[] => {
  return [
    {
      command: 'Chat.handleInputCut',
      flags: MenuItemFlags.None,
      id: 'cut',
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
