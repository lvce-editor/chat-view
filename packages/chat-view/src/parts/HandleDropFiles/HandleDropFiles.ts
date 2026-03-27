import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'
import type { ChatState } from '../ChatState/ChatState.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { getComposerAttachmentDisplayType } from '../GetComposerAttachmentDisplayType/GetComposerAttachmentDisplayType.ts'
import { getComposerAttachmentPreviewSrc } from '../GetComposerAttachmentPreviewSrc/GetComposerAttachmentPreviewSrc.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getDroppedFiles } from '../GetDroppedFiles/GetDroppedFiles.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleDropFiles = async (state: ChatState, name: string, fileHandles: readonly number[] = []): Promise<ChatState> => {
  const actualFiles = await getDroppedFiles(fileHandles)
  console.log({ actualFiles })
  console.log('files dropped', name, fileHandles)
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
  if (!state.selectedSessionId || fileHandles.length === 0) {
    return nextState
  }
  const nextAttachments: ComposerAttachment[] = []
  for (const file of actualFiles) {
    const attachmentId = crypto.randomUUID()
    const displayType = await getComposerAttachmentDisplayType(file, file.name, file.type)
    const previewSrc = await getComposerAttachmentPreviewSrc(file, displayType, file.type)
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
      displayType,
      mimeType: file.type,
      name: file.name,
      ...(previewSrc
        ? {
            previewSrc,
          }
        : {}),
      size: file.size,
    })
  }
  return {
    ...nextState,
    composerAttachments: [...nextState.composerAttachments, ...nextAttachments],
    composerAttachmentsHeight: getComposerAttachmentsHeight([...nextState.composerAttachments, ...nextAttachments], state.width),
  }
}
