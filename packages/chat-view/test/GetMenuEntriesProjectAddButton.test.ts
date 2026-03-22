import { expect, test } from '@jest/globals'
import * as GetMenuEntriesProjectAddButton from '../src/parts/GetMenuEntriesProjectAddButton/GetMenuEntriesProjectAddButton.ts'

test('getMenuEntriesProjectAddButton should invoke Chat.handleClick for add project', () => {
  const entries = GetMenuEntriesProjectAddButton.getMenuEntriesProjectAddButton()
  expect(entries).toHaveLength(1)
  expect(entries[0]).toMatchObject({
    args: ['create-project'],
    command: 'Chat.handleClick',
    id: 'addProject',
    label: 'Add Project...',
  })
})
