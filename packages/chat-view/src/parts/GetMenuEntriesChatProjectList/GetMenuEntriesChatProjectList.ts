import { MenuItemFlags } from '@lvce-editor/constants'
import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import * as GetChatViewDomStrings from '../ChatStrings/ChatStrings.ts'
import * as InputName from '../InputName/InputName.ts'

const menuEntryAddProject: MenuEntry = {
  args: [InputName.CreateProject],
  command: 'Chat.handleClick',
  flags: MenuItemFlags.None,
  id: 'addProject',
  label: GetChatViewDomStrings.addProject(),
}

export const getMenuEntriesChatProjectList = (projectId: string = ''): readonly MenuEntry[] => {
  if (!projectId) {
    return [menuEntryAddProject]
  }
  return [
    {
      args: [InputName.getCreateSessionInProjectInputName(projectId)],
      command: 'Chat.handleClick',
      flags: MenuItemFlags.None,
      id: 'newChat',
      label: GetChatViewDomStrings.newChat(),
    },
    menuEntryAddProject,
  ]
}
