import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import { measureTextBlockHeight } from '../src/parts/MeasureTextBlockHeight/MeasureTextBlockHeight.ts'

test('measureTextBlockHeight should forward line height as px string to renderer worker', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'MeasureTextHeight.measureTextBlockHeight': async () => 44,
  })

  const result = await measureTextBlockHeight('hello', 'system-ui', 13, '20px', 320)

  expect(result).toBe(44)
  expect(mockRpc.invocations).toEqual([['MeasureTextHeight.measureTextBlockHeight', 'hello', 'system-ui', 13, '20px', 320]])
})
