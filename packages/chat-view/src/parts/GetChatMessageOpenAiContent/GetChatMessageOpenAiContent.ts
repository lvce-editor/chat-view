import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { OpenAiInputPart } from './OpenAiInputPart/OpenAiInputPart.ts'
import { getAttachmentTextPart } from './GetAttachmentTextPart/GetAttachmentTextPart.ts'

const getTextPart = (text: string): OpenAiInputPart => {
  return {
    text,
    type: 'input_text',
  }
}

export const getChatMessageOpenAiContent = (message: ChatMessage): readonly OpenAiInputPart[] => {
  const parts: OpenAiInputPart[] = []
  if (message.text) {
    parts.push(getTextPart(message.text))
  }
  for (const attachment of message.attachments ?? []) {
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
