import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const rerenderWithQuery = async (state: ChatState): Promise<ChatState> => {
  const newState = await ChatViewModelWorker.invoke('ChatModel.getState', state.uid)
  if (!newState) {
    return state
  }
  return {
    ...state,
    ...newState,
  }
}
