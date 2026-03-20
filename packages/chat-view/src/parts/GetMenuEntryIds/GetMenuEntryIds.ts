import { MenuEntryId } from '@lvce-editor/constants'

export const MenuChatList = 2178

export const getMenuEntryIds = (): readonly number[] => {
  return [MenuEntryId.Chat, MenuChatList]
}
