import { RendererWorker } from '@lvce-editor/rpc-registry'
import { toFileUri } from './toFileUri'

export const getWorkspaceUri = async (): Promise<string> => {
  const methodNames = ['Workspace.getWorkspaceUri', 'Workspace.getUri', 'Workspace.getPath']
  for (const methodName of methodNames) {
    try {
      const result = await RendererWorker.invoke(methodName)
      if (typeof result === 'string' && result) {
        const normalized = toFileUri(result)
        if (normalized) {
          return normalized
        }
      }
    } catch {
      // Try the next candidate method.
    }
  }
  throw new Error('Unable to determine current workspace URI')
}
