import { MenuEntryId } from '@lvce-editor/constants'

export const MenuChatList = 2178
export const MenuChatHeader = 2179
export const MenuChatInput = 2180
export const MenuProjectAddButton = 2181
export const MenuChatProjectList = 2182
export const MenuChatAttachment = 2183
export const MenuChatPrimaryControlsOverflow = 2184

export const getMenuEntryIds = (): readonly number[] => {
  return [
    MenuEntryId.Chat,
    MenuChatList,
    MenuChatHeader,
    MenuChatInput,
    MenuProjectAddButton,
    MenuChatProjectList,
    MenuChatAttachment,
    MenuChatPrimaryControlsOverflow,
  ]
}
