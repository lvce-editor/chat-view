import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as HandleClickLink from '../src/parts/HandleClickLink/HandleClickLink.ts'

test('handleClickLink should open external href', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Open.openExternal': async () => {},
  })

  await HandleClickLink.handleClickLink('https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai')

  expect(mockRpc.invocations).toEqual([
    [
      'Open.openExternal',
      'https://www.metcheck.com/WEATHER/dayforecast.asp?dateFor=10%2F03%2F2026&lat=48.853410&location=Paris&locationID=654747&lon=2.348800&utm_source=openai',
    ],
  ])
})

test('handleClickLink should do nothing for empty href', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Open.openExternal': async () => {},
  })

  await HandleClickLink.handleClickLink('')

  expect(mockRpc.invocations).toEqual([])
})
