import type { ChatState } from '../ChatState/ChatState.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachmentDisplayType } from '../GetComposerAttachmentDisplayType/GetComposerAttachmentDisplayType.ts'
import { getComposerAttachmentPreviewSrc } from '../GetComposerAttachmentPreviewSrc/GetComposerAttachmentPreviewSrc.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getDroppedFiles } from '../GetDroppedFiles/GetDroppedFiles.ts'
import * as InputName from '../InputName/InputName.ts'

<<<<<<< HEAD
export const handleDropFiles = async (state: ChatState, name: string, files: readonly File[] = []): Promise<ChatState> => {
  const { composerDropActive, composerDropEnabled, nextAttachmentId, selectedSessionId, width } = state
=======
export const handleDropFiles = async (state: ChatState, name: string, fileHandles: readonly number[] = []): Promise<ChatState> => {
  const droppedFileHandles = await getDroppedFiles(fileHandles)
  const { composerDropActive, composerDropEnabled, selectedSessionId, width } = state
>>>>>>> origin/main
  if (name !== InputName.ComposerDropTarget) {
    return state
  }
  if (!composerDropEnabled) {
    return {
      ...state,
      composerDropActive: false,
    }
  }
  const nextState =
    composerDropActive === false
      ? state
      : {
          ...state,
          composerDropActive: false,
        }
  if (!selectedSessionId || fileHandles.length === 0) {
    return nextState
  }
  const nextAttachments: ComposerAttachment[] = []
<<<<<<< HEAD
  for (const file of files) {
    const attachmentId = `attachment-${nextAttachmentId + nextAttachments.length}`
=======
  for (const droppedFileHandle of droppedFileHandles) {
    const file = await droppedFileHandle.getFile()
    const attachmentId = crypto.randomUUID()
>>>>>>> origin/main
    const displayType = await getComposerAttachmentDisplayType(file, file.name, file.type)
    const previewSrc = await getComposerAttachmentPreviewSrc(file, displayType, file.type)
    await appendChatViewEvent({
      attachmentId,
      blob: file,
      mimeType: file.type,
      name: file.name,
      sessionId: selectedSessionId,
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
    composerAttachmentsHeight: getComposerAttachmentsHeight([...nextState.composerAttachments, ...nextAttachments], width),
    nextAttachmentId: nextAttachmentId + nextAttachments.length,
  }
}
