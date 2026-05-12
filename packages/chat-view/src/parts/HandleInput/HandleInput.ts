import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const handleInput = async (state: ChatState, name: string, value: string, inputSource: 'user' | 'script' = 'user'): Promise<ChatState> => {
  return (await ChatViewModelWorker.invoke('ChatModel.handleInput', state, name, value, inputSource)) as ChatState
}
