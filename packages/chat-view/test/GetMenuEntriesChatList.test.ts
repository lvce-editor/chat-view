import { expect, test } from '@jest/globals'
import * as GetMenuEntriesChatList from '../src/parts/GetMenuEntriesChatList/GetMenuEntriesChatList.ts'

test('getMenuEntriesChatList should use delete command for archive label', () => {
  const entries = GetMenuEntriesChatList.getMenuEntriesChatList()
  expect(entries).toHaveLength(3)
  expect(entries[1]).toMatchObject({
    command: 'Chat.handleClickPin',
    id: 'pin',
  })
  expect(entries[2]).toMatchObject({
    command: 'Chat.handleClickDelete',
    id: 'archive',
  })
})

test('getMenuEntriesChatList should render unpin action for pinned sessions', () => {
  const entries = GetMenuEntriesChatList.getMenuEntriesChatList('session-1', true)
  expect(entries[1]).toMatchObject({
    command: 'Chat.handleClickPin',
    id: 'unpin',
    label: 'Unpin',
  })
})

test('getMenuEntriesChatList should omit pin action when pinning is disabled', () => {
  const entries = GetMenuEntriesChatList.getMenuEntriesChatList('session-1', false, false)
  expect(entries).toHaveLength(2)
  expect(entries.every((entry) => entry.command !== 'Chat.handleClickPin')).toBe(true)
})
