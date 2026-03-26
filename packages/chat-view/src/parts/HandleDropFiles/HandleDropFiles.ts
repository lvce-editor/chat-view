import type { ChatState } from '../ChatState/ChatState.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachmentDisplayType } from '../GetComposerAttachmentDisplayType/GetComposerAttachmentDisplayType.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleDropFiles = async (state: ChatState, name: string, files: readonly File[] = []): Promise<ChatState> => {
  if (name !== InputName.ComposerDropTarget) {
    return state
  }
  if (!state.composerDropEnabled) {
    return {
      ...state,
      composerDropActive: false,
    }
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
  const nextAttachments: ComposerAttachment[] = []
  for (const file of files) {
    const attachmentId = crypto.randomUUID()
    await appendChatViewEvent({
      attachmentId,
      blob: file,
      mimeType: file.type,
      name: file.name,
      sessionId: state.selectedSessionId,
      size: file.size,
      timestamp: new Date().toISOString(),
      type: 'chat-attachment-added',
    })
    nextAttachments.push({
      attachmentId,
      displayType: await getComposerAttachmentDisplayType(file, file.name, file.type),
      mimeType: file.type,
      name: file.name,
      size: file.size,
    })
  }
  return {
    ...nextState,
    composerAttachments: [...nextState.composerAttachments, ...nextAttachments],
  }
}
