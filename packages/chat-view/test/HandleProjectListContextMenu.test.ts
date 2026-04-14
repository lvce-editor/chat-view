import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { MenuChatProjectList } from '../src/parts/GetMenuEntryIds/GetMenuEntryIds.ts'
import * as HandleProjectListContextMenu from '../src/parts/HandleProjectListContextMenu/HandleProjectListContextMenu.ts'

test('handleProjectListContextMenu should invoke ContextMenu.show2 with the clicked project id', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    uid: 7,
  }
  const result = await HandleProjectListContextMenu.handleProjectListContextMenu(state, 0, 100, 60)

  expect(mockRpc.invocations).toEqual([
    ['ContextMenu.show2', 7, MenuChatProjectList, 100, 60, { canRemoveProject: false, menuId: MenuChatProjectList, projectId: 'project-1' }],
  ])
  expect(result).toBe(state)
})

test('handleProjectListContextMenu should map session rows to their parent project', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    uid: 7,
  }
  await HandleProjectListContextMenu.handleProjectListContextMenu(state, 0, 100, 100)

  expect(mockRpc.invocations).toEqual([
    ['ContextMenu.show2', 7, MenuChatProjectList, 100, 100, { canRemoveProject: false, menuId: MenuChatProjectList, projectId: 'project-1' }],
  ])
})

test.skip('handleProjectListContextMenu should allow removal for non-blank projects', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'ContextMenu.show2': async () => {},
  })

  const state = {
    ...createDefaultState(),
    projectExpandedIds: [],
    projects: [
      { id: 'project-1', name: '_blank', uri: '' },
      { id: 'project-2', name: 'workspace', uri: 'file:///workspace' },
    ],
    uid: 7,
  }
  await HandleProjectListContextMenu.handleProjectListContextMenu(state, 0, 100, 100)

  expect(mockRpc.invocations).toEqual([
    ['ContextMenu.show2', 7, MenuChatProjectList, 100, 100, { canRemoveProject: true, menuId: MenuChatProjectList, projectId: 'project-2' }],
  ])
})
