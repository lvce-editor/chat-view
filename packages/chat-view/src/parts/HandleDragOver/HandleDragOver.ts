import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleDragOver = async (state: ChatState, name: string, hasFiles = true): Promise<ChatState> => {
  if (name !== InputName.ComposerDropTarget) {
    return state
  }
  if (!state.composerDropEnabled) {
    return state
  }
  if (!hasFiles) {
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
