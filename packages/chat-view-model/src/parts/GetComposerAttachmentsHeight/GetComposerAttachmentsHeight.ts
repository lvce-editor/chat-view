import type { ComposerAttachment } from '../ViewModel/ViewModel.ts'

const composerAttachmentGap = 8
const composerAttachmentMarginBottom = 8
const composerAttachmentFontSize = 12
const composerAttachmentHorizontalPadding = 20
const composerAttachmentBorderWidth = 2
const composerAttachmentHeight = 26
const averageCharacterWidth = composerAttachmentFontSize * 0.6
const fallbackComposerWidth = 480

const getComposerWidth = (width: number): number => {
  return Math.max(1, width - 32)
}

const getAttachmentContainerWidth = (width: number): number => {
  if (width <= 0) {
    return fallbackComposerWidth
  }
  return Math.max(1, getComposerWidth(width))
}

const getComposerAttachmentLabel = (displayType: ComposerAttachment['displayType']): string => {
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

const getComposerAttachmentWidth = (attachment: ComposerAttachment, containerWidth: number): number => {
  const label = `${getComposerAttachmentLabel(attachment.displayType)} · ${attachment.name}`
  const estimatedWidth = Math.ceil(label.length * averageCharacterWidth) + composerAttachmentHorizontalPadding + composerAttachmentBorderWidth
  return Math.min(containerWidth, estimatedWidth)
}

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