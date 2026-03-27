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

export const getMenuEntriesChatProjectList = (projectId: string = '', canRemoveProject = true): readonly MenuEntry[] => {
  if (!projectId) {
    return [menuEntryAddProject]
  }
  const entries: MenuEntry[] = [
    {
      args: [InputName.getCreateSessionInProjectInputName(projectId)],
      command: 'Chat.handleClick',
      flags: MenuItemFlags.None,
      id: 'newChat',
      label: GetChatViewDomStrings.newChat(),
    },
    menuEntryAddProject,
  ]
  if (canRemoveProject) {
    entries.push({
      args: [InputName.ProjectDelete, projectId],
      command: 'Chat.handleClick',
      flags: MenuItemFlags.None,
      id: 'removeProject',
      label: GetChatViewDomStrings.removeProject(),
    })
  }
  return entries
}
