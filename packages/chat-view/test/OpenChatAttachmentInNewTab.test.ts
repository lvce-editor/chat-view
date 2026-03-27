import { expect, test } from '@jest/globals'
import { OpenerWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as OpenChatAttachmentInNewTab from '../src/parts/OpenChatAttachmentInNewTab/OpenChatAttachmentInNewTab.ts'

test('openChatAttachmentInNewTab should delegate to opener worker', async () => {
  using mockRpc = OpenerWorker.registerMockRpc({
    'Open.openExternal': async () => {},
  })

  const state = createDefaultState()
  const result = await OpenChatAttachmentInNewTab.openChatAttachmentInNewTab(state, 'data:image/svg+xml;base64,abc')

  expect(mockRpc.invocations).toEqual([['Open.openExternal', 'data:image/svg+xml;base64,abc']])
  expect(result).toBe(state)
})
