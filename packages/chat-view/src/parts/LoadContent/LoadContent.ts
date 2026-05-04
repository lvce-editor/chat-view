import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
export const loadContent = async (state: ChatState, savedState: unknown): Promise<ChatState> => {
  return ChatViewModelWorker.invoke('ChatModel.loadContent', state, savedState) as Promise<ChatState>
}
