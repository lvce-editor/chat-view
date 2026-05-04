import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  await ChatViewModelWorker.invoke('ChatModel.handleSubmit', state)
  return state
}
