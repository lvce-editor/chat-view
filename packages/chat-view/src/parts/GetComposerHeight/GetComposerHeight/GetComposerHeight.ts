import type { ChatState } from '../../ChatState/ChatState.ts'
import { estimateComposerHeight } from '../../EstimateComposerHeight/EstimateComposerHeight.ts'
import { getComposerWidth } from '../../GetComposerWidth/GetComposerWidth.ts'
import { getMaxComposerHeight } from '../../GetMaxComposerHeight/GetMaxComposerHeight.ts'
import { getMinComposerHeight } from '../../GetMinComposerHeight/GetMinComposerHeight.ts'
import { measureTextBlockHeight } from '../../MeasureTextBlockHeight/MeasureTextBlockHeight.ts'

export const getComposerHeight = async (state: ChatState, value: string, width = state.width): Promise<number> => {
  const { composerFontFamily, composerFontSize, composerLineHeight, maxComposerRows } = state
  if (value === '') {
    return composerLineHeight
  }
  const minimumHeight = getMinComposerHeight(composerLineHeight)
  const maximumHeight = getMaxComposerHeight(composerLineHeight, maxComposerRows)
  const content = value || ' '
  const composerWidth = getComposerWidth(width)
  const textAreaPadding = 0
  try {
    const measuredHeight = await measureTextBlockHeight(content, composerFontFamily, composerFontSize, `${composerLineHeight}px`, composerWidth)
    const height = Math.ceil(measuredHeight) + textAreaPadding
    return Math.max(minimumHeight, Math.min(maximumHeight, height))
  } catch {
    return Math.max(minimumHeight, Math.min(maximumHeight, estimateComposerHeight(value, composerLineHeight)))
  }
}
