import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { OpenAiInputTextPart } from './OpenAiInputPart/OpenAiInputPart.ts'
import type { OpenAiInputPart } from './OpenAiInputPart/OpenAiInputPart.ts'
import { getAttachmentTextPart } from './GetAttachmentTextPart/GetAttachmentTextPart.ts'

const getTextPart = (text: string, type: OpenAiInputTextPart['type']): OpenAiInputPart => {
  return {
    text,
    type,
  }
}

export const getChatMessageOpenAiContent = (message: ChatMessage): readonly OpenAiInputPart[] => {
  const parts: OpenAiInputPart[] = []
  const textPartType: OpenAiInputTextPart['type'] = message.role === 'assistant' ? 'output_text' : 'input_text'
  if (message.text) {
    parts.push(getTextPart(message.text, textPartType))
  }
  for (const attachment of message.attachments ?? []) {
    if (message.role === 'user' && attachment.displayType === 'image' && attachment.previewSrc) {
      parts.push({
        image_url: attachment.previewSrc,
        type: 'input_image',
      })
      continue
    }
    parts.push(getAttachmentTextPart(attachment, textPartType))
  }
  return parts
}
