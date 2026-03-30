import { getComposerWidth } from '../../GetComposerWidth/GetComposerWidth.ts'
import { fallbackComposerWidth } from '../ComposerAttachmentLayoutConstants.ts'

export const getAttachmentContainerWidth = (width: number): number => {
  if (width <= 0) {
    return fallbackComposerWidth
  }
  return Math.max(1, getComposerWidth(width))
}
