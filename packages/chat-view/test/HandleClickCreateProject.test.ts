import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClickCreateProject from '../src/parts/HandleClickCreateProject/HandleClickCreateProject.ts'

test('handleClickCreateProject should add a new project from picked folder', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FilePicker.showDirectoryPicker': async () => {
      return 'file:///workspace/my-project'
    },
  })

  const state = createDefaultState()
  const result = await HandleClickCreateProject.handleClickCreateProject(state)

  expect(mockRpc.invocations).toEqual([['FilePicker.showDirectoryPicker']])
  expect(result.projects).toHaveLength(2)
  expect(result.projects[1]).toEqual({
    id: 'project-2',
    name: 'my-project',
    uri: 'file:///workspace/my-project',
  })
  expect(result.selectedProjectId).toBe('project-2')
  expect(result.selectedSessionId).toBe('')
  expect(result.viewMode).toBe('list')
})

test('handleClickCreateProject should keep state when folder picker is cancelled', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FilePicker.showDirectoryPicker': async () => {
      throw new Error('cancelled')
    },
  })

  const state = createDefaultState()
  const result = await HandleClickCreateProject.handleClickCreateProject(state)

  expect(mockRpc.invocations).toEqual([['FilePicker.showDirectoryPicker']])
  expect(result).toBe(state)
})

test('handleClickCreateProject should select existing project when uri already exists', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'FilePicker.showDirectoryPicker': async () => {
      return 'file:///workspace/existing'
    },
  })

  const state = {
    ...createDefaultState(),
    projects: [
      { id: 'project-1', name: '_blank', uri: '' },
      { id: 'project-2', name: 'existing', uri: 'file:///workspace/existing' },
    ],
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
  }

  const result = await HandleClickCreateProject.handleClickCreateProject(state)

  expect(mockRpc.invocations).toEqual([['FilePicker.showDirectoryPicker']])
  expect(result.projects).toHaveLength(2)
  expect(result.selectedProjectId).toBe('project-2')
  expect(result.selectedSessionId).toBe('')
  expect(result.viewMode).toBe('list')
})
