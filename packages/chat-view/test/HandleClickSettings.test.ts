import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickSettings from '../src/parts/HandleClickSettings/HandleClickSettings.ts'

test('handleClickSettings should resolve', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })

  await HandleClickSettings.handleClickSettings()

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'app://settings.json']])
})
