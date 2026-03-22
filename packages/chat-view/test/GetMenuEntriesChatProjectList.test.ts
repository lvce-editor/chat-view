import { expect, test } from '@jest/globals'
import * as GetMenuEntriesChatProjectList from '../src/parts/GetMenuEntriesChatProjectList/GetMenuEntriesChatProjectList.ts'

test('getMenuEntriesChatProjectList should include project actions when a project id is provided', () => {
  const entries = GetMenuEntriesChatProjectList.getMenuEntriesChatProjectList('project-1')
  expect(entries).toHaveLength(2)
  expect(entries[0]).toMatchObject({
    args: ['create-session-in-project:project-1'],
    command: 'Chat.handleClick',
    id: 'newChat',
    label: 'New Chat',
  })
  expect(entries[1]).toMatchObject({
    args: ['create-project'],
    command: 'Chat.handleClick',
    id: 'addProject',
    label: 'Add Project',
  })
})

test('getMenuEntriesChatProjectList should expose add project when no project row was targeted', () => {
  const entries = GetMenuEntriesChatProjectList.getMenuEntriesChatProjectList()
  expect(entries).toHaveLength(1)
  expect(entries[0]).toMatchObject({
    args: ['create-project'],
    command: 'Chat.handleClick',
    id: 'addProject',
    label: 'Add Project',
  })
})
