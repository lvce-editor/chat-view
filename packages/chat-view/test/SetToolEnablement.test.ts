import { expect, test } from '@jest/globals'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import * as CreateDefaultState from '../src/parts/CreateDefaultState/CreateDefaultState.ts'
import * as SetToolEnablement from '../src/parts/SetToolEnablement/SetToolEnablement.ts'

test('setToolEnablement should update state and persist by default', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetToolEnablement.setToolEnablement(state, {
    read_file: false,
    write_file: true,
  })
  expect(result.toolEnablement).toEqual({
    read_file: false,
    write_file: true,
  })
  expect(mockRpc.invocations).toEqual([
    [
      'Preferences.update',
      {
        'chat.toolEnablement': {
          read_file: false,
          write_file: true,
        },
      },
    ],
  ])
})

test('setToolEnablement should not persist when persist is false', async () => {
  using mockRpc = RendererWorker.registerMockRpc({
    'Preferences.update': async () => {},
  })
  const state = CreateDefaultState.createDefaultState()
  const result = await SetToolEnablement.setToolEnablement(state, { read_file: false }, false)
  expect(result.toolEnablement).toEqual({
    read_file: false,
  })
  expect(mockRpc.invocations).toEqual([])
})

test('setToolEnablement should reject non-boolean values', async () => {
  const state = CreateDefaultState.createDefaultState()
  await expect(SetToolEnablement.setToolEnablement(state, { read_file: 'nope' })).rejects.toThrow(
    'Tool enablement for "read_file" must be a boolean.',
  )
})
