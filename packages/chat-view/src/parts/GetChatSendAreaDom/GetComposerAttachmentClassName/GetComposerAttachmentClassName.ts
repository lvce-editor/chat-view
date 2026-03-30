import type { ComposerAttachmentDisplayType } from '../../ComposerAttachment/ComposerAttachment.ts'
import * as ClassNames from '../../ClassNames/ClassNames.ts'

export const getComposerAttachmentClassName = (displayType: ComposerAttachmentDisplayType): string => {
  switch (displayType) {
    case 'file':
      return ClassNames.ChatComposerAttachment
    case 'image':
      return ClassNames.ChatComposerAttachmentImage
    case 'invalid-image':
      return ClassNames.ChatComposerAttachmentInvalidImage
    case 'text-file':
      return ClassNames.ChatComposerAttachmentTextFile
    default:
      return ClassNames.ChatComposerAttachment
  }
}
