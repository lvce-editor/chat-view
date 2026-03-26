import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

const normalizeFileReferenceUri = (uri: string): string => {
  if (uri.startsWith('vscode-references://')) {
    return `file://${uri.slice('vscode-references://'.length)}`
  }
  return uri
}

export const handleClickFileName = async (state: ChatState, uri: string): Promise<ChatState> => {
  if (!uri) {
    return state
  }
  const normalizedUri = normalizeFileReferenceUri(uri)
  await RendererWorker.invoke('Main.openUri', normalizedUri)
  return state
}
