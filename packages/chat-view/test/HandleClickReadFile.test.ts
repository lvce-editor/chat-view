import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickFileName from '../src/parts/HandleClickFileName/HandleClickFileName.ts'
import * as HandleClickReadFile from '../src/parts/HandleClickReadFile/HandleClickReadFile.ts'

test('handleClickReadFile should open uri', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })

  await HandleClickReadFile.handleClickReadFile('file:///workspace/src/main.ts')

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'file:///workspace/src/main.ts']])
})

test('handleClickReadFile should do nothing for empty uri', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })

  await HandleClickReadFile.handleClickReadFile('')

  expect(mockRpc.invocations).toEqual([])
})

test('handleClickReadFile should normalize vscode-references uri before opening', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })

  await HandleClickReadFile.handleClickReadFile('vscode-references:///workspace/src/main.ts')

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'file:///workspace/src/main.ts']])
})

test('handleClickFileName should open uri', async () => {
  const mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })

  await HandleClickFileName.handleClickFileName('file:///workspace/src/main.ts')

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'file:///workspace/src/main.ts']])
})
