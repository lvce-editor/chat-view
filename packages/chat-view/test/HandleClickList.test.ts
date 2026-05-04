import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as ChatListFocusNext from '../src/parts/ChatListFocusNext/ChatListFocusNext.ts'
import * as HandleClickList from '../src/parts/HandleClickList/HandleClickList.ts'

test('handleClickList should clear list selection for empty-area click and allow ArrowDown to select first row', async () => {
  const state = {
    ...createDefaultState(),
    height: 400,
    listFocusedIndex: 1,
    listSelectedSessionId: 'session-2',
    searchEnabled: true,
    searchValue: 'chat',
    sessions: [
      { id: 'session-1', messages: [], title: 'Chat 1' },
      { id: 'session-2', messages: [], title: 'Chat 2' },
    ],
    width: 300,
    x: 0,
    y: 0,
  }
  const clickedEmptyArea = await HandleClickList.handleClickList(state, 120, 220)
  expect(clickedEmptyArea).toEqual({
    ...state,
    focus: 'list',
    focused: true,
    listFocusedIndex: -1,
    listFocusOutline: false,
    listSelectedSessionId: '',
  })
  const arrowDownResult = await ChatListFocusNext.chatListFocusNext(clickedEmptyArea)
  expect(arrowDownResult.listFocusedIndex).toBe(0)
  expect(arrowDownResult.listSelectedSessionId).toBe('session-1')
})
