import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import { getMenuEntriesChatHeader } from '../GetMenuEntriesChatHeader/GetMenuEntriesChatHeader.ts'
import { getMenuEntriesChatInput } from '../GetMenuEntriesChatInput/GetMenuEntriesChatInput.ts'
import { getMenuEntriesChatList } from '../GetMenuEntriesChatList/GetMenuEntriesChatList.ts'
import { getMenuEntriesChatProjectList } from '../GetMenuEntriesChatProjectList/GetMenuEntriesChatProjectList.ts'
import { MenuChatHeader, MenuChatInput, MenuChatList, MenuChatProjectList } from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export interface ContextMenuProps {
  readonly menuId: number
  readonly [key: string]: any
}

export const getMenuEntries = (menuId: number, props: ContextMenuProps): readonly MenuEntry[] => {
  switch (props.menuId) {
    case MenuChatHeader:
      return getMenuEntriesChatHeader()
    case MenuChatInput:
      return getMenuEntriesChatInput()
    case MenuChatList:
      return getMenuEntriesChatList()
    case MenuChatProjectList:
      return getMenuEntriesChatProjectList(props.projectId)
    default:
      return []
  }
}
