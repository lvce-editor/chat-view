import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

const outlinedClassName = mergeClassNames(
  ClassNames.ChatListItem,
  ClassNames.ChatListItemFocused,
  ClassNames.ChatListItemFocusOutline,
  ClassNames.FocusOutline,
)
const focusedClassName = mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused)

export const getSessionClassName = (focused: boolean, showFocusOutline: boolean): string => {
  if (showFocusOutline) {
    return outlinedClassName
  }
  if (focused) {
    return focusedClassName
  }
  return ClassNames.ChatListItem
}
