import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../ClassNames/ClassNames.ts'

export const getSessionClassName = (focused: boolean, showFocusOutline: boolean): string => {
  return showFocusOutline
    ? mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused, ClassNames.ChatListItemFocusOutline, ClassNames.FocusOutline)
    : focused
      ? mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused)
      : ClassNames.ChatListItem
}
