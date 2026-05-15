import { expect, test } from '@jest/globals'
import { mergeClassNames, VirtualDomElements } from '@lvce-editor/virtual-dom-worker'
import * as ClassNames from '../src/parts/ClassNames/ClassNames.ts'
import { getChatListItemStatusDom } from '../src/parts/GetChatListItemStatusDom/GetChatListItemStatusDom.ts'

test('getChatListItemStatusDom returns status row nodes', () => {
  const result = getChatListItemStatusDom(ClassNames.ChatListItemStatusStopped)

  expect(result).toEqual([
    {
      childCount: 1,
      className: ClassNames.ChatListItemStatusRow,
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: mergeClassNames(ClassNames.ChatListItemStatusIcon, ClassNames.ChatListItemStatusStopped),
      type: VirtualDomElements.Div,
    },
  ])
})
