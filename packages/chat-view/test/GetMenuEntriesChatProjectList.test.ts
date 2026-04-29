import { expect, test } from '@jest/globals'
import * as GetMenuEntriesChatProjectList from '../src/parts/GetMenuEntriesChatProjectList/GetMenuEntriesChatProjectList.ts'

test('getMenuEntriesChatProjectList should include project actions when a project id is provided', () => {
  const entries = GetMenuEntriesChatProjectList.getMenuEntriesChatProjectList({ projectId: 'project-1' })
  expect(entries).toHaveLength(3)
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
  expect(entries[2]).toMatchObject({
    args: ['ProjectDelete', 'project-1'],
    command: 'Chat.handleClick',
    id: 'removeProject',
    label: 'Remove Project',
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

test('getMenuEntriesChatProjectList should omit remove project when removal is disabled', () => {
  const entries = GetMenuEntriesChatProjectList.getMenuEntriesChatProjectList({ canRemoveProject: false, projectId: 'project-1' })
  expect(entries).toHaveLength(2)
  expect(entries.map((entry) => entry.id)).toEqual(['newChat', 'addProject'])
})
