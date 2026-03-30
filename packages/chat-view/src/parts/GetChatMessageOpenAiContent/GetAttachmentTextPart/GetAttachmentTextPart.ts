import type { ComposerAttachment } from '../../ComposerAttachment/ComposerAttachment.ts'
import type { OpenAiInputTextPart } from '../OpenAiInputPart/OpenAiInputPart.ts'

export const getAttachmentTextPart = (attachment: ComposerAttachment): OpenAiInputTextPart => {
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
