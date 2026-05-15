import { expect, test } from '@jest/globals'
import { mergeClassNames } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getSessionClassName } from '../src/parts/GetSessionClassName/GetSessionClassName.ts'

test('getSessionClassName returns the base chat list item class when not focused', () => {
  expect(getSessionClassName(false, false)).toBe(ClassNames.ChatListItem)
})

test('getSessionClassName returns focused classes when focused', () => {
  expect(getSessionClassName(true, false)).toBe(mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused))
})

test('getSessionClassName returns focus outline classes when focus outline is shown', () => {
  expect(getSessionClassName(false, true)).toBe(
    mergeClassNames(ClassNames.ChatListItem, ClassNames.ChatListItemFocused, ClassNames.ChatListItemFocusOutline, ClassNames.FocusOutline),
  )
})
