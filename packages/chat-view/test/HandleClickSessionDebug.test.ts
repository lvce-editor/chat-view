import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as HandleClickSessionDebug from '../src/parts/HandleClickSessionDebug/HandleClickSessionDebug.ts'

test('handleClickSessionDebug should open chat debug uri for selected session', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Main.openUri': async () => {},
  })

  const state = {
    ...createDefaultState(),
    selectedSessionId: 'session-1',
  }

  const result = await HandleClickSessionDebug.handleClickSessionDebug(state)

  expect(mockRpc.invocations).toEqual([['Main.openUri', 'chat-debug://session-1']])
  expect(result).toBe(state)
})
