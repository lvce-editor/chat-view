import type { ChatState } from '../ChatState/ChatState.ts'
import * as HandleInput from '../HandleInput/HandleInput.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleNewline = async (state: ChatState): Promise<ChatState> => {
  const { composerValue } = state
  return HandleInput.handleInput(state, InputName.Composer, `${composerValue}\n`, 'script')
}
