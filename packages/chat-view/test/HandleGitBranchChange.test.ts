import { expect, test } from '@jest/globals'
import { ExtensionHost, RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleGitBranchChange from '../src/parts/HandleGitBranchChange/HandleGitBranchChange.ts'
import { registerMockChatStorageRpc } from '../src/parts/TestHelpers/RegisterMockChatStorageRpc.ts'

test('handleGitBranchChange should update the selected session branch on success', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostCommand.executeCommand': async () => {},
  })

  const state = {
    ...createDefaultState(),
    assetDir: '/assets',
    gitBranches: [
      { current: true, name: 'main' },
      { current: false, name: 'feature' },
    ],
    gitBranchPickerOpen: true,
    projects: [{ id: 'project-1', name: 'Workspace', uri: 'file:///workspace' }],
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ branchName: 'main', id: 'session-1', messages: [], projectId: 'project-1', title: 'Chat 1' }],
  }

  const result = await HandleGitBranchChange.handleGitBranchChange(state, 'feature')

  expect(result.gitBranchPickerOpen).toBe(false)
  expect(result.gitBranchPickerErrorMessage).toBe('')
  expect(result.sessions[0].branchName).toBe('feature')
  expect(result.gitBranches).toEqual([
    { current: false, name: 'main' },
    { current: true, name: 'feature' },
  ])
  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', 'onCommand:Chat.switchGitBranch', '/assets', state.platform],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([
    ['ExtensionHostCommand.executeCommand', 'Chat.switchGitBranch', { branchName: 'feature', workspaceUri: 'file:///workspace' }],
  ])
})

test('handleGitBranchChange should keep the picker open and show an error when switching fails', async () => {
  using mockChatStorageRpc = registerMockChatStorageRpc()
  expect(mockChatStorageRpc).toBeDefined()
  using mockRendererRpc = RendererWorker.registerMockRpc({
    'ExtensionHostManagement.activateByEvent': async () => {},
  })
  using mockExtensionHostRpc = ExtensionHost.registerMockRpc({
    'ExtensionHostCommand.executeCommand': async () => {
      throw new Error('No git branch switch command found')
    },
  })

  const state = {
    ...createDefaultState(),
    assetDir: '/assets',
    gitBranches: [
      { current: true, name: 'main' },
      { current: false, name: 'feature' },
    ],
    gitBranchPickerOpen: true,
    projects: [{ id: 'project-1', name: 'Workspace', uri: 'file:///workspace' }],
    selectedProjectId: 'project-1',
    selectedSessionId: 'session-1',
    sessions: [{ branchName: 'main', id: 'session-1', messages: [], projectId: 'project-1', title: 'Chat 1' }],
  }

  const result = await HandleGitBranchChange.handleGitBranchChange(state, 'feature')

  expect(result.gitBranchPickerOpen).toBe(true)
  expect(result.sessions[0].branchName).toBe('main')
  expect(result.gitBranchPickerErrorMessage).toBe('Failed to switch to branch "feature". No git branch switch command found')
  expect(mockRendererRpc.invocations).toEqual([
    ['ExtensionHostManagement.activateByEvent', 'onCommand:Chat.switchGitBranch', '/assets', state.platform],
  ])
  expect(mockExtensionHostRpc.invocations).toEqual([
    ['ExtensionHostCommand.executeCommand', 'Chat.switchGitBranch', { branchName: 'feature', workspaceUri: 'file:///workspace' }],
  ])
})
