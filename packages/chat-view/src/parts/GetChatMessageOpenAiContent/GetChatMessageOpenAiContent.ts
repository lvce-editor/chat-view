import type { ChatMessage } from '../ChatMessage/ChatMessage.ts'
import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'

interface OpenAiInputTextPart {
  readonly text: string
  readonly type: 'input_text'
}

interface OpenAiInputImagePart {
  readonly image_url: string
  readonly type: 'input_image'
}

type OpenAiInputPart = OpenAiInputTextPart | OpenAiInputImagePart

const getAttachmentTextPart = (attachment: ComposerAttachment): OpenAiInputTextPart => {
  switch (attachment.displayType) {
    case 'file':
      return {
        text: `Attached file "${attachment.name}" (${attachment.mimeType || 'application/octet-stream'}, ${attachment.size} bytes).`,
        type: 'input_text',
      }
    case 'image':
      return {
        text: `Attached image "${attachment.name}" could not be encoded for the AI request.`,
        type: 'input_text',
      }
    case 'invalid-image':
      return {
        text: `Attached file "${attachment.name}" could not be processed as a valid image.`,
        type: 'input_text',
      }
    case 'text-file':
      return {
        text: attachment.textContent
          ? `Attached text file "${attachment.name}" (${attachment.mimeType || 'text/plain'}):\n\n${attachment.textContent}`
          : `Attached text file "${attachment.name}" (${attachment.mimeType || 'text/plain'}).`,
        type: 'input_text',
      }
  }
}

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
