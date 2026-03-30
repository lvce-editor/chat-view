import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { OpenAiInputPart } from './OpenAiInputPart/OpenAiInputPart.ts'
import { getAttachmentTextPart } from './GetAttachmentTextPart/GetAttachmentTextPart.ts'

export const getChatMessageOpenAiContent = (message: ChatMessage): string | readonly OpenAiInputPart[] => {
  if (!message.attachments || message.attachments.length === 0) {
    return message.text
  }
  const parts: OpenAiInputPart[] = []
  if (message.text) {
    parts.push({
      text: message.text,
      type: 'input_text',
    })
  }
  for (const attachment of message.attachments) {
    if (attachment.displayType === 'image' && attachment.previewSrc) {
      parts.push({
        image_url: attachment.previewSrc,
        type: 'input_image',
      })
      continue
    }
    parts.push(getAttachmentTextPart(attachment))
  }
  return parts
}
