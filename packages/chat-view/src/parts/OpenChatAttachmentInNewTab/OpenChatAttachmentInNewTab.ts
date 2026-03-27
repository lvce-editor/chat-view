import { OpenerWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const openChatAttachmentInNewTab = async (state: ChatState, previewSrc: string): Promise<ChatState> => {
  if (!previewSrc) {
    return state
  }
  await OpenerWorker.openExternal(previewSrc)
  return state
}
