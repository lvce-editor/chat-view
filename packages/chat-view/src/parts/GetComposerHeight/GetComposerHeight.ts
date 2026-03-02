import type { ChatState } from '../ChatState/ChatState.ts'
import { measureTextBlockHeight } from '../MeasureTextBlockHeight/MeasureTextBlockHeight.ts'

const getComposerWidth = (width: number): number => {
  return Math.max(1, width - 32)
}

const getMinComposerHeight = (lineHeight: number): number => {
  return lineHeight + 8
}

const estimateComposerHeight = (value: string, lineHeight: number): number => {
  const lineCount = value.split('\n').length
  return lineCount * lineHeight + 8
}

export const getComposerHeight = async (state: ChatState, value: string, width = state.width): Promise<number> => {
  const { composerFontFamily, composerFontSize, composerLineHeight } = state
  const minimumHeight = getMinComposerHeight(composerLineHeight)
  const content = value || ' '
  const composerWidth = getComposerWidth(width)
  try {
    const measuredHeight = await measureTextBlockHeight(content, composerFontFamily, composerFontSize, composerLineHeight, composerWidth)
    const height = Math.ceil(measuredHeight) + 8
    return Math.max(minimumHeight, height)
  } catch {
    return Math.max(minimumHeight, estimateComposerHeight(value, composerLineHeight))
  }
}

export const getMinComposerHeightForState = (state: ChatState): number => {
  return getMinComposerHeight(state.composerLineHeight)
}
