import { createMockRpc } from '@lvce-editor/rpc'
import { QuickPickWorker } from '@lvce-editor/rpc-registry'

type MockCommand = (...args: readonly unknown[]) => unknown

type MockQuickPickRpc = ReturnType<typeof createMockRpc> & {
  [Symbol.dispose](): void
}

export const registerMockQuickPickRpc = (commandMap: Readonly<Record<string, MockCommand>>): MockQuickPickRpc => {
  const mockRpc = Object.assign(createMockRpc({ commandMap }), {
    [Symbol.dispose](): void {
      QuickPickWorker.set(createMockRpc({ commandMap: {} }))
    },
  })
  QuickPickWorker.set(mockRpc)
  return mockRpc
}
