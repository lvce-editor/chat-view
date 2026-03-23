import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'

export const copyInput = async (state: ChatState): Promise<ChatState> => {
  const { composerValue } = state
  await ClipBoardWorker.writeText(composerValue)
  return state
}
