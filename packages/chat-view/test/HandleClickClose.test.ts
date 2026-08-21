import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickClose from '../src/parts/HandleClickClose/HandleClickClose.ts'

test('handleClickClose should invoke Layout.hideSecondarySideBar', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Layout.hideSecondarySideBar': async () => {},
  })

  await HandleClickClose.handleClickClose()

  expect(mockRpc.invocations).toEqual([['Layout.hideSecondarySideBar']])
})
