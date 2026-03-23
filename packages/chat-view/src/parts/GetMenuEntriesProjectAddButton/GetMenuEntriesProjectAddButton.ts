import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as ChatStrings from '../ChatStrings/ChatStrings.ts'
import * as InputName from '../InputName/InputName.ts'

export const getMenuEntriesProjectAddButton = (): readonly MenuEntry[] => {
  return [
    {
      args: [InputName.CreateProject],
      command: 'Chat.handleClick',
      flags: MenuItemFlags.None,
      id: 'addProject',
      label: ChatStrings.addProject(),
    },
  ]
}
