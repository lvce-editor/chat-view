import { expect, test } from '@jest/globals'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandlePointerDownProjectSidebarSash from '../src/parts/HandlePointerDownProjectSidebarSash/HandlePointerDownProjectSidebarSash.ts'
import * as HandlePointerMoveProjectSidebarSash from '../src/parts/HandlePointerMoveProjectSidebarSash/HandlePointerMoveProjectSidebarSash.ts'
import * as HandlePointerUpProjectSidebarSash from '../src/parts/HandlePointerUpProjectSidebarSash/HandlePointerUpProjectSidebarSash.ts'

test('handlePointerDownProjectSidebarSash should enable resizing', async () => {
  const state = createDefaultState()
  const result = await HandlePointerDownProjectSidebarSash.handlePointerDownProjectSidebarSash(state)
  expect(result.projectSidebarResizing).toBe(true)
})

test('handlePointerMoveProjectSidebarSash should update width while resizing', async () => {
  const state = {
    ...createDefaultState(),
    projectSidebarResizing: true,
    width: 900,
    x: 20,
  }
  const result = await HandlePointerMoveProjectSidebarSash.handlePointerMoveProjectSidebarSash(state, 260)
  expect(result.projectSidebarWidth).toBe(240)
})

test('handlePointerMoveProjectSidebarSash should clamp width', async () => {
  const state = {
    ...createDefaultState(),
    projectSidebarResizing: true,
    width: 520,
    x: 0,
  }
  const result = await HandlePointerMoveProjectSidebarSash.handlePointerMoveProjectSidebarSash(state, 400)
  expect(result.projectSidebarWidth).toBe(200)
})

test('handlePointerUpProjectSidebarSash should update width and disable resizing', async () => {
  const state = {
    ...createDefaultState(),
    projectSidebarResizing: true,
    width: 960,
    x: 0,
  }
  const result = await HandlePointerUpProjectSidebarSash.handlePointerUpProjectSidebarSash(state, 320)
  expect(result.projectSidebarWidth).toBe(320)
  expect(result.projectSidebarResizing).toBe(false)
})
