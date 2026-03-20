import type { ChatState } from '../ChatState/ChatState.ts'
import * as ClearInput from '../ClearInput/ClearInput.ts'
import * as ClipBoardWorker from '../ClipBoardWorker/ClipBoardWorker.ts'

export const cutInput = async (state: ChatState): Promise<ChatState> => {
  await ClipBoardWorker.writeText(state.composerValue)
  return ClearInput.clearInput(state)
}
