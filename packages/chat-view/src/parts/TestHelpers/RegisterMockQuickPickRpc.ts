import { QuickPickWorker } from '@lvce-editor/rpc-registry'
import { createMockRpc } from '@lvce-editor/rpc'

type MockCommand = (...args: readonly unknown[]) => unknown

interface MockQuickPickRpc {
  readonly invocations: readonly (readonly unknown[])[]
  [Symbol.dispose](): void
}

export const registerMockQuickPickRpc = (commandMap: Record<string, MockCommand>): MockQuickPickRpc => {
  const mockRpc = createMockRpc({ commandMap }) as MockQuickPickRpc
  QuickPickWorker.set(mockRpc)
  mockRpc[Symbol.dispose] = () => {
    QuickPickWorker.set(createMockRpc({ commandMap: {} }))
  }
  return mockRpc
}
