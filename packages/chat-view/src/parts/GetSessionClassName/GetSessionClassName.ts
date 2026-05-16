import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getSessionClassName = (focused: boolean, showFocusOutline: boolean, unread = false): string => {
  const unreadClassName = unread ? ClassNames.ChatListItemUnread : ClassNames.Empty
  if (showFocusOutline) {
    return mergeClassNames(
      ClassNames.ChatListItem,
      ClassNames.ChatListItemFocused,
      ClassNames.ChatListItemFocusOutline,
      ClassNames.FocusOutline,
      unreadClassName,
    )
  }
  if (focused) {
    return mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused, unreadClassName)
  }
  return mergeClassNames(ClassNames.ChatListItem, unreadClassName)
}
