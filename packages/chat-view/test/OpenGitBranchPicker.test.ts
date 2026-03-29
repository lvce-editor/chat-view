import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as OpenGitBranchPicker from '../src/parts/OpenGitBranchPicker/OpenGitBranchPicker.ts'

const workspaceUri = 'file:///workspace'
test('openGitBranchPicker should load branches and open the picker', async () => {
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'FileSystem.readDirWithFileTypes': async (uri: string) => {
      switch (uri) {
        case '.git/refs':
          return [['heads', 2]]
        case '.git/refs/heads':
          return [
            ['feature', 1],
            ['main', 1],
          ]
        default:
          return []
      }
    },
    'FileSystem.readFile': async (uri: string) => {
      if (uri === '.git/HEAD') {
        return 'ref: refs/heads/main\n'
      }
      return ''
    },
  })

  const state = {
    ...createDefaultState(),
    agentModePickerOpen: true,
    modelPickerOpen: true,
    projects: [{ id: 'project-1', name: 'Workspace', uri: workspaceUri }],
    reasoningEffortPickerOpen: true,
    runModePickerOpen: true,
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ id: 'session-1', messages: [], projectId: 'project-1', title: 'Chat 1' }],
    viewMode: 'chat-focus' as const,
  }

  const result = await OpenGitBranchPicker.openGitBranchPicker(state)

  expect(result.gitBranchPickerOpen).toBe(true)
  expect(result.gitBranchPickerErrorMessage).toBe('')
  expect(result.gitBranches).toEqual([
    { current: false, name: 'feature' },
    { current: true, name: 'main' },
  ])
  expect(result.agentModePickerOpen).toBe(false)
  expect(result.modelPickerOpen).toBe(false)
  expect(result.reasoningEffortPickerOpen).toBe(false)
  expect(result.runModePickerOpen).toBe(false)
  expect(mockRendererRpc.invocations).toContainEqual(['FileSystem.readFile', '.git/HEAD'])
})
