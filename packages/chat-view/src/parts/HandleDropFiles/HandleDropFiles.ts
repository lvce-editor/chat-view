import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { ChatState } from '../ChatState/ChatState.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { appendChatViewEvent } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachmentDisplayType } from '../GetComposerAttachmentDisplayType/GetComposerAttachmentDisplayType.ts'
import { getComposerAttachmentPreviewSrc } from '../GetComposerAttachmentPreviewSrc/GetComposerAttachmentPreviewSrc.ts'
import { getComposerAttachmentsHeight } from '../GetComposerAttachmentsHeight/GetComposerAttachmentsHeight.ts'
import { getComposerAttachmentTextContent } from '../GetComposerAttachmentTextContent/GetComposerAttachmentTextContent.ts'
import { getDroppedFiles } from '../GetDroppedFiles/GetDroppedFiles.ts'
import * as InputName from '../InputName/InputName.ts'

export const handleDropFiles = async (state: ChatState, name: string, dropIdOrFileHandles: number | readonly number[] = []): Promise<ChatState> => {
  const isDropSession = typeof dropIdOrFileHandles === 'number'
  const legacyDroppedFileHandles = isDropSession ? undefined : await getDroppedFiles(dropIdOrFileHandles)
  const { composerDropActive, composerDropEnabled, nextAttachmentId, selectedSessionId, width } = state
  if (name !== InputName.ComposerDropTarget) {
    if (isDropSession) {
      await DragAndDropWorker.discardDrop(dropIdOrFileHandles)
    }
    return state
  }
  if (!composerDropEnabled) {
    if (isDropSession) {
      await DragAndDropWorker.discardDrop(dropIdOrFileHandles)
    }
    return {
      ...state,
      composerDropActive: false,
    }
  }
  const nextState = composerDropActive
    ? {
        ...state,
        composerDropActive: false,
      }
    : state
  if (!selectedSessionId || (!isDropSession && dropIdOrFileHandles.length === 0)) {
    if (isDropSession) {
      await DragAndDropWorker.discardDrop(dropIdOrFileHandles)
    }
    return nextState
  }
  const droppedFileHandles = legacyDroppedFileHandles || (await getDroppedFiles(dropIdOrFileHandles))
  const nextAttachments: ComposerAttachment[] = []
  for (const droppedFileHandle of droppedFileHandles) {
    const file = await droppedFileHandle.getFile()
    const attachmentId = `attachment-${nextAttachmentId + nextAttachments.length}`
    const displayType = await getComposerAttachmentDisplayType(file, file.name, file.type)
    const [previewSrc, textContent] = await Promise.all([
      getComposerAttachmentPreviewSrc(file, displayType, file.type),
      getComposerAttachmentTextContent(file, displayType),
    ])
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
      ...(previewSrc && {
        previewSrc,
      }),
      size: file.size,
      ...(typeof textContent === 'string' && {
        textContent,
      }),
    })
  }
  return {
    ...nextState,
    composerAttachments: [...nextState.composerAttachments, ...nextAttachments],
    composerAttachmentsHeight: getComposerAttachmentsHeight([...nextState.composerAttachments, ...nextAttachments], width),
    nextAttachmentId: nextAttachmentId + nextAttachments.length,
  }
}
