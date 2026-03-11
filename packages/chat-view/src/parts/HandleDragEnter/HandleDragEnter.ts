import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleDragEnter = async (state: ChatState, name: string): Promise<ChatState> => {
  if (name !== InputName.ComposerDropTarget) {
    return state
  }
  if (state.composerDropActive) {
    return state
  }
  return {
    ...state,
    composerDropActive: true,
  }
}
