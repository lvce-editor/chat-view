import type { ChatState } from '../ChatState/ChatState.ts'
import * as ClipBoardWorker from '../ClipBoardWorker/ClipBoardWorker.ts'

export const copyInput = async (state: ChatState): Promise<ChatState> => {
  await ClipBoardWorker.writeText(state.composerValue)
  return state
}
