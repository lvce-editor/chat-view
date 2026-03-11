import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { createDefaultState } from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import { getComposerHeight } from '../src/parts/GetComposerHeight/GetComposerHeight.ts'

test('getComposerHeight should return composerLineHeight for empty value without invoking renderer worker', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'MeasureTextBlockHeight.measureTextBlockHeight': async () => 999,
  })
  const state = {
    ...createDefaultState(),
    composerLineHeight: 22,
  }

  const result = await getComposerHeight(state, '')

  expect(result).toBe(22)
  expect(mockRpc.invocations).toEqual([])
})
