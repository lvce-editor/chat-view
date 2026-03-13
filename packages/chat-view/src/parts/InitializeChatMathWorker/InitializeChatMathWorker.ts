import * as ChatMathWorker from '../ChatMathWorker/ChatMathWorker.ts'

export const initializeChatMathWorker = async (): Promise<void> => {
  await ChatMathWorker.initialize()
}
