import type { ComposerAttachmentDisplayType } from '../../ComposerAttachment/ComposerAttachment.ts'

export const getComposerAttachmentLabel = (displayType: ComposerAttachmentDisplayType): string => {
  switch (displayType) {
    case 'file':
      return 'File'
    case 'image':
      return 'Image'
    case 'invalid-image':
      return 'Invalid image'
    case 'text-file':
      return 'Text file'
    default:
      return displayType
  }
}
