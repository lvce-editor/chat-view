import type { ChatState } from '../ChatState/ChatState.ts'
import * as ClipBoardWorker from '../ClipBoardWorker/ClipBoardWorker.ts'

export const copyInput = async (state: ChatState): Promise<ChatState> => {
  const { composerValue } = state
  await ClipBoardWorker.writeText(composerValue)
  return state
}
