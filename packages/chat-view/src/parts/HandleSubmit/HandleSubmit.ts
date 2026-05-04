import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  return ChatViewModelWorker.invoke('ChatModel.handleSubmit', state) as Promise<ChatState>
}
