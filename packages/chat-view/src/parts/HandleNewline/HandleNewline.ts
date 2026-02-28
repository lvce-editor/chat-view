import type { ChatState } from '../ChatState/ChatState.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'

export const handleNewline = async (state: ChatState): Promise<ChatState> => {
  return HandleInput.handleInput(state, `${state.composerValue}\n`)
}
