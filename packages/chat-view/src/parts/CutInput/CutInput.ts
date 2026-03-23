import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as ClearInput from '../ClearInput/ClearInput.ts'

export const cutInput = async (state: ChatState): Promise<ChatState> => {
  await ClipBoardWorker.writeText(state.composerValue)
  return ClearInput.clearInput(state)
}
