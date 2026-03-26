import type { ChatAttachmentAddedEvent, ChatViewEvent } from '../ChatViewEvent/ChatViewEvent.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { getChatViewEvents } from '../ChatSessionStorage/ChatSessionStorage.ts'
import { getComposerAttachmentDisplayType } from '../GetComposerAttachmentDisplayType/GetComposerAttachmentDisplayType.ts'

const isChatAttachmentAddedEvent = (event: ChatViewEvent): event is ChatAttachmentAddedEvent => {
  return event.type === 'chat-attachment-added'
}

export const getComposerAttachments = async (sessionId: string): Promise<readonly ComposerAttachment[]> => {
  if (!sessionId) {
    return []
  }
  const events = await getChatViewEvents(sessionId)
  const attachments: ComposerAttachment[] = []
  for (const event of events) {
    if (!isChatAttachmentAddedEvent(event)) {
      continue
    }
    attachments.push({
      attachmentId: event.attachmentId,
      displayType: await getComposerAttachmentDisplayType(event.blob, event.name, event.mimeType),
      mimeType: event.mimeType,
      name: event.name,
      size: event.size,
    })
  }
  return attachments
}
