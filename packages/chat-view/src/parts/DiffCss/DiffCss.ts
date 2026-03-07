import type { ChatState } from '../ChatState/ChatState.ts'

export const isEqual = (oldState: ChatState, newState: ChatState): boolean => {
  return (
    oldState.initial === newState.initial &&
    oldState.composerHeight === newState.composerHeight &&
    oldState.composerLineHeight === newState.composerLineHeight &&
    oldState.composerFontFamily === newState.composerFontFamily &&
    oldState.composerFontSize === newState.composerFontSize
  )
}
