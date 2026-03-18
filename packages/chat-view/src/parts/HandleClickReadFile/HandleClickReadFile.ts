import { RendererWorker } from '@lvce-editor/rpc-registry'

const normalizeFileReferenceUri = (uri: string): string => {
  if (uri.startsWith('vscode-references://')) {
    return `file://${uri.slice('vscode-references://'.length)}`
  }
  return uri
}

export const handleClickReadFile = async (uri: string): Promise<void> => {
  if (!uri) {
    return
  }
  const normalizedUri = normalizeFileReferenceUri(uri)
  await RendererWorker.invoke('Main.openUri', normalizedUri)
}
