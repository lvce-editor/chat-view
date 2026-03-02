import type { ChatState } from '../ChatState/ChatState.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleNewline = async (state: ChatState): Promise<ChatState> => {
  return HandleInput.handleInput(state, InputName.Composer, `${state.composerValue}\n`)
}
