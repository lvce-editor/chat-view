import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as ClearInput from '../ClearInput/ClearInput.ts'
import { getSelectedComposerValue } from '../GetSelectedComposerValue/GetSelectedComposerValue.ts'

export const cutInput = async (state: ChatState): Promise<ChatState> => {
  await ClipBoardWorker.writeText(getSelectedComposerValue(state))
  return ClearInput.clearInput(state)
}
