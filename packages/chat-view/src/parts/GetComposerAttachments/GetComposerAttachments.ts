import type { ChatAttachmentAddedEvent, ChatAttachmentRemovedEvent, ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { getChatViewEvents } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachmentDisplayType } from '../GetComposerAttachmentDisplayType/GetComposerAttachmentDisplayType.ts'

const isChatAttachmentAddedEvent = (event: ChatViewEvent): event is ChatAttachmentAddedEvent => {
  return event.type === 'chat-attachment-added'
}

const isChatAttachmentRemovedEvent = (event: ChatViewEvent): event is ChatAttachmentRemovedEvent => {
  return event.type === 'chat-attachment-removed'
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
    attachments.set(event.attachmentId, {
      attachmentId: event.attachmentId,
      displayType: await getComposerAttachmentDisplayType(event.blob, event.name, event.mimeType),
      mimeType: event.mimeType,
      name: event.name,
      size: event.size,
    })
  }
  return [...attachments.values()]
}
