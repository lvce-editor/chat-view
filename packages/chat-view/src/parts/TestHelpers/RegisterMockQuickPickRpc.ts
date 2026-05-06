import { createMockRpc } from '@lvce-editor/rpc'
import { QuickPickWorker } from '@lvce-editor/rpc-registry'

type MockCommand = (...args: readonly unknown[]) => unknown

type MockQuickPickRpc = ReturnType<typeof createMockRpc> & {
  [Symbol.dispose](): void
}

export const registerMockQuickPickRpc = (commandMap: Readonly<Record<string, MockCommand>>): MockQuickPickRpc => {
  const mockRpc: MockQuickPickRpc = createMockRpc({ commandMap })
  QuickPickWorker.set(mockRpc)
  mockRpc[Symbol.dispose] = (): void => {
    QuickPickWorker.set(createMockRpc({ commandMap: {} }))
  }
  return mockRpc
}
