import type { ComposerAttachment } from '../ComposerAttachment/ComposerAttachment.ts'
import { composerAttachmentGap, composerAttachmentHeight, composerAttachmentMarginBottom } from './ComposerAttachmentLayoutConstants.ts'
import { getAttachmentContainerWidth } from './GetAttachmentContainerWidth/GetAttachmentContainerWidth.ts'
import { getComposerAttachmentWidth } from './GetComposerAttachmentWidth/GetComposerAttachmentWidth.ts'

export const getComposerAttachmentsHeight = (composerAttachments: readonly ComposerAttachment[], width: number): number => {
  if (composerAttachments.length === 0) {
    return 0
  }
  const containerWidth = getAttachmentContainerWidth(width)
  let currentRowWidth = 0
  let rowCount = 1
  for (const attachment of composerAttachments) {
    const attachmentWidth = getComposerAttachmentWidth(attachment, containerWidth)
    const nextRowWidth = currentRowWidth === 0 ? attachmentWidth : currentRowWidth + composerAttachmentGap + attachmentWidth
    if (currentRowWidth > 0 && nextRowWidth > containerWidth) {
      rowCount++
      currentRowWidth = attachmentWidth
    } else {
      currentRowWidth = nextRowWidth
    }
  }
  return rowCount * composerAttachmentHeight + (rowCount - 1) * composerAttachmentGap + composerAttachmentMarginBottom
}
