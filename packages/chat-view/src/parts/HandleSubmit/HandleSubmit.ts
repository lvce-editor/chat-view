import { ChatViewModelWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string' && error) {
    return error
  }
  if (error && typeof error === 'object') {
    const message = Reflect.get(error, 'message')
    if (typeof message === 'string' && message) {
      return message
    }
    const code = Reflect.get(error, 'code')
    if (typeof code === 'string' && code) {
      return code
    }
  }
  return String(error)
}

export const handleSubmit = async (state: ChatState): Promise<ChatState> => {
  try {
    return (await ChatViewModelWorker.invoke('ChatModel.handleSubmit', state)) as ChatState
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
