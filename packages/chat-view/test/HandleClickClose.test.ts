import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickClose from '../src/parts/HandleClickClose/HandleClickClose.ts'

test('handleClickClose should invoke Chat.terminate', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Chat.terminate': async () => {},
  })

  await HandleClickClose.handleClickClose()

  expect(mockRpc.invocations).toEqual([['Chat.terminate']])
})
