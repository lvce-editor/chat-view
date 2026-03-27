import type { ChatState } from '../ChatState/ChatState.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleDragEnter = async (state: ChatState, name: string, hasFiles = true): Promise<ChatState> => {
  const { composerDropActive, composerDropEnabled } = state
  if (name !== InputName.ComposerDropTarget) {
    return state
  }
  if (!composerDropEnabled) {
    return state
  }
  if (!hasFiles) {
    return state
  }
  if (composerDropActive) {
    return state
  }
  return {
    ...state,
    composerDropActive: true,
  }
}
