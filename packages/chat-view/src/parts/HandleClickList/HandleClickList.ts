import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleClickList = async (state: ChatState, eventX: number, eventY: number): Promise<ChatState> => {
  ;(await ChatViewModelWorker.invoke('ChatModel.handleClickList', state, eventX, eventY)) as ChatState
  return state
}
