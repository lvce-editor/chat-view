import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import { getSelectedComposerValue } from '../GetSelectedComposerValue/GetSelectedComposerValue.ts'

export const copyInput = async (state: ChatState): Promise<ChatState> => {
  const text = getSelectedComposerValue(state)
  await ClipBoardWorker.writeText(text)
  return state
}
