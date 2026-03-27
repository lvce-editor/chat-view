import { expect, test } from '@jest/globals'
import type { ChatState } from '../src/parts/ChatState/ChatState.ts'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as OpenMockProject from '../src/parts/OpenMockProject/OpenMockProject.ts'

test('openMockProject should add a project and select it', async () => {
  const state: ChatState = createDefaultState()
  const result = await OpenMockProject.openMockProject(state, 'project-2', 'workspace', 'file:///workspace')
  expect(result.projects).toEqual([
    { id: 'project-1', name: '_blank', uri: '' },
    { id: 'project-2', name: 'workspace', uri: 'file:///workspace' },
  ])
  expect(result.projectExpandedIds).toEqual(['project-1', 'project-2'])
  expect(result.selectedProjectId).toBe('project-2')
})

test('openMockProject should update an existing project', async () => {
  const state: ChatState = {
    ...createDefaultState(),
    projects: [
      { id: 'project-1', name: '_blank', uri: '' },
      { id: 'project-2', name: 'old', uri: 'file:///old' },
    ],
    selectedProjectId: 'project-1',
  }
  const result = await OpenMockProject.openMockProject(state, 'project-2', 'workspace', 'file:///workspace')
  expect(result.projects).toEqual([
    { id: 'project-1', name: '_blank', uri: '' },
    { id: 'project-2', name: 'workspace', uri: 'file:///workspace' },
  ])
  expect(result.selectedProjectId).toBe('project-2')
})
