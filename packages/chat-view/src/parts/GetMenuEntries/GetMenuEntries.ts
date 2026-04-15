import type { MenuEntry } from '../MenuEntry/MenuEntry.ts'
import type { ContextMenuProps } from './ContextMenuProps/ContextMenuProps.ts'
import { getMenuEntriesChatAttachment } from '../GetMenuEntriesChatAttachment/GetMenuEntriesChatAttachment.ts'
import { getMenuEntriesChatHeader } from '../GetMenuEntriesChatHeader/GetMenuEntriesChatHeader.ts'
import { getMenuEntriesChatInput } from '../GetMenuEntriesChatInput/GetMenuEntriesChatInput.ts'
import { getMenuEntriesChatList } from '../GetMenuEntriesChatList/GetMenuEntriesChatList.ts'
import { getMenuEntriesChatProjectList } from '../GetMenuEntriesChatProjectList/GetMenuEntriesChatProjectList.ts'
import { getMenuEntriesProjectAddButton } from '../GetMenuEntriesProjectAddButton/GetMenuEntriesProjectAddButton.ts'
import {
  MenuChatAttachment,
  MenuChatHeader,
  MenuChatInput,
  MenuChatList,
  MenuChatProjectList,
  MenuProjectAddButton,
} from '../GetMenuEntryIds/GetMenuEntryIds.ts'

export const getMenuEntries = (menuId: number, props: ContextMenuProps): readonly MenuEntry[] => {
  switch (props.menuId) {
    case MenuChatAttachment:
      return getMenuEntriesChatAttachment(props.attachmentId, props.previewSrc)
    case MenuChatHeader:
      return getMenuEntriesChatHeader()
    case MenuChatInput:
      return getMenuEntriesChatInput()
    case MenuChatList:
      return getMenuEntriesChatList(props.sessionId, props.pinned, props.sessionPinningEnabled)
    case MenuChatProjectList:
      return getMenuEntriesChatProjectList(props.projectId, props.canRemoveProject)
    case MenuProjectAddButton:
      return getMenuEntriesProjectAddButton()
    default:
      return []
  }
}
