import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickBack = async (state: ChatState): Promise<ChatState> => {
  ;(await ChatViewModelWorker.invoke('ChatModel.handleClickBack', state)) as ChatState
  return state
}
