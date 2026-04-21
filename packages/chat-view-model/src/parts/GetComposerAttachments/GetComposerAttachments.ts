import type { ChatAttachmentAddedEvent, ChatAttachmentRemovedEvent, ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import { getChatViewEvents } from '../ChatSessionStorage/ChatSessionStorage.ts'
import type { ComposerAttachment, ComposerAttachmentDisplayType } from '../ViewModel/ViewModel.ts'

const isChatAttachmentAddedEvent = (event: ChatViewEvent): event is ChatAttachmentAddedEvent => {
  return event.type === 'chat-attachment-added'
}

const isChatAttachmentRemovedEvent = (event: ChatViewEvent): event is ChatAttachmentRemovedEvent => {
  return event.type === 'chat-attachment-removed'
}

const isImageFile = (mimeType: string): boolean => {
  return mimeType.startsWith('image/')
}

const textFileRegex = /\.txt$/i

const isTextFile = (name: string, mimeType: string): boolean => {
  return mimeType === 'text/plain' || textFileRegex.test(name)
}

const isValidImage = async (blob: Blob, mimeType: string): Promise<boolean> => {
  if (mimeType.startsWith('image/') && mimeType !== 'image/png' && mimeType !== 'image/jpeg') {
    return true
  }
  if (typeof createImageBitmap !== 'function') {
    return true
  }
  try {
    const imageBitmap = await createImageBitmap(blob)
    imageBitmap.close()
    return true
  } catch {
    return false
  }
}

const getComposerAttachmentDisplayType = async (blob: Blob, name: string, mimeType: string): Promise<ComposerAttachmentDisplayType> => {
  if (isImageFile(mimeType)) {
    return (await isValidImage(blob, mimeType)) ? 'image' : 'invalid-image'
  }
  if (isTextFile(name, mimeType)) {
    return 'text-file'
  }
  return 'file'
}

const chunkSize = 0x80_00

const getBlobBase64 = async (blob: Blob): Promise<string> => {
  const bytes = new Uint8Array(await blob.arrayBuffer())
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64')
  }
  let binary = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCodePoint(...bytes.subarray(i, i + chunkSize))
  }
  return btoa(binary)
}

const getComposerAttachmentPreviewSrc = async (
  blob: Blob,
  displayType: ComposerAttachmentDisplayType,
  mimeType: string,
): Promise<string | undefined> => {
  if (displayType !== 'image') {
    return undefined
  }
  const base64 = await getBlobBase64(blob)
  return `data:${mimeType || 'application/octet-stream'};base64,${base64}`
}

const getComposerAttachmentTextContent = async (
  blob: Blob,
  displayType: ComposerAttachmentDisplayType,
): Promise<string | undefined> => {
  if (displayType !== 'text-file') {
    return undefined
  }
  return blob.text()
}

export const getComposerAttachments = async (sessionId: string): Promise<readonly ComposerAttachment[]> => {
  if (!sessionId) {
    return []
  }
  const events = await getChatViewEvents(sessionId)
  const attachments = new Map<string, ComposerAttachment>()
  for (const event of events) {
    if (isChatAttachmentRemovedEvent(event)) {
      attachments.delete(event.attachmentId)
      continue
    }
    if (!isChatAttachmentAddedEvent(event)) {
      continue
    }
    const displayType = await getComposerAttachmentDisplayType(event.blob, event.name, event.mimeType)
    const [previewSrc, textContent] = await Promise.all([
      getComposerAttachmentPreviewSrc(event.blob, displayType, event.mimeType),
      getComposerAttachmentTextContent(event.blob, displayType),
    ])
    attachments.set(event.attachmentId, {
      attachmentId: event.attachmentId,
      displayType,
      mimeType: event.mimeType,
      name: event.name,
      ...(previewSrc
        ? {
            previewSrc,
          }
        : {}),
      size: event.size,
      ...(typeof textContent === 'string'
        ? {
            textContent,
          }
        : {}),
    })
  }
  return [...attachments.values()]
}