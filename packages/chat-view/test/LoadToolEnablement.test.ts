import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as LoadToolEnablement from '../src/parts/LoadToolEnablement/LoadToolEnablement.ts'

test('loadToolEnablement should return stored tool enablement object', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async (key: string) => {
      if (key === 'chat.toolEnablement') {
        return {
          read_file: true,
          write_file: false,
        }
      }
      return undefined
    },
  })

  const result = await LoadToolEnablement.loadToolEnablement()
  expect(result).toEqual({
    read_file: true,
    write_file: false,
  })
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.toolEnablement']])
})

test('loadToolEnablement should ignore non-boolean values', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => ({
      read_file: true,
      write_file: 'false',
    }),
  })

  const result = await LoadToolEnablement.loadToolEnablement()
  expect(result).toEqual({
    read_file: true,
  })
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.toolEnablement']])
})

test('loadToolEnablement should return empty object on preference read error', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.get': async () => {
      throw new Error('failed')
    },
  })

  const result = await LoadToolEnablement.loadToolEnablement()
  expect(result).toEqual({})
  expect(mockRpc.invocations).toEqual([['Preferences.get', 'chat.toolEnablement']])
})
