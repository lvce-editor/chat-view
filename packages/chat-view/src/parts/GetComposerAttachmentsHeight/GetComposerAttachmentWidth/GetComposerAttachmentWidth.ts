import type { ComposerAttachment } from '../../ComposerAttachment/ComposerAttachment.ts'
import { averageCharacterWidth, composerAttachmentBorderWidth, composerAttachmentHorizontalPadding } from '../ComposerAttachmentLayoutConstants.ts'
import { getComposerAttachmentLabel } from '../GetComposerAttachmentLabel/GetComposerAttachmentLabel.ts'

export const getComposerAttachmentWidth = (attachment: ComposerAttachment, containerWidth: number): number => {
  const label = `${getComposerAttachmentLabel(attachment.displayType)} · ${attachment.name}`
  const estimatedWidth = Math.ceil(label.length * averageCharacterWidth) + composerAttachmentHorizontalPadding + composerAttachmentBorderWidth
  return Math.min(containerWidth, estimatedWidth)
}
