import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getSessionClassName = (focused: boolean, showFocusOutline: boolean): string => {
  if (showFocusOutline) {
    return mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused, ClassNames.ChatListItemFocusOutline, ClassNames.FocusOutline)
  }
  if (focused) {
    return mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused)
  }
  return ClassNames.ChatListItem
}
