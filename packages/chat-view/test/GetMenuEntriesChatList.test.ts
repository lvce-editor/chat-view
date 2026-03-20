import { expect, test } from '@jest/globals'
import * as GetMenuEntriesChatList from '../src/parts/GetMenuEntriesChatList/GetMenuEntriesChatList.ts'

test('getMenuEntriesChatList should use delete command for archive label', () => {
  const entries = GetMenuEntriesChatList.getMenuEntriesChatList()
  expect(entries).toHaveLength(2)
  expect(entries[1]).toMatchObject({
    command: 'Chat.handleClickDelete',
    id: 'archive',
  })
})
