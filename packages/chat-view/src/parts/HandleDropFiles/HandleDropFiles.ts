import type { ChatState } from '../ChatState/ChatState.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleDropFiles = async (state: ChatState, name: string, files: readonly File[] = []): Promise<ChatState> => {
  if (name !== InputName.ComposerDropTarget) {
    return state
  }
  const nextState =
    state.composerDropActive === false
      ? state
      : {
          ...state,
          composerDropActive: false,
        }
  if (!state.selectedSessionId || files.length === 0) {
    return nextState
  }
  for (const file of files) {
    await appendChatViewEvent({
      attachmentId: crypto.randomUUID(),
      blob: file,
      mimeType: file.type,
      name: file.name,
      sessionId: state.selectedSessionId,
      size: file.size,
      timestamp: new Date().toISOString(),
      type: 'chat-attachment-added',
    })
  }
  return nextState
}
