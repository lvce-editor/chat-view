import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClickFileName from '../src/parts/HandleClickFileName/HandleClickFileName.ts'
import * as HandleClickReadFile from '../src/parts/HandleClickReadFile/HandleClickReadFile.ts'

test('handleClickReadFile should open uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state = createDefaultState()

  const result = await HandleClickReadFile.handleClickReadFile(state, 'file:///workspace/src/main.ts')

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'file:///workspace/src/main.ts']])
  expect(result).toBe(state)
})

test('handleClickReadFile should do nothing for empty uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state = createDefaultState()

  const result = await HandleClickReadFile.handleClickReadFile(state, '')

  expect(mockRpc.invocations).toEqual([])
  expect(result).toBe(state)
})

test('handleClickReadFile should normalize vscode-references uri before opening', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state = createDefaultState()

  const result = await HandleClickReadFile.handleClickReadFile(state, 'vscode-references:///workspace/src/main.ts')

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'file:///workspace/src/main.ts']])
  expect(result).toBe(state)
})

test('handleClickFileName should open uri', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })
  const state = createDefaultState()

  const result = await HandleClickFileName.handleClickFileName(state, 'file:///workspace/src/main.ts')

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'file:///workspace/src/main.ts']])
  expect(result).toBe(state)
})
