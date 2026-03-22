import { ClipBoardWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as InputName from '../InputName/InputName.ts'

export const pasteInput = async (state: ChatState): Promise<ChatState> => {
  const text = await ClipBoardWorker.readText()
  return HandleInput.handleInput(state, InputName.Composer, text, 'script')
}
