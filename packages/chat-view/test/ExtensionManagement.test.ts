import { expect, test } from '@jest/globals'
import { ExtensionManagementWorker } from '@lvce-editor/rpc-registry'
import * as ExtensionManagement from '../src/parts/ExtensionManagement/ExtensionManagement.ts'

test('executeCommand should invoke the extension management worker', async () => {
  using mockRpc = ExtensionManagementWorker.registerMockRpc({
    'Extensions.executeCommand': async () => 'test-result',
  })

  const result = await ExtensionManagement.executeCommand('test.command', 'param1', 'param2')

  expect(mockRpc.invocations).toEqual([['Extensions.executeCommand', 'test.command', 'param1', 'param2']])
  expect(result).toBe('test-result')
})
